import fs from "fs";
import { UserBalance } from "../types";
import { OrderBook } from "./OrderBook";
import { BASE_CURRENCY } from "../types";
import { CANCEL_ORDER, CREATE_ORDER, GET_BALANCE, GET_DEPTH, MessageFromApi, ON_RAMP, GET_OPEN_ORDERS } from "../types/fromApi";
import { Fill, Order } from "../types/orderBookTypes";
import { RedisManager } from "../RedisManager";
import { ORDER_UPDATE } from "../types/toDb";
import { DEPTH, OPEN_ORDERS, ORDER_CANCELLED, ORDER_PLACED } from "../types/toApi";

export class Engine {
    private orderbooks: OrderBook[] = [];
    private balances: Map<string, UserBalance> = new Map();

    constructor() {
        let snapshot = null;
        try {
            if (process.env.WITH_SNAPSHOT) {
                snapshot = fs.readFileSync("./snapshot.json");
            }
        } catch (error) {
            console.log("No snapshot found");
        }
        if (snapshot) {
            const snapshotData = JSON.parse(snapshot.toString());
            this.orderbooks = snapshotData.orderbooks.map((o: OrderBook) => new OrderBook(o.bids, o.asks, o.baseAsset, o.lastTradeId, o.currentPrice, o.bidDepth, o.askDepth));
            this.balances = new Map(snapshotData.balances);
        } else {
            this.orderbooks = [new OrderBook([], [], "TATA")];
            this.setBaseBalances();
        }

        setInterval(() => {
            this.saveSnapShot();
        }, 1000 * 15);
    }

    saveSnapShot() {
        const snapShotData = {
            orderbooks: this.orderbooks.map(o => o.getSnapshot()),
            balances: Array.from(this.balances.entries())
        };
        fs.writeFileSync("./snapshot.json", JSON.stringify(snapShotData));
    }

    process({ message, clientId }: { message: MessageFromApi, clientId: string }) {
        switch (message.type) {
            case CREATE_ORDER:
                try {
                    const { executedQty, fills, orderId } = this.createOrder(message.data.market, message.data.price, message.data.quantity, message.data.side, clientId);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: ORDER_PLACED,
                        payload: {
                            orderId,
                            executedQty,
                            fills
                        }
                    });
                } catch (error) {
                    console.log(error);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: ORDER_CANCELLED,
                        payload: {
                            orderId: "",
                            executedQty: 0,
                            remainingQty: 0
                        }
                    });

                }
                break;
            case CANCEL_ORDER:
                try {
                    const orderId = message.data.orderId;
                    const cancelMarket = message.data.market;
                    const cancelOrderBook = this.orderbooks.find(o => o.ticker() === cancelMarket);
                    const quoteAsset = cancelMarket.split("_")[1];
                    if (!cancelOrderBook) {
                        throw new Error("No orderbook found for market");
                    }

                    const order = cancelOrderBook.asks.find(o => o.orderId === orderId) || cancelOrderBook.bids.find(o => o.orderId === orderId);
                    if (!order) {
                        throw new Error("Order not found");
                    }

                    if (order.side === "buy") {
                        const price = cancelOrderBook.cancelBid(order);
                        const leftQty = (order.quantity - order.filled) * order.price;
                        const userBalances = this.balances.get(order.userId);

                        if (userBalances && userBalances[BASE_CURRENCY]) {
                            userBalances[BASE_CURRENCY].available += leftQty;
                            userBalances[BASE_CURRENCY].locked -= leftQty;
                        }

                        if (price) {
                            this.wsSendUpdatedDepth(price.toString(), cancelMarket);
                        }
                    } else {
                        const price = cancelOrderBook.cancelAsk(order);
                        const leftQty = (order.quantity - order.filled);
                        const userBalances = this.balances.get(order.userId);

                        if (userBalances && userBalances[quoteAsset]) {
                            userBalances[quoteAsset].available += leftQty;
                            userBalances[quoteAsset].locked -= leftQty;
                        }

                        if (price) {
                            this.wsSendUpdatedDepth(price.toString(), cancelMarket);
                        }
                    }

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: ORDER_CANCELLED,
                        payload: {
                            orderId,
                            executedQty: 0,
                            remainingQty: 0
                        }
                    });

                } catch (error) {
                    console.log("Error while cancelling order");
                    console.log(error);

                }
                break;
            case GET_OPEN_ORDERS:
                try {
                    const orderbook = this.orderbooks.find(o => o.ticker() === message.data.market);
                    if (!orderbook) {
                        throw new Error("No orderbook found for market");
                    }
                    const openOrders = orderbook.getOpenOrders(message.data.userId);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: OPEN_ORDERS,
                        payload: openOrders
                    });
                } catch (error) {
                    console.log("Error while getting open orders");
                    console.log(error);
                }
                break;
            case ON_RAMP:
                const userId = message.data.userId;
                const amount = Number(message.data.amount);
                this.onRamp(userId, amount);
                break;
            case GET_DEPTH:
                const market = message.data.market;
                try {
                    const orderbook = this.orderbooks.find(o => o.ticker() === market);
                    if (!orderbook) {
                        throw new Error("No orderbook found for market");
                    }
                    const depth = orderbook.getDepth();
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: DEPTH,
                        payload: { market, bids: depth.bids, asks: depth.asks }
                    });
                } catch (error) {
                    console.log("Error while getting depth");
                    console.log(error);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: DEPTH,
                        payload: { market, bids: [], asks: [] }
                    });
                }
                break;
            case GET_BALANCE:
                try {
                    const userId = message.data.userId;
                    const userBalance = this.balances.get(userId);
                    if (!userBalance) {
                        throw new Error("User balance not found");
                    }
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: GET_BALANCE,
                        payload: userBalance
                    });
                } catch (error) {
                    console.log("Error while getting balance");
                    console.log(error);
                }
                break;
        }
    }

    createOrder(market: string, price: string, quantity: string, side: "buy" | "sell", userId: string) {
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        const baseAsset = market.split("_")[0];
        const quoteAsset = market.split("_")[1];
        if (!orderbook) {
            throw new Error("No orderbook found for market");
        }

        this.checkAndLockFunds(baseAsset, quoteAsset, side, userId, price, quantity);

        const order: Order = {
            price: Number(price),
            quantity: Number(quantity),
            orderId: this.getRandomId(),
            userId,
            market,
            side,
            filled: 0
        };

        const { executedQty, fills } = orderbook.addOrder(order);
        this.updateBalances(userId, baseAsset, quoteAsset, side, fills);
        this.createDBTrades(order, fills, market);
        this.updateDBOrders(order, executedQty, fills, market);
        this.wsDepthUpdate(fills, market, price, side);
        this.wsTradeUpdate(fills, userId, market);

        return { executedQty, fills, orderId: order.orderId };
    }

    wsTradeUpdate(fills: Fill[], userId: string, market: string) {
        fills.forEach(fill => {
            RedisManager.getInstance().publishMessage(`trades@${market}`, {
                stream: `trades@${market}`,
                data: {
                    e: "trade",
                    t: fill.tradeId,
                    m: fill.marketSide === "sell",
                    p: fill.price,
                    q: fill.qty.toString(),
                    s: userId
                }
            });
        });
    }

    wsDepthUpdate(fills: Fill[], market: string, price: string, side: "buy" | "sell") {
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        if (!orderbook) {
            throw new Error("No orderbook found for market");
        }
        const depth = orderbook.getDepth();
        if (side === "buy") {
            const updatedAsks = depth?.asks.filter(x => fills.map(f => f.price).includes(x[0].toString()));
            const updatesBids = depth?.bids.find(x => x[0] == price);
            RedisManager.getInstance().publishMessage(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updatedAsks,
                    b: updatesBids ? [updatesBids] : [],
                    e: "depth"
                }
            });
        } else {
            const updatedBids = depth?.bids.filter(x => fills.map(f => f.price).includes(x[0].toString()));
            const updatesAsks = depth?.asks.find(x => x[0] == price);
            RedisManager.getInstance().publishMessage(`depth@${market}`, {
                stream: `depth@${market}`,
                data: {
                    a: updatesAsks ? [updatesAsks] : [],
                    b: updatedBids,
                    e: "depth"
                }
            });
        }
    }

    wsSendUpdatedDepth(price: string, market: string) {
        const orderbook = this.orderbooks.find(o => o.ticker() === market);
        if (!orderbook) {
            throw new Error("No orderbook found for market");
        }
        const depth = orderbook.getDepth();
        RedisManager.getInstance().publishMessage(`depth@${market}`, {
            stream: `depth@${market}`,
            data: {
                a: depth.asks,
                b: depth.bids,
                e: "depth"
            }
        });
    }

    updateDBOrders(order: Order, executedQty: number, fills: Fill[], market: string) {
        RedisManager.getInstance().pushMessage({
            type: ORDER_UPDATE,
            data: {
                orderId: order.orderId,
                executedQty: executedQty,
                market,
                price: order.price.toString(),
                quantity: order.quantity.toString(),
                side: order.side
            }
        });

        fills.forEach(fill => {
            RedisManager.getInstance().pushMessage({
                type: ORDER_UPDATE,
                data: {
                    orderId: fill.marketOrderId,
                    executedQty: fill.qty,
                    market: fill.market,
                    price: fill.price,
                }
            });
        });
    }

    createDBTrades(order: Order, fills: Fill[], market: string) {
        fills.forEach(fill => {
            RedisManager.getInstance().pushMessage({
                type: "TRADE_ADDED",
                data: {
                    id: order.orderId,
                    isBuyerMaker: order.side === "buy",
                    price: order.price.toString(),
                    quantity: fill.qty.toString(),
                    quoteQuantity: (fill.qty * Number(fill.price)).toString(),
                    timestamp: Date.now(),
                    market
                }
            })
        });
    }

    updateBalances(userId: string, baseAsset: string, quoteAsset: string, side: "buy" | "sell", fills: Fill[]) {
        if (side === "buy") {
            fills.forEach(fill => {
                const otherUserBalance = this.balances.get(fill.otherUserId);
                const userBalance = this.balances.get(userId);

                if (otherUserBalance && otherUserBalance[quoteAsset]) {
                    otherUserBalance[quoteAsset].available += Number(fill.qty) * Number(fill.price);
                }
                if (userBalance && userBalance[quoteAsset]) {
                    userBalance[quoteAsset].locked -= Number(fill.qty) * Number(fill.price);
                }

                if (otherUserBalance && otherUserBalance[baseAsset]) {
                    otherUserBalance[baseAsset].locked -= Number(fill.qty);
                }

                if (userBalance && userBalance[baseAsset]) {
                    userBalance[baseAsset].available += Number(fill.qty);
                }

            })
        } else {
            fills.forEach(fill => {
                const otherUserBalance = this.balances.get(fill.otherUserId);
                const userBalance = this.balances.get(userId);

                if (otherUserBalance && otherUserBalance[quoteAsset]) {
                    otherUserBalance[quoteAsset].locked -= Number(fill.qty) * Number(fill.price);
                }
                if (userBalance && userBalance[quoteAsset]) {
                    userBalance[quoteAsset].available += Number(fill.qty) * Number(fill.price);
                }

                if (otherUserBalance && otherUserBalance[baseAsset]) {
                    otherUserBalance[baseAsset].available += Number(fill.qty);
                }
                if (userBalance && userBalance[baseAsset]) {
                    userBalance[baseAsset].locked -= Number(fill.qty);
                }
            })
        }
    }

    checkAndLockFunds(baseAsset: string, quoteAsset: string, side: "buy" | "sell", userId: string, price: string, quantity: string) {
        if (side === "buy") {
            const baseBalance = this.balances.get(userId)?.[quoteAsset]?.available || 0;
            if (baseBalance < Number(quantity) * Number(price)) {
                throw new Error("Insufficient funds");
            }
            const userBalance = this.balances.get(userId);
            if (!userBalance || !userBalance[quoteAsset]) {
                throw new Error("User balance not found");
            }
            userBalance[quoteAsset].available -= Number(quantity) * Number(price);
            userBalance[quoteAsset].locked += Number(quantity) * Number(price);

        } else {
            const baseBalance = this.balances.get(userId)?.[baseAsset]?.available || 0;
            if (baseBalance < Number(quantity)) {
                throw new Error("Insufficient funds");
            }
            const userBalance = this.balances.get(userId);
            if (!userBalance || !userBalance[baseAsset]) {
                throw new Error("User balance not found");
            }
            userBalance[baseAsset].available -= Number(quantity);
            userBalance[baseAsset].locked += Number(quantity);
        }
    }

    onRamp(userId: string, amount: number) {
        const userBalance = this.balances.get(userId);
        if (!userBalance) {
            this.balances.set(userId, {
                [BASE_CURRENCY]: {
                    available: amount,
                    locked: 0
                }
            });
        } else {
            userBalance[BASE_CURRENCY].available += amount;
        }
    }

    setBaseBalances() {
        this.balances.set("1", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });

        this.balances.set("2", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });

        this.balances.set("5", {
            [BASE_CURRENCY]: {
                available: 10000000,
                locked: 0
            },
            "TATA": {
                available: 10000000,
                locked: 0
            }
        });
    }

    getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
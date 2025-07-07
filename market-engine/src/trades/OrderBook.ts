import { BASE_CURRENCY } from "../types";
import { Fill, Order } from "../types/orderBookTypes";

export class OrderBook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    lastTradeId: number;
    currentPrice: number;
    bidDepth: { [price: string]: number };
    askDepth: { [price: string]: number };

    constructor(
        bids: Order[],
        asks: Order[],
        baseAsset: string,
        lastTrdaeId?: number,
        currentPrice?: number,
        bidDepth?: { [price: string]: number },
        askDepth?: { [price: string]: number }) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTrdaeId || 0;
        this.currentPrice = currentPrice || 0;
        this.bidDepth = bidDepth || {};
        this.askDepth = askDepth || {};
    }

    ticker() {
        return `${this.baseAsset}_${this.quoteAsset}`;
    }

    getSnapshot() {
        return {
            baseAsset: this.baseAsset,
            lastTradeId: this.lastTradeId,
            currentPrice: this.currentPrice,
            bids: this.bids,
            asks: this.asks,
        }
    }

    addOrder(order: Order): { executedQty: number, fills: Fill[] } {
        if (order.side === "buy") {
            const { executedQty, fills } = this.matchBid(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                return { executedQty, fills };
            }
            this.bids.push(order);
            this.bidDepth[order.price] = (this.bidDepth[order.price] || 0) + order.quantity;
            return { executedQty, fills };
        } else {
            const { executedQty, fills } = this.matchAsk(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                return { executedQty, fills };
            }
            this.asks.push(order);
            this.askDepth[order.price] = (this.askDepth[order.price] || 0) + order.quantity;
            return { executedQty, fills };
        }
    }

    matchBid(order: Order): { executedQty: number, fills: Fill[] } {
        let executedQty = 0;
        const fills: Fill[] = [];

        for (let i = 0; i < this.asks.length; i++) {

            // self trade prevention
            if (this.asks[i].userId === order.userId) {
                continue; // skip matching with own order
            }

            if (this.asks[i].price > order.price && executedQty < order.quantity) {
                const filledQty = Math.min(order.quantity - executedQty, this.asks[i].quantity);
                executedQty += filledQty;
                this.asks[i].filled += filledQty;
                this.askDepth[this.asks[i].price] = (this.askDepth[this.asks[i].price] || 0) - filledQty;

                if (this.askDepth[this.asks[i].price] <= 0) {
                    delete this.askDepth[this.asks[i].price];
                }

                fills.push({
                    price: this.asks[i].price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    otherUserId: this.asks[i].userId,
                    marketOrderId: this.asks[i].orderId,
                    market: this.asks[i].market,
                    marketSide: "sell",
                });
            }
        }

        for (let i = 0; i < this.asks.length; i++) {
            if (this.asks[i].filled === this.asks[i].quantity) {
                this.asks.splice(i, 1);
                i--;
            }
        }

        return { executedQty, fills };
    }

    matchAsk(order: Order): { executedQty: number, fills: Fill[] } {
        let executedQty = 0;
        const fills: Fill[] = [];

        for (let i = 0; i < this.bids.length; i++) {

            // self trade prevention
            if (this.bids[i].userId === order.userId) {
                continue; // skip matching with own order
            }

            if (this.bids[i].price >= order.price && executedQty < order.quantity) {
                const filledQty = Math.min(order.quantity - executedQty, this.bids[i].quantity);
                executedQty += filledQty;
                this.bids[i].filled += filledQty;
                this.bidDepth[this.bids[i].price] = (this.bidDepth[this.bids[i].price] || 0) - filledQty;

                if (this.bidDepth[this.bids[i].price] <= 0) {
                    delete this.bidDepth[this.bids[i].price];
                }

                fills.push({
                    price: this.bids[i].price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    otherUserId: this.bids[i].userId,
                    marketOrderId: this.bids[i].orderId,
                    market: this.bids[i].market,
                    marketSide: "buy",
                });
            }
        }

        for (let i = 0; i < this.bids.length; i++) {
            if (this.bids[i].filled === this.bids[i].quantity) {
                this.bids.splice(i, 1);
                i--;
            }
        }

        return { executedQty, fills };
    }

    getDepth() {
        const bids: [string, string][] = [];
        const asks: [string, string][] = [];

        for (const price in this.bidDepth) {
            bids.push([price, this.bidDepth[price].toString()]);
        }

        for (const price in this.askDepth) {
            asks.push([price, this.askDepth[price].toString()]);
        }

        return { bids, asks };
    }

    getOpenOrders(userId: string): Order[] {
        const asks = this.asks.filter(order => order.userId === userId);
        const bids = this.bids.filter(order => order.userId === userId);
        return [...asks, ...bids];
    }

    cancelBid(order: Order) {
        const index = this.bids.findIndex(bid => bid.orderId === order.orderId);
        if (index !== -1) {
            const price = this.bids[index].price;
            this.bids.splice(index, 1);
            return price;
        }
    }

    cancelAsk(order: Order) {
        const index = this.asks.findIndex(ask => ask.orderId === order.orderId);
        if (index !== -1) {
            const price = this.asks[index].price;
            this.asks.splice(index, 1);
            return price;
        }
    }


}
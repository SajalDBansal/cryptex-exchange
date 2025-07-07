import axios from "axios";

const BASE_URL = "http://localhost:3000";
const TOATK_BIDS = 15;
const TOATK_ASKS = 15;
const MARKET = "TATA_INR";
const USER_ID = "5";

async function main() {
    const price = 1000 * Math.random() + 10;
    const openOrders = await getOpenOrders();

    const totalBids = openOrders.data.filter((o: any) => o.side === "buy").length;
    const totalAsks = openOrders.data.filter((o: any) => o.side === "sell").length;

    const cancelledBids = await cancelBidsMoreThan(openOrders.data, price);
    const cancelledAsks = await cancelAsksLessThan(openOrders.data, price);

    let bidsToAdd = TOATK_BIDS - totalBids - cancelledBids;
    let asksToAdd = TOATK_ASKS - totalAsks - cancelledAsks;

    while (bidsToAdd > 0 || asksToAdd > 0) {
        if (bidsToAdd > 0) {
            await axios.post(`${BASE_URL}/api/v1/order/`, {
                market: MARKET,
                price: (price - Math.random() * 1).toFixed(1).toString(),
                quantity: "1",
                side: "buy",
                userId: USER_ID
            });
            bidsToAdd--;
        }
        if (asksToAdd > 0) {
            await axios.post(`${BASE_URL}/api/v1/order/`, {
                market: MARKET,
                price: (price + Math.random() * 1).toFixed(1).toString(),
                quantity: "1",
                side: "sell",
                userId: USER_ID
            });
            asksToAdd--;
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    main();
}

async function getOpenOrders() {
    const response = await axios.get(`${BASE_URL}/api/v1/order/open/${USER_ID}/${MARKET}`);
    return response.data;
}

async function cancelBidsMoreThan(openOrder: any[], price: number) {
    let promise: any[] = [];
    openOrder.map(o => {
        if (o.side === "buy" && (o.price < price || Math.random() < 0.1)) {
            promise.push(axios.delete(`${BASE_URL}/api/v1/order/`), {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            });
        }
    })
    await Promise.all(promise);
    return promise.length;
}

async function cancelAsksLessThan(openOrder: any[], price: number) {
    let promise: any[] = [];
    openOrder.map(o => {
        if (o.side === "sell" && (o.price < price || Math.random() < 0.5)) {
            promise.push(axios.delete(`${BASE_URL}/api/v1/order/`), {
                data: {
                    orderId: o.orderId,
                    market: MARKET
                }
            });
        }
    })
    await Promise.all(promise);
    return promise.length;
}

main();
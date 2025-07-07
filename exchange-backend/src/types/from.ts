export type MessageFromOrderBook = {
    type: "DEPTH",
    payload: {
        market: string,
        bids: [string, string][],
        asks: [string, string][],
    }
} | {
    type: "ORDER_PLACED"
    payload: {
        orderId: string,
        executedQty: number,
        fills: Fill[]
    }
} | {
    type: "ORDER_CANCELLED",
    payload: {
        orderId: string,
        executedQty: number,
        remainingQty: number,
    }
} | {
    type: "OPEN_ORDERS",
    payload: Order[]
} | {
    type: "GET_BALANCE",
    payload: {
        [key: string]: {
            available: number;
            locked: number;
        }
    }
};

export type Fill = {
    price: string,
    qty: number,
    tradeId: number,
    otherUserId: string,
    marketOrderId: string,
    market: string,
    marketSide: "buy" | "sell",
}

export type Order = {
    price: number,
    quantity: number,
    orderId: string,
    userId: string,
    market: string,
    side: "buy" | "sell",
    filled: number
}

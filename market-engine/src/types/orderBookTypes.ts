export type Order = {
    price: number,
    quantity: number,
    orderId: string,
    userId: string,
    market: string,
    side: "buy" | "sell",
    filled: number
}

export type Fill = {
    price: string,
    qty: number,
    tradeId: number,
    otherUserId: string,
    marketOrderId: string,
    market: string,
    marketSide: "buy" | "sell",
}

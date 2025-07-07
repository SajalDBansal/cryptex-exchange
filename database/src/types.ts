export type DbMessage = {
    type: "TRADE_ADDED",
    data: {
        id: string,
        isBuyerMaker: boolean,
        price: string,
        quantity: string,
        quoteQuantity: string,
        timestamp: number,
        market: string
    }
} | {
    type: "ORDER_UPDATE",
    data: {
        orderId: string,
        executedQty: number,
        market?: string,
        price?: string,
        quantity?: string,
        side?: "buy" | "sell",
    }
} | {
    type: "TICKERS_UPDATE",
    data: {
        symbol: string,
        firstPrice: string,
        high: string,
        lastPrice: string,
        low: string,
        priceChange: string,
        priceChangePercent: string,
        quoteVolume: string,
        volume: string,
        trades: string,
    }
}

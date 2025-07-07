export const TRADE_ADDED = "TRADE_ADDED";
export const ORDER_UPDATE = "ORDER_UPDATE";
export const TICKERS_UPDATE = "TICKERS_UPDATE";

export type DbMessage = {
    type: typeof TRADE_ADDED,
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
    type: typeof ORDER_UPDATE,
    data: {
        orderId: string,
        executedQty: number,
        market?: string,
        price?: string,
        quantity?: string,
        side?: "buy" | "sell",
    }
} | {
    type: typeof TICKERS_UPDATE,
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

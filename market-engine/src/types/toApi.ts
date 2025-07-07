import { Fill, Order } from "./orderBookTypes";

export const ORDER_PLACED = "ORDER_PLACED";
export const ORDER_CANCELLED = "ORDER_CANCELLED";
export const OPEN_ORDERS = "OPEN_ORDERS";
export const GET_BALANCE = "GET_BALANCE";
export const DEPTH = "DEPTH";

export type MessageToApi = {
    type: typeof DEPTH,
    payload: {
        market: string,
        bids: [string, string][],
        asks: [string, string][],
    }
} | {
    type: typeof ORDER_PLACED
    payload: {
        orderId: string,
        executedQty: number,
        fills: Fill[]
    }
} | {
    type: typeof ORDER_CANCELLED,
    payload: {
        orderId: string,
        executedQty: number,
        remainingQty: number,
    }
} | {
    type: typeof OPEN_ORDERS,
    payload: Order[]
} | {
    type: typeof GET_BALANCE,
    payload: {
        [key: string]: {
            available: number;
            locked: number;
        }
    }
};
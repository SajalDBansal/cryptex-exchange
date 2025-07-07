export const TICKER = "TICKER";
export const DEPTH = "DEPTH";

export type TickerUpdateMessage = {
    type: typeof TICKER,
    data: {
        c?: string,
        h?: string,
        l?: string,
        v?: string,
        V?: string,
        s?: string,
        id: number,
        e: "ticker"
    }
}

export type DepthUpdateMessage = {
    type: typeof DEPTH,
    data: {
        a?: [string, string][],
        b?: [string, string][],
        id: number,
        e: "depth"
    }
}

export type OutgoingMessage = TickerUpdateMessage | DepthUpdateMessage;
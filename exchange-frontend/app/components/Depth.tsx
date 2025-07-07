"use cleint";

import { useEffect, useState } from "react";
import TradeBook from "./TradeBook";
import OrderBook from "./OrderBook";
import { getTrades } from "../utils/httpClient";

export default function Depth({ market }: { market: string }) {
    const [bookOrTrade, setBookOrTrade] = useState<"book" | "trades">("book");

    return (
        <div className="flex flex-col w-full md:w-[400px] lg:w-[332px] overflow-hidden rounded-lg h-[530px]">
            <div className="flex flex-col h-full">

                {/* Tabs */}
                <div className="flex justify-between p-2">
                    <div className="flex gap-x-1 text-sm">
                        <button
                            onClick={() => setBookOrTrade("book")}
                            className={`py-2 px-3 ${bookOrTrade == "book" && "bg-white/6 rounded-xl"} `}>
                            Book
                        </button>
                        <button
                            onClick={() => setBookOrTrade("trades")}
                            className={`py-2 px-3 ${bookOrTrade == "trades" && "bg-white/6 rounded-xl"} `}>
                            Trades
                        </button>
                    </div>
                </div>

                {/* Order Book */}
                <OrderBook market={market} className={`${bookOrTrade == "book" ? "flex" : "hidden"}`} />

                {/* Trade Book */}
                <TradeBook market={market} className={`${bookOrTrade == "trades" ? "flex" : "hidden"}`} />
            </div>
        </div>
    );
}
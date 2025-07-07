"use client";

import { useEffect, useState } from "react";
import { SignalingManager } from "../utils/SignallingManager";
import { Trade } from "../utils/types";
import { getTrades } from "../utils/httpClient";
import Trades from "./depth/Trades";

export default function TradeBook({ market, className }: { market: string, className: string }) {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [price, setPrice] = useState("");

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("trade", (data: any) => {

            setTrades((prevTrades) => {
                const newTrades = [...prevTrades];
                newTrades.unshift(data);
                return newTrades.slice(0, 20);
            });
        }, `TRADE-${market}`);

        SignalingManager.getInstance().sendMessage({ "method": "SUBSCRIBE", "params": [`trade.${market}`] });


        getTrades(market).then(t => {
            setTrades(t.slice(0, 20).reverse())
            setPrice(t[0].price);
        });

        return () => {
            SignalingManager.getInstance().sendMessage({ "method": "UNSUBSCRIBE", "params": [`trade.200ms.${market}`] });
            SignalingManager.getInstance().deRegisterCallback("trade", `TRADE-${market}`);
        }
    }, [])

    return (
        <div className={`flex flex-col grow overflow-y-hidden ${className}`}>
            <div className="flex flex-col h-full grow overflow-x-hidden" data-id="order-book">
                {/* Table header */}
                <div className="flex flex-row min-w-0 gap-1 px-3 py-2">
                    <div className="flex justify-between flex-row w-2/3 min-w-0 gap-1">
                        <p className="font-medium truncate text-xs">Price (USD)</p>
                        <button
                            type="button"
                            tabIndex={0}
                            className="font-medium transition-opacity hover:cursor-pointer hover:opacity-80 h-auto truncate text-right text-xs text-gray-400"
                        >
                            Qty (BTC)
                        </button>
                    </div>
                </div>

                {/* Trade book */}
                <div className="flex flex-col no-scrollbar h-full flex-1 overflow-y-auto scrollbar-hidden font-sans">
                    <div className="flex flex-col flex-1">
                        <div className="flex justify-end h-full w-full flex-col-reverse">
                            {trades && <Trades trades={trades} />}
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}
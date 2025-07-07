import { getDepth } from "../utils/httpClient";
import AskList from "./depth/AskList";
import BidsList from "./depth/BidsList";
import { SignalingManager } from "../utils/SignallingManager";
import { useEffect, useState } from "react";
import { Ticker, TickerForPrice } from "../utils/types";

export default function OrderBook({ market, className }: { market: string, className: string }) {
    const [showBook, setShowBook] = useState<"bids" | "asks" | "all">("all");
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [ticker, setTicker] = useState<TickerForPrice | null>();

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("depth", (data: any) => {

            setBids((originalBids) => {
                let bidsAfterUpdate = [...(originalBids || [])];

                for (let i = 0; i < bidsAfterUpdate.length; i++) {
                    for (let j = 0; j < data.bids.length; j++) {
                        if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                            bidsAfterUpdate[i][1] = data.bids[j][1];
                            break;
                        }
                    }
                }
                return bidsAfterUpdate;
            });

            setAsks((originalAsks) => {
                const asksAfterUpdate = [...(originalAsks || [])];

                for (let i = 0; i < asksAfterUpdate.length; i++) {
                    for (let j = 0; j < data.asks.length; j++) {
                        if (asksAfterUpdate[i][0] === data.asks[j][0]) {
                            asksAfterUpdate[i][1] = data.asks[j][1];
                            break;
                        }
                    }
                }

                return asksAfterUpdate;
            });

        }, `DEPTH-${market}`);

        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>) => setTicker(prevTicker => ({
            lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? '',
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
        })), `TICKER-${market}`);

        SignalingManager.getInstance().sendMessage({ "method": "SUBSCRIBE", "params": [`depth.${market}`] });

        getDepth(market).then(d => {
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        return () => {
            SignalingManager.getInstance().sendMessage({ "method": "UNSUBSCRIBE", "params": [`depth.200ms.${market}`] });
            SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
        }

    }, [])

    // Calculate the ratio between the total ask and bid sizes
    let askTotal = 0;
    let bidTotal = 0;

    if (asks && asks.length > 0) {
        askTotal = asks.reduce((acc, [, size]) => acc + parseFloat(size), 0);
    }
    if (bids && bids.length > 0) {
        bidTotal = bids.reduce((acc, [, size]) => acc + parseFloat(size), 0);
    }

    let askRatio = 0;
    let bidRatio = 0;
    if (askTotal + bidTotal > 0) {
        askRatio = (askTotal / (askTotal + bidTotal)) * 100;
        bidRatio = (bidTotal / (askTotal + bidTotal)) * 100;
    }

    useEffect(() => {
        if (showBook === "all") {
            const container = document.getElementById('scrollContainer');
            if (container) {
                container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;
            }
        }
    }, [asks, bids]);

    return (
        <div className={`flex flex-col grow overflow-y-hidden ${className}`}>
            <div className="flex flex-col h-full grow overflow-x-hidden" data-id="order-book">
                {/* Controls */}
                <div className="flex items-center justify-between flex-row pl-2">
                    <div className="flex items-center justify-center flex-row gap-2">
                        {/* Buy Buttons */}
                        <button
                            onClick={() => setShowBook("bids")}
                            className="rounded-sm flex h-6 w-6 items-center justify-center hover:brightness-125 focus:outline-hidden disabled:cursor-not-allowed bg-base-background-l1"
                        >
                            {/* Buy SVG */}
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="8" height="2" fill="#00c278" />
                                <rect x="3" y="7" width="8" height="2" fill="#00c278" />
                                <rect x="3" y="11" width="8" height="2" fill="#00c278" />
                                <rect x="3" y="15" width="8" height="2" fill="#00c278" />
                                <rect x="3" y="19" width="8" height="2" fill="#00c278" />
                                <rect x="13" y="3" width="8" height="2" fill="#75798a" />
                                <rect x="13" y="7" width="8" height="2" fill="#75798a" />
                                <rect x="13" y="11" width="8" height="2" fill="#75798a" />
                                <rect x="13" y="15" width="8" height="2" fill="#75798a" />
                                <rect x="13" y="19" width="8" height="2" fill="#75798a" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowBook("asks")}
                            className="rounded-sm flex h-6 w-6 items-center justify-center hover:brightness-125 focus:outline-hidden disabled:cursor-not-allowed bg-base-background-l1">
                            {/* Sell SVG */}
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="8" height="2" fill="#75798a" />
                                <rect x="3" y="7" width="8" height="2" fill="#75798a" />
                                <rect x="3" y="11" width="8" height="2" fill="#75798a" />
                                <rect x="3" y="15" width="8" height="2" fill="#75798a" />
                                <rect x="3" y="19" width="8" height="2" fill="#75798a" />
                                <rect x="13" y="3" width="8" height="2" fill="#fd4b4e" />
                                <rect x="13" y="7" width="8" height="2" fill="#fd4b4e" />
                                <rect x="13" y="11" width="8" height="2" fill="#fd4b4e" />
                                <rect x="13" y="15" width="8" height="2" fill="#fd4b4e" />
                                <rect x="13" y="19" width="8" height="2" fill="#fd4b4e" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setShowBook("all")}
                            className="rounded-sm flex h-6 w-6 items-center justify-center hover:brightness-125 focus:outline-hidden disabled:cursor-not-allowed bg-base-background-l2">
                            {/* All SVG */}
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="8" height="2" fill="#00c278" />
                                <rect x="3" y="7" width="8" height="2" fill="#00c278" />
                                <rect x="3" y="11" width="8" height="2" fill="#00c278" />
                                <rect x="3" y="15" width="8" height="2" fill="#00c278" />
                                <rect x="3" y="19" width="8" height="2" fill="#00c278" />
                                <rect x="13" y="3" width="8" height="2" fill="#fd4b4e" />
                                <rect x="13" y="7" width="8" height="2" fill="#fd4b4e" />
                                <rect x="13" y="11" width="8" height="2" fill="#fd4b4e" />
                                <rect x="13" y="15" width="8" height="2" fill="#fd4b4e" />
                                <rect x="13" y="19" width="8" height="2" fill="#fd4b4e" />
                            </svg>
                        </button>
                    </div>
                    {/* Depth controls */}
                    <div className="flex items-center justify-between flex-row px-3">
                        <div className="flex items-center flex-row">
                            <button
                                type="button"
                                disabled
                                className="rounded-2xl transition hover:text-white p-1 bg-transparent"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-minus"
                                >
                                    <path d="M5 12h14"></path>
                                </svg>
                            </button>
                            <p className="font-medium mx-0.5 text-center text-xs select-none" style={{ width: "3ch" }}>
                                0.1
                            </p>
                            <button
                                type="button"
                                tabIndex={0}
                                className="rounded-md transition hover:text-white p-1 bg-white/8"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-plus"
                                >
                                    <path d="M5 12h14"></path>
                                    <path d="M12 5v14"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table header */}
                <div className="flex flex-row min-w-0 gap-1 px-3 py-2">
                    <div className="flex justify-between flex-row w-2/3 min-w-0 gap-1">
                        <p className="font-medium truncate text-xs">Price (USD)</p>
                        <button
                            type="button"
                            tabIndex={0}
                            className="font-medium transition-opacity hover:cursor-pointer hover:opacity-80 h-auto truncate text-right text-xs text-gray-400"
                        >
                            Size (BTC)
                        </button>
                    </div>
                    <button
                        type="button"
                        tabIndex={0}
                        className="font-medium transition-opacity hover:cursor-pointer hover:opacity-80 h-auto w-1/3 truncate text-right text-xs text-gray-400"
                    >
                        Total (BTC)
                    </button>
                </div>

                {/* Order book */}
                <div
                    id="scrollContainer"
                    className="flex flex-col h-full flex-1 overflow-y-scroll scrollbar-hidden font-sans">
                    {/* Order book asks */}
                    {(showBook == "all" || showBook == "asks") &&
                        <div className="flex flex-col flex-1">
                            <div className="flex justify-end h-full w-full flex-col-reverse">
                                {asks && <AskList asks={asks} />}
                            </div>
                        </div>
                    }

                    {showBook == "all" &&
                        <div className="border m-1 border-white/6"></div>
                    }

                    {/* Order book bids */}
                    {(showBook == "all" || showBook == "bids") &&
                        <div className="flex flex-col flex-1">
                            <div className="flex justify-start flex-col h-full w-full">
                                {bids && <BidsList bids={bids} />}
                            </div>
                        </div>
                    }
                </div>

                {/* Spread */}
                <div className="px-3 py-1 sticky bottom-0">
                    <button type="button" tabIndex={0} className="hover:opacity-90">
                        <p className={`font-medium tabular-nums ${Number(ticker?.priceChange) >= 0 ? 'text-[#00c278]' : 'text-[#fd4b4e]'}`}>
                            {ticker?.lastPrice}
                        </p>
                    </button>
                </div>

                {/* Ratio bar */}
                <div className="relative mx-3 my-1 overflow-hidden">
                    <div className="flex justify-between">
                        <p className="text-green-text/90 z-10 bg-[#0B3227] py-1 pl-2 text-xs font-normal">{Math.floor(askRatio)}%</p>
                        <p className="text-red-text/90 z-10 bg-[#3A1E24] py-1 pr-2 text-xs font-normal">{Math.floor(bidRatio)}%</p>
                    </div>


                    <div>
                        <div
                            className="bg-[#0B3227] absolute top-0 bottom-0 left-0 -skew-x-25 border-r-2"
                            style={{
                                width: `${askRatio}%`,
                                transition: "width 0.3s ease-in-out",
                            }}
                        />
                        <div
                            className="bg-[#3A1E24] absolute top-0 right-0 bottom-0 -skew-x-25 border-l-2"
                            style={{
                                width: `${bidRatio}%`,
                                transition: "width 0.3s ease-in-out",
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
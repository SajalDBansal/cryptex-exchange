"use client";
import { Ticker } from "../utils/types";
import { formatLargeNumber, getTicker } from "../utils/httpClient";
import { useEffect, useState } from "react";
import { SignalingManager } from "../utils/SignallingManager";

export default function MarketBar({ market }: { market: string }) {
    const [ticker, setTicker] = useState<Ticker | null>();

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>) => setTicker(prevTicker => ({
            firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? '',
            high: data?.high ?? prevTicker?.high ?? '',
            lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? '',
            low: data?.low ?? prevTicker?.low ?? '',
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
            priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '',
            quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
            symbol: data?.symbol ?? prevTicker?.symbol ?? '',
            trades: data?.trades ?? prevTicker?.trades ?? '',
            volume: data?.volume ?? prevTicker?.volume ?? '',
        })), `TICKER-${market}`);
        SignalingManager.getInstance().sendMessage({ "method": "SUBSCRIBE", "params": [`ticker.${market}`] });

        getTicker(market).then(setTicker);

        return () => {
            SignalingManager.getInstance().deRegisterCallback("ticker", `TICKER-${market}`);
            SignalingManager.getInstance().sendMessage({ "method": "UNSUBSCRIBE", "params": [`ticker.${market}`] });
        }
    }, [market])

    return (
        <div className="bg-[#14151b] rounded-xl overflow-x-auto scrollbar-hidden p-2">
            <div className="flex items-center flex-row flex-wrap gap-x-8 sm:gap-x-6 gap-y-8">
                <div
                    className="flex h-full justify-center items-center border-2 p-2 rounded-xl border-white/8"
                >
                    <div className="flex lg:mr-5 ">
                        <img
                            alt="POL Logo"
                            loading="lazy"
                            width="40"
                            height="40"
                            decoding="async"
                            data-nimg="1"
                            className="z-10 rounded-full relative -mr-4"
                            srcSet={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${ticker?.symbol.split('_')[1].toLowerCase()}.png&w=32&q=75 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2F${ticker?.symbol.split('_')[1].toLowerCase()}.png&w=48&q=75 2x`}
                            src={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${ticker?.symbol.split('_')[1].toLowerCase()}.png&w=48&q=75`}
                            style={{ color: "transparent" }}
                        />
                        <img
                            alt="POL Logo"
                            loading="lazy"
                            width="40"
                            height="40"
                            decoding="async"
                            data-nimg="1"
                            className="z-10 rounded-full"
                            srcSet={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${ticker?.symbol.split('_')[0].toLowerCase()}.png&w=32&q=75 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2F${ticker?.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75 2x`}
                            src={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${ticker?.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75`}
                            style={{ color: "transparent" }}
                        />
                    </div>
                    <p className="hidden lg:block">
                        <b>{ticker?.symbol}</b>
                    </p>
                </div>



                <div className="flex flex-col h-full justify-center gap-y-2 items-center">
                    <button type="button" tabIndex={0} className="cursor-help">
                        <p className={`font-medium tabular-nums text-lg ${Number(ticker?.priceChange) >= 0 ? 'text-[#00c278]' : 'text-[#fd4b4e]'}`}
                        >
                            {ticker?.lastPrice}
                        </p>
                    </button>
                    <button type="button" tabIndex={0} className="cursor-help">
                        <p className="text-left text-sm font-normal tabular-nums">107,225.5</p>
                    </button>
                </div>

                <div className="flex flex-col h-full justify-center gap-y-2 items-center">
                    <p className="font-medium text-med-emphasis text-sm text-gray-400">Index Price</p>
                    <span className="mt-1 text-sm leading-4 font-normal tabular-nums">{ticker?.lastPrice}</span>
                </div>

                <div className="flex flex-col h-full justify-center gap-y-2 items-center">
                    <p className="font-medium text-med-emphasis text-sm text-gray-400">24H Change</p>
                    <span className={`mt-1 text-sm leading-4 font-normal tabular-nums flex items-center ${Number(ticker?.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {parseInt(ticker?.priceChange || '0') > 0 && "+"}
                        {ticker?.priceChange}
                        <span className="pl-2">
                            {ticker?.priceChangePercent}%
                        </span>
                    </span>
                </div>

                <div className="flex flex-col h-full justify-center gap-y-2 items-center">
                    <p className="font-medium text-med-emphasis text-sm text-gray-400">
                        <button type="button" tabIndex={0} className="cursor-help">
                            Funding / Countdown
                        </button>
                    </p>
                    <span className="mt-1 text-sm leading-4 font-normal tabular-nums">
                        <div className="flex items-center gap-x-1">
                            <button type="button" tabIndex={0} className="cursor-help">
                                <span className="tabular-nums">0.0012%</span>
                            </button>
                            <span>/</span>
                            <span className="tabular-nums">02:55:35</span>
                        </div>
                    </span>
                </div>

                <div className="flex flex-col h-full justify-center gap-y-2 items-center">
                    <p className="font-medium text-med-emphasis text-sm text-gray-400">24H High</p>
                    <span className="mt-1 text-sm leading-4 font-normal tabular-nums">{ticker?.high}</span>
                </div>

                <div className="flex flex-col h-full justify-center gap-y-2 items-center">
                    <p className="font-medium text-med-emphasis text-sm text-gray-400">24H Low</p>
                    <span className="mt-1 text-sm leading-4 font-normal tabular-nums">{ticker?.low}</span>
                </div>

                <button
                    type="button"
                    tabIndex={0}
                    className="flex flex-col h-full justify-center gap-y-2 items-center"
                >
                    <div className="flex justify-center flex-col relative gap-y-2 items-center">
                        <p className="font-medium text-med-emphasis text-sm text-gray-400">24H Volume (USD)</p>
                        <span className="mt-1 text-sm leading-4 font-normal tabular-nums">{formatLargeNumber(Number(ticker?.quoteVolume))}</span>
                    </div>
                </button>

                <button
                    type="button"
                    tabIndex={0}
                    className="flex flex-col h-full justify-center gap-y-2 items-center"
                >
                    <div className="flex justify-center flex-col relative gap-y-2 items-center">
                        <p className="font-medium text-med-emphasis text-sm text-gray-400">Open Interest ({ticker?.symbol.split('_')[0]})</p>
                        <span className="mt-1 text-sm leading-4 font-normal tabular-nums">432.67214</span>
                    </div>
                </button>

                <div className="flex flex-col h-full justify-center gap-y-2 items-center">
                    <p className="font-medium text-med-emphasis text-sm text-gray-400">
                        <button type="button" tabIndex={0} className="cursor-help">
                            Profit APY
                        </button>
                    </p>
                    <span className="mt-1 text-sm leading-4 font-normal tabular-nums">
                        <span className="hover:cursor-pointer hover:opacity-90">
                            <div className="flex-row inline-flex gap-1">
                                5.36%
                                <button type="button" tabIndex={0} className="cursor-help">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#efa411" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap ">
                                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                                    </svg>
                                </button>
                            </div>
                        </span>
                    </span>
                </div>

            </div>

        </div>
    )
}
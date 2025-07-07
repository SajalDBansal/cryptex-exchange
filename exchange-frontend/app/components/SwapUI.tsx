"use client"; // Only if you're using the new app router

import { useEffect, useState } from "react";
import { SignalingManager } from "../utils/SignallingManager";
import { Ticker, TickerForPrice } from "../utils/types";

export default function TradePanel({ market }: { market: string }) {
    const [quantity, setQuantity] = useState("");
    const [buyOrSell, setBuyOrSell] = useState<"buy" | "sell">("buy");
    const [method, setMethod] = useState<"limit" | "market" | "condition">("market");
    const [valueType, setValueType] = useState<"usd" | "crypto">("usd");
    const [ticker, setTicker] = useState<TickerForPrice | null>();

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<Ticker>) => setTicker(prevTicker => ({
            lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? '',
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
        })), `TICKER-${market}`);
    }, [])

    return (
        <div className="flex flex-col w-full lg:w-[332px] gap-4">
            {/* <div className="flex flex-col w-[332px] gap-4"> */}
            <div className="flex flex-col gap-4">

                <div className="flex h-[48px] w-full overflow-hidden rounded-xl">
                    <button
                        onClick={() => setBuyOrSell("buy")}
                        className={`w-full overflow-hidden text-sm font-semibold ${buyOrSell == "buy" ? "bg-[#00c27814] text-[#00c278]" : "bg-white/4 hover:text-[#00c278]"}`}>
                        Buy / Long
                    </button>
                    <button
                        onClick={() => setBuyOrSell("sell")}
                        className={`w-full overflow-hidden  text-sm font-semibold ${buyOrSell == "sell" ? "bg-[#ea383b1f] text-[#fd4b4e]" : "bg-white/4 hover:text-[#fd4b4e]"}`}>
                        Sell / Short
                    </button>
                </div>

                <div className="flex flex-col gap-4">

                    <div className="flex items-center justify-center flex-row gap-2 gap-x-0">
                        <div
                            className={`flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 px-3 h-8 text-sm ${method == "limit" ? "bg-white/4" : "text-gray-400"}`}
                            onClick={() => setMethod("limit")}
                        >
                            Limit
                        </div>

                        <div
                            className={`flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 px-3 h-8 text-sm ${method == "market" ? "bg-white/4" : "text-gray-400"}`}
                            onClick={() => setMethod("market")}
                        >
                            Market
                        </div>

                        <div
                            className={`flex justify-center flex-col cursor-pointer rounded-lg py-1 font-medium outline-hidden hover:opacity-90 px-3 h-8 text-sm ${method == "condition" ? "bg-white/4" : "text-gray-400"}`}
                            onClick={() => setMethod("condition")}
                        >
                            Conditional
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-col flex-1 gap-3 text-gray-400">

                            <div className="flex flex-col gap-2">

                                <div className="flex justify-between flex-row">
                                    <p className="relative text-xs font-normal">Available Equity</p>
                                    <p className="text-xs font-medium">0 USD</p>
                                </div>

                                {/* Input fields */}
                                {method == "market" &&
                                    <>
                                        <div className="flex justify-between flex-row mt-1">
                                            <button
                                                type="button"
                                                className="font-medium transition-opacity hover:cursor-pointer hover:opacity-80 text-base">
                                                <div
                                                    className="flex items-center flex-row"
                                                    onClick={() => {
                                                        valueType === "crypto" ? setValueType("usd") : setValueType("crypto")
                                                    }}
                                                >
                                                    <p className="text-sm font-normal">
                                                        {valueType === "usd" ? "Order Value" : "Quantity"}
                                                    </p>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-right text-med-emphasis ml-1 h-4 w-4">
                                                        <path d="M8 3 4 7l4 4"></path>
                                                        <path d="M4 7h16"></path>
                                                        <path d="m16 21 4-4-4-4"></path>
                                                        <path d="M20 17H4"></path>
                                                    </svg>
                                                </div>
                                            </button>
                                            <div className="flex justify-end flex-row">
                                                <p className="font-medium text-xs">≈ 0.0
                                                    {valueType === "usd" ? ` ${market.split('_')[0]}` : " USD"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col relative">
                                            <input
                                                step="0.00001"
                                                placeholder="0"
                                                className="focus:border-accent-blue h-12 rounded-lg pr-10 text-left ring-0 transition focus:ring-0 text-2xl px-2 border-none bg-white/4"
                                                type="text"
                                                value={quantity}
                                                onChange={(e) => { setQuantity(e.target.value) }}
                                                inputMode="numeric"
                                            />
                                            <div className="flex flex-row absolute top-1/2 right-1 -translate-y-1/2 p-2">
                                                <div className="relative">
                                                    <div className="relative flex-none overflow-hidden rounded-full" style={{ width: 24, height: 24 }}>
                                                        <div className="relative">
                                                            {
                                                                valueType == "usd" ?
                                                                    <img
                                                                        alt="BTC Logo"
                                                                        loading="lazy"
                                                                        width={24}
                                                                        height={24}
                                                                        decoding="async"
                                                                        data-nimg="1"
                                                                        srcSet="https://backpack.exchange/_next/image?url=%2Fcoins%2Fbtc.png&w=32&q=95 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2Fbtc.png&w=48&q=95 2x"
                                                                        src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fbtc.png&w=48&q=95"
                                                                        style={{ color: "transparent" }}
                                                                    />
                                                                    :
                                                                    <img
                                                                        alt="BTC Logo"
                                                                        loading="lazy"
                                                                        width={24}
                                                                        height={24}
                                                                        decoding="async"
                                                                        data-nimg="1"
                                                                        src="https://backpack.exchange/coins/usd.svg"
                                                                        style={{ color: "transparent" }}
                                                                    />
                                                            }

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

                                {(method == "limit" || method == "condition") &&
                                    <>
                                        <div className="flex justify-between flex-row">
                                            <p className="relative text-sm font-normal">
                                                {method == "limit" ? "Price" : "Trigger Price"}
                                            </p>
                                        </div>

                                        <div className="flex flex-col relative">
                                            <input
                                                step="0.00001"
                                                placeholder="0"
                                                className="focus:border-accent-blue h-12 rounded-lg pr-10 text-left ring-0 transition focus:ring-0 text-2xl px-2 border-none bg-white/4"
                                                type="text"
                                                value={ticker?.lastPrice}
                                                disabled
                                                inputMode="numeric"
                                            />
                                            <div className="flex flex-row absolute top-1/2 right-1 -translate-y-1/2 p-2">
                                                <div className="relative">
                                                    <div className="relative flex-none overflow-hidden rounded-full" style={{ width: 24, height: 24 }}>
                                                        <div className="relative">
                                                            <img
                                                                alt="BTC Logo"
                                                                loading="lazy"
                                                                width={24}
                                                                height={24}
                                                                decoding="async"
                                                                data-nimg="1"
                                                                src="https://backpack.exchange/coins/usd.svg"
                                                                style={{ color: "transparent" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between flex-row">
                                            <p className="relative text-sm font-normal">Qunatity</p>
                                        </div>

                                        <div className="flex flex-col relative">
                                            <input
                                                step="0.00001"
                                                placeholder="0"
                                                className="focus:border-accent-blue h-12 rounded-lg pr-10 text-left ring-0 transition focus:ring-0 text-2xl px-2 border-none bg-white/4"
                                                type="text"
                                                value={quantity}
                                                onChange={(e) => { setQuantity(e.target.value) }}
                                                inputMode="numeric"
                                            />
                                            <div className="flex flex-row absolute top-1/2 right-1 -translate-y-1/2 p-2">
                                                <div className="relative">
                                                    <div className="relative flex-none overflow-hidden rounded-full" style={{ width: 24, height: 24 }}>
                                                        <div className="relative">
                                                            <img
                                                                alt="BTC Logo"
                                                                loading="lazy"
                                                                width={24}
                                                                height={24}
                                                                decoding="async"
                                                                data-nimg="1"
                                                                srcSet="https://backpack.exchange/_next/image?url=%2Fcoins%2Fbtc.png&w=32&q=95 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2Fbtc.png&w=48&q=95 2x"
                                                                src="https://backpack.exchange/_next/image?url=%2Fcoins%2Fbtc.png&w=48&q=95"
                                                                style={{ color: "transparent" }}
                                                            />


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

                                {/* Slider */}
                                <div
                                    role="group"
                                    aria-label="Percentage Slider"
                                    className="mt-4 mb-1"
                                    data-orientation="horizontal"
                                >
                                    <div
                                        className="bg-white/4 mx-2 h-1 cursor-pointer rounded-full before:absolute before:-top-4 before:h-8 before:w-full before:content-['']"
                                        data-orientation="horizontal"
                                        style={{ position: "relative", touchAction: "none" }}
                                    >
                                        <div className="h-full rounded-full" style={{ width: "0%" }}></div>
                                        {[0, 25, 50, 75, 100].map((percent) => (
                                            <div
                                                key={percent}
                                                className="top-0.5 h-2.5 w-2.5 rounded-full border-2 border-base-background-l3"
                                                data-disabled="true"
                                                style={{
                                                    position: "absolute",
                                                    left: `${percent}%`,
                                                    transform: "translate(-50%, -50%)",
                                                    touchAction: "none",
                                                }}
                                            >
                                                {/* visually hidden input for accessibility */}
                                                <div style={{
                                                    border: 0,
                                                    clip: "rect(0px, 0px, 0px, 0px)",
                                                    clipPath: "inset(50%)",
                                                    height: 1,
                                                    margin: -1,
                                                    overflow: "hidden",
                                                    padding: 0,
                                                    position: "absolute",
                                                    width: 1,
                                                    whiteSpace: "nowrap"
                                                }}>
                                                    <input
                                                        aria-labelledby="percentage-slider"
                                                        step="1"
                                                        disabled
                                                        aria-orientation="horizontal"
                                                        aria-valuetext="NaN"
                                                        type="range"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <div
                                            className=" top-0.5 h-3.5 w-3.5 cursor-grab rounded-full"
                                            style={{
                                                position: "absolute",
                                                left: "0%",
                                                transform: "translate(-50%, -50%)",
                                                touchAction: "none"
                                            }}
                                        >
                                            <div style={{
                                                border: 0,
                                                clip: "rect(0px, 0px, 0px, 0px)",
                                                clipPath: "inset(50%)",
                                                height: 1,
                                                margin: -1,
                                                overflow: "hidden",
                                                padding: 0,
                                                position: "absolute",
                                                width: 1,
                                                whiteSpace: "nowrap"
                                            }}>
                                                <input
                                                    tabIndex={0}
                                                    aria-labelledby="percentage-slider"
                                                    min={0}
                                                    max={100}
                                                    step={1}
                                                    aria-orientation="horizontal"
                                                    aria-valuetext="0"
                                                    type="range"
                                                    value={0}
                                                    onChange={() => { }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between flex-row mt-2">
                                        <p className="text-med-emphasis font-normal pl-1 text-xs">0</p>
                                        <p className="text-med-emphasis font-normal text-xs">100%</p>
                                    </div>
                                </div>

                                {method == "limit" &&
                                    <>
                                        <div className="flex justify-between flex-row">
                                            <p className="relative text-sm font-normal">Order Value</p>
                                        </div>

                                        <div className="flex flex-col relative">
                                            <input
                                                step="0.00001"
                                                placeholder="0"
                                                className="focus:border-accent-blue h-12 rounded-lg pr-10 text-left ring-0 transition focus:ring-0 text-2xl px-2 border-none bg-white/4"
                                                type="text"
                                                value={"0"}
                                                onChange={() => { }}
                                                inputMode="numeric"
                                            />
                                            <div className="flex flex-row absolute top-1/2 right-1 -translate-y-1/2 p-2">
                                                <div className="relative">
                                                    <div className="relative flex-none overflow-hidden rounded-full" style={{ width: 24, height: 24 }}>
                                                        <div className="relative">
                                                            <img
                                                                alt="BTC Logo"
                                                                loading="lazy"
                                                                width={24}
                                                                height={24}
                                                                decoding="async"
                                                                data-nimg="1"
                                                                src="https://backpack.exchange/coins/usd.svg"
                                                                style={{ color: "transparent" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

                            </div>

                            <div className="flex flex-col mb-2 gap-2">
                                <div className="flex flex-col">
                                    <div className="flex justify-between flex-row">
                                        <p className="text-med-emphasis relative text-xs font-normal">Margin Required</p>
                                        <p className="text-high-emphasis text-xs font-medium">-</p>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex justify-between flex-row">
                                        <button type="button" className="cursor-help">
                                            <p className="text-med-emphasis relative text-xs font-normal">
                                                Est. Liquidation Price
                                                <span className="border-base-border-med absolute bottom-0 left-0 w-full translate-y-full border-b border-dashed"></span>
                                            </p>
                                        </button>
                                        <p className="text-high-emphasis text-xs font-medium">-</p>
                                    </div>
                                </div>

                                {method != "limit" &&
                                    <div className="flex justify-between flex-row">
                                        <button type="button" className="cursor-help">
                                            <p className="text-med-emphasis relative text-xs font-normal">
                                                Max Slippage
                                                <span className="border-base-border-med absolute bottom-0 left-0 w-full translate-y-full border-b border-dashed"></span>
                                            </p>
                                        </button>
                                        <button type="button" aria-expanded="false" className="transition-opacity hover:cursor-pointer hover:opacity-80 text-accent-blue cursor-pointer text-xs font-medium">
                                            2%
                                        </button>
                                    </div>
                                }
                            </div>

                            <div className="flex flex-col gap-4">
                                <a
                                    className="inline-flex items-center justify-center focus:none text-center font-semibold hover:opacity-90 focus:ring-blue-200 focus:outline-hidden disabled:opacity-80 disabled:hover:opacity-80 text-black bg-white h-12 rounded-xl px-4 py-2 text-base"
                                    href="/signup"
                                >
                                    Sign up to trade
                                </a>
                                <a
                                    className="inline-flex items-center justify-center focus:none text-center font-semibold hover:opacity-90 focus:ring-blue-200 focus:outline-hidden disabled:opacity-80 disabled:hover:opacity-80 bg-white/4 h-12 rounded-xl px-4 py-2 text-base"
                                    href="/login"
                                >
                                    Sign in to trade
                                </a>
                            </div>

                            <div className="flex flex-row mt-2 flex-wrap gap-x-4 gap-y-3">
                                <div className="flex items-center flex-row">
                                    <input
                                        id="red-checkbox"
                                        type="checkbox"
                                    />
                                    <button type="button" className="cursor-help flex">
                                        <label className="font-medium select-none text-xs pl-2 cursor-help" htmlFor="reduceOnly">
                                            Reduce Only
                                        </label>
                                    </button>
                                </div>

                                {method == "condition" &&
                                    <div className="flex items-center flex-row">
                                        <input
                                            id="tpSl"
                                            type="checkbox"
                                        />
                                        <button type="button" className="cursor-help flex">
                                            <label className="font-medium select-none text-xs pl-2 cursor-help" htmlFor="tpSl">
                                                Limit Price
                                            </label>
                                        </button>
                                    </div>
                                }

                                {(method == "market" || method == "limit") &&
                                    <div className="flex items-center flex-row">
                                        <input
                                            id="tpSl"
                                            type="checkbox"
                                        />
                                        <button type="button" className="cursor-help flex">
                                            <label className="font-medium select-none text-xs pl-2 cursor-help" htmlFor="tpSl">
                                                TP/SL
                                            </label>
                                        </button>
                                    </div>
                                }

                                {method == "limit" &&
                                    <div className="flex items-center flex-row">
                                        <input
                                            id="tpSl"
                                            type="checkbox"
                                        />
                                        <button type="button" className="cursor-help flex">
                                            <label className="font-medium select-none text-xs pl-2 cursor-help" htmlFor="tpSl">
                                                IOC
                                            </label>
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

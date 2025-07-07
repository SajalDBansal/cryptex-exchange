"use client";

import { useCallback, useEffect, useState } from "react";
import { Ticker } from "../utils/types";
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react";
import { formatLargeNumber, getTickers, seperateFutures, seperateSpot, tickersSorter } from "../utils/httpClient";

export const Marketlist = ({
    listVisible,
    tickers
}: {
    listVisible: string;
    tickers: Ticker[];
}) => {
    const [sortField, setSortField] = useState("quoteVolume");
    const [sortOrder, setSortOrder] = useState<"asc" | "dsc">("asc");

    const seperatedSpots = seperateSpot(tickers);
    const seperatedFutures = seperateFutures(tickers);
    const sortedSpotTickerData = tickersSorter(seperatedSpots, sortField, sortOrder);
    const sortedFutureTickerData = tickersSorter(seperatedFutures, sortField, sortOrder);



    return (
        <div>
            {listVisible == "spot" &&
                <div>
                    < div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 border-b border-gray-800/50 text-sm text-gray-400">
                        <button
                            onClick={() => {
                                if (sortField == "symbol") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("symbol");
                                }
                            }}
                            className={`flex items-center gap-x-2 ${sortField == "symbol" && "text-white"}`}>
                            <span>#</span>
                            {sortField == "symbol" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "symbol" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            <span>Name</span>
                        </button>

                        <button
                            onClick={() => {
                                if (sortField == "lastPrice") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("lastPrice");
                                }
                            }}
                            className={`text-right flex justify-end gap-x-2 ${sortField == "lastPrice" && "text-white"}`}>
                            {sortField == "lastPrice" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "lastPrice" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            Price
                        </button>

                        <button
                            onClick={() => {
                                if (sortField == "quoteVolume") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("quoteVolume");
                                }
                            }}
                            className={`text-right justify-end gap-x-2 hidden md:flex ${sortField == "quoteVolume" && "text-white"}`}>
                            {sortField == "quoteVolume" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "quoteVolume" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            24h Volume
                        </button>

                        <button
                            onClick={() => {
                                if (sortField == "volume") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("volume");
                                }
                            }}
                            className={`text-right hidden md:flex justify-end gap-x-2 ${sortField == "volume" && "text-white"}`}>
                            {sortField == "volume" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "volume" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            Market Cap
                        </button>

                        <button
                            onClick={() => {
                                if (sortField == "priceChangePercent") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("priceChangePercent");
                                }
                            }}
                            className={`text-right flex justify-end gap-x-2 ${sortField == "priceChangePercent" && "text-white"}`}>
                            {sortField == "priceChangePercent" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "priceChangePercent" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            24h Change
                        </button>

                        <div className="text-right hidden lg:block">Last 7 days</div>
                    </div>

                    <div className="divide-y divide-gray-800/50">
                        {sortedSpotTickerData.map((crypto: Ticker, index: number) => (
                            <a
                                key={crypto.symbol}
                                href={`/trade/${crypto.symbol}`}
                                className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 hover:bg-[#202127] transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-400 text-sm w-6 hidden md:block">{index + 1}</span>
                                    <img
                                        alt="POL Logo"
                                        loading="lazy"
                                        width="40"
                                        height="40"
                                        decoding="async"
                                        data-nimg="1"
                                        className="z-10 rounded-full mr-5"
                                        srcSet={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${crypto.symbol.split('_')[0].toLowerCase()}.png&w=32&q=75 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2F${crypto.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75 2x`}
                                        src={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${crypto.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75`}
                                        style={{ color: "transparent" }}
                                    />
                                    <div>
                                        <div className="text-white font-medium">{crypto.symbol.split('_')[0]}</div>
                                        <div className="text-gray-400 text-sm">{crypto.symbol.split('_').join('/')}</div>
                                    </div>
                                </div>

                                <div className="text-right text-white font-medium">
                                    {parseFloat(crypto.lastPrice) < 1
                                        ? formatLargeNumber(Number(parseFloat(crypto.lastPrice)))
                                        : formatLargeNumber(parseFloat(crypto.lastPrice))}
                                </div>

                                <div className="text-right text-gray-300 hidden md:block">
                                    {formatLargeNumber(parseFloat(crypto.quoteVolume))}
                                </div>

                                {/* market cap */}
                                <div className="text-right text-gray-300 hidden md:block">
                                    {formatLargeNumber(parseFloat(crypto.volume))}
                                </div>

                                <div className={`text-right font-medium flex items-center justify-end space-x-1 ${parseFloat(crypto.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {parseFloat(crypto.priceChangePercent) >= 0 ? (
                                        <TrendingUp size={12} />
                                    ) : (
                                        <TrendingDown size={12} />
                                    )}
                                    <span>
                                        {parseFloat(crypto.priceChangePercent) >= 0 ? '+' : ''}{(parseFloat(crypto.priceChangePercent) * 100).toFixed(2)}%
                                    </span>
                                </div>

                                <div className="text-right text-gray-300 hidden lg:block">
                                    {parseFloat(crypto.trades)}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            }

            {listVisible == "future" &&
                <div>
                    < div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 border-b border-gray-800/50 text-sm text-gray-400">
                        <button
                            onClick={() => {
                                if (sortField == "symbol") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("symbol");
                                }
                            }}
                            className={`flex items-center gap-x-2 ${sortField == "symbol" && "text-white"}`}>
                            <span>#</span>
                            {sortField == "symbol" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "symbol" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            <span>Name</span>
                        </button>

                        <button
                            onClick={() => {
                                if (sortField == "lastPrice") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("lastPrice");
                                }
                            }}
                            className={`text-right flex justify-end gap-x-2 ${sortField == "lastPrice" && "text-white"}`}>
                            {sortField == "lastPrice" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "lastPrice" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            Price
                        </button>

                        <button
                            onClick={() => {
                                if (sortField == "quoteVolume") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("quoteVolume");
                                }
                            }}
                            className={`text-right hidden md:flex justify-end gap-x-2 ${sortField == "quoteVolume" && "text-white"}`}>
                            {sortField == "quoteVolume" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "quoteVolume" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            24h Volume
                        </button>

                        <button
                            onClick={() => {
                                if (sortField == "volume") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("volume");
                                }
                            }}
                            className={`text-right hidden md:flex justify-end gap-x-2 ${sortField == "volume" && "text-white"}`}>
                            {sortField == "volume" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "volume" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            Open Interest
                        </button>

                        <button
                            onClick={() => {
                                if (sortField == "priceChangePercent") {
                                    if (sortOrder == "asc") {
                                        setSortOrder("dsc");
                                    } else {
                                        setSortOrder("asc");
                                    }
                                } else {
                                    setSortField("priceChangePercent");
                                }
                            }}
                            className={`text-right flex justify-end gap-x-2 ${sortField == "priceChangePercent" && "text-white"}`}>
                            {sortField == "priceChangePercent" && sortOrder == "asc" && <ArrowUp size={15} />}
                            {sortField == "priceChangePercent" && sortOrder == "dsc" && <ArrowDown size={15} />}
                            24h Change
                        </button>

                        <div className="text-right hidden lg:block">Last 7 Days</div>
                    </div>

                    <div className="divide-y divide-gray-800/50">
                        {sortedFutureTickerData.map((crypto: Ticker, index: number) => (
                            <a
                                key={crypto.symbol}
                                href={`/trade/${crypto.symbol}`}
                                className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 hover:bg-[#202127] transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-400 text-sm w-6 hidden md:block">{index + 1}</span>
                                    <img
                                        alt="POL Logo"
                                        loading="lazy"
                                        width="40"
                                        height="40"
                                        decoding="async"
                                        data-nimg="1"
                                        className="z-10 rounded-full mr-5"
                                        srcSet={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${crypto.symbol.split('_')[0].toLowerCase()}.png&w=32&q=75 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2F${crypto.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75 2x`}
                                        src={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${crypto.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75`}
                                        style={{ color: "transparent" }}
                                    />
                                    <div>
                                        <div className="text-white font-medium">{crypto.symbol.split('_')[0]}</div>
                                        <div className="text-gray-400 text-sm">{crypto.symbol.replace("_", "/")}</div>
                                    </div>
                                </div>

                                <div className="text-right text-white font-medium">
                                    {parseFloat(crypto.lastPrice) < 1
                                        ? formatLargeNumber(Number(parseFloat(crypto.lastPrice)))
                                        : formatLargeNumber(parseFloat(crypto.lastPrice))}
                                </div>

                                <div className="text-right text-gray-300 hidden md:block">
                                    {formatLargeNumber(parseFloat(crypto.quoteVolume))}
                                </div>

                                {/* market cap */}
                                <div className="text-right text-gray-300 hidden md:block">
                                    {formatLargeNumber(parseFloat(crypto.volume))}
                                </div>

                                <div className={`text-right font-medium flex items-center justify-end space-x-1 ${parseFloat(crypto.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {parseFloat(crypto.priceChangePercent) >= 0 ? (
                                        <TrendingUp size={12} />
                                    ) : (
                                        <TrendingDown size={12} />
                                    )}
                                    <span>
                                        {parseFloat(crypto.priceChangePercent) >= 0 ? '+' : ''}{(parseFloat(crypto.priceChangePercent) * 100).toFixed(2)}%
                                    </span>
                                </div>

                                <div className="text-right text-gray-300 hidden lg:block">
                                    {parseFloat(crypto.trades)}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}
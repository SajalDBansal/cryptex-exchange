"use client";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Topchart } from "../components/Topchart";
import { getTickers } from "../utils/httpClient";
import { Ticker } from "../utils/types";
import { useCallback, useEffect, useState } from "react";
import { Marketlist } from "../components/Marketlist";

export default function Page() {
    const [tickers, setTickers] = useState<Ticker[]>([]);
    const [listVisible, setListVisible] = useState<"spot" | "future">("spot");

    const fetchData = useCallback(async () => {
        try {
            getTickers().then((res) => { setTickers(res) });
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }, []);

    // Fetch when component mounts (i.e., page visited)
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Fetch again when tab becomes visible
    // useEffect(() => {
    //     const handleVisibilityChange = () => {
    //         if (document.visibilityState === 'visible') {
    //             fetchData();
    //         }
    //     };
    //     document.addEventListener('visibilitychange', handleVisibilityChange);
    //     return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    // }, [fetchData]);

    if (!tickers) {
        return (
            <div></div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0e0f14]">
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="mb-8 mt-20">
                    <h1 className="text-3xl font-bold text-white mb-2">Markets</h1>
                    <p className="text-gray-400">Explore and track cryptocurrency markets</p>
                </div>

                {/* Market Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#14151b] rounded-2xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Total Market Cap</div>
                        <div className="text-white text-xl font-bold">$1.45T</div>
                        <div className="flex items-center space-x-1 mt-1">
                            <TrendingUp size={12} className="text-green-400" />
                            <span className="text-green-400 text-xs">+1.2%</span>
                        </div>
                    </div>

                    <div className="bg-[#14151b] rounded-2xl p-4">
                        <div className="text-gray-400 text-sm mb-1">24h Volume</div>
                        <div className="text-white text-xl font-bold">$58.3B</div>
                        <div className="flex items-center space-x-1 mt-1">
                            <TrendingDown size={12} className="text-red-400" />
                            <span className="text-red-400 text-xs">-3.4%</span>
                        </div>
                    </div>

                    <div className="bg-[#14151b] rounded-2xl p-4">
                        <div className="text-gray-400 text-sm mb-1">BTC Dominance</div>
                        <div className="text-white text-xl font-bold">52.3%</div>
                        <div className="flex items-center space-x-1 mt-1">
                            <TrendingUp size={12} className="text-green-400" />
                            <span className="text-green-400 text-xs">+0.8%</span>
                        </div>
                    </div>

                    <div className="bg-[#14151b] rounded-2xl p-4">
                        <div className="text-gray-400 text-sm mb-1">Active Coins</div>
                        <div className="text-white text-xl font-bold">2,847</div>
                        <div className="text-gray-400 text-xs">Tracked</div>
                    </div>
                </div>

                {/* Top Chart Ticker */}
                < div className="py-6 overflow-hidden" >
                    <div className="container mx-auto">
                        <Topchart tickers={tickers} />
                    </div>
                </div >

                {/* Markets Table */}
                <div className="bg-[#14151b] rounded-2xl overflow-hidden">
                    <div className="flex gap-4 p-4 text-sm text-gray-400">
                        <button
                            className={`px-3 py-1 rounded-lg cursor-pointer ${listVisible == "spot" && "bg-[#202127] text-white"}`}
                            onClick={() => setListVisible("spot")}
                        >
                            Spot
                        </button>
                        <button
                            onClick={() => setListVisible("future")}
                            className={`px-3 py-1 rounded-lg cursor-pointer ${listVisible == "future" && "bg-[#202127] text-white"}`}
                        >
                            Future
                        </button>
                        <button className="cursor-pointer px-3 py-1 rounded-lg">Lend</button>
                    </div>
                    <Marketlist tickers={tickers} listVisible={listVisible} />
                </div>

            </div>

        </div >
    )
}
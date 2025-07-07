"use client";
import MarketBar from "@/app/components/MarketBar";
import TradePanel from "@/app/components/SwapUI";
import { TradeView } from "@/app/components/TradeView";
import { useParams } from "next/navigation";
import Depth from "@/app/components/Depth";

export default function Page() {
    const params = useParams();
    const marketName = params?.market?.[0] || "";

    return (
        <div className="min-h-screen bg-[#0e0f14] pt-23 overflow-hidden">

            <div className="flex flex-col lg:flex-row gap-2 mx-2 p-2">
                <div className="flex flex-col w-full rounded-xl flex-1 gap-2">
                    {/* Market Bar */}
                    <MarketBar market={marketName} />

                    <div className="flex flex-col xl:flex-row justify-between gap-2">
                        <div className="bg-[#14151b] rounded-xl grow">
                            <ChartButtons />
                            <div>
                                <TradeView market={marketName as string} />
                            </div>
                        </div>
                        <div className="shrink-0 w-full xl:w-auto block gap-x-2 md:flex">
                            <div className="bg-[#14151b] rounded-xl mb-2">
                                <Depth market={marketName as string} />

                            </div>
                            <div className="bg-[#14151b] rounded-xl p-2 w-full lg:w-auto block xl:hidden">
                                && <TradePanel market={marketName} />
                            </div>
                            <div className="bg-[#14151b] rounded-xl p-2 w-full hidden lg:block xl:hidden">
                                <BottomBar />
                            </div>
                        </div>

                    </div>

                    <div className="lg:hidden xl:block">
                        <BottomBar />
                    </div>

                </div>
                <div className="bg-[#14151b] rounded-xl p-2 w-full lg:w-auto hidden xl:block">
                    <TradePanel market={marketName} />
                </div>
            </div>
        </div>
    );
}

function ChartButtons() {
    return (
        <div className="flex justify-between p-2">
            <div className="flex gap-x-1 text-sm">
                <button className="py-2 px-3 bg-white/6 rounded-xl">Chart</button>
                <button className="py-2 px-3">Depth</button>
                <button className="py-2 px-3">Margin</button>
                <button className="py-2 px-3">Funding</button>
                <button className="py-2 px-3">Market Info</button>
            </div>
            <div className="bg-white/4 rounded-xl  hidden lg:block">
                <button className="py-2 px-3 bg-white/6 rounded-l-xl">Last</button>
                <button className="py-2 px-3">Mark</button>
                <button className="py-2 px-3 rounded-xl">Index</button>
            </div>
        </div>
    )
}

function BottomBar() {
    return (
        <div className="p-2 bg-[#14151b] rounded-xl">
            <div className="flex gap-x-1 text-sm flex-wrap">
                <button className="py-2 px-3 bg-white/6 rounded-xl">Balances</button>
                <button className="py-2 px-3">Positions</button>
                <button className="py-2 px-3">Borrows</button>
                <button className="py-2 px-3">Open Orders</button>
                <button className="py-2 px-3">TWAP</button>
                <button className="py-2 px-3">Fill History</button>
                <button className="py-2 px-3">Order History</button>
                <button className="py-2 px-3">Position History</button>
            </div>

            <div className="flex justify-between items-center w-full h-full">
                <div className="p-8 text-center mx-auto">
                    <div className="text-gray-400 text-lg mb-2">No results found</div>
                    <div className="text-gray-500 text-sm">
                        We currently don't have any data here to show you.
                    </div>
                </div>
            </div>
        </div>
    )
}
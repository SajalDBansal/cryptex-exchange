import { Trade } from "@/app/utils/types";

export default function Trades({ trades }: { trades: Trade[] }) {
    return (
        <>
            {
                trades.map((trade, i) => (
                    <div className="flex h-[25px] items-center" key={i}>
                        <button type="button" tabIndex={0} className="z-[1] h-full w-full">
                            <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 border-t hover:border-base-border-focus/50 border-dashed border-transparent">
                                <div className="flex h-full w-[30%] items-center">
                                    <p className={`z-[1] text-left text-sm font-normal tabular-nums ${trade.isBuyerMaker ? "text-[#fd4b4e]" : "text-[#00c278]"} `}>{trade.price}</p>
                                </div>
                                <div className="flex h-full w-[35%] items-center justify-end">
                                    <p className="z-[1] text-right text-sm font-normal tabular-nums">{trade.quantity}</p>
                                </div>
                                <div className="flex h-full w-[35%] items-center justify-end">
                                    <p className="z-[1] pr-2 text-right text-sm font-normal tabular-nums text-gray-400">{new Date(trade.timestamp).toLocaleTimeString('en-GB')}</p>
                                </div>
                            </div>
                        </button>
                    </div>
                ))
            }
        </>
    )
}
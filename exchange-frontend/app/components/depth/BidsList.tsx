import { decimalFormat } from "@/app/utils/httpClient";

export default function BidsList({ bids }: { bids: [string, string][] }) {
    const filteredBids = bids.filter(([_, quantity]) => parseFloat(quantity) > 0);
    let currentTotal = 0;
    const relevantBids = filteredBids.slice(0, 14);
    const bidsWithTotal: [string, string, number][] = relevantBids.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    return (
        <>
            {bidsWithTotal.map((bid, i) => (
                <div className="flex h-[25px] items-center" key={i}>
                    <button type="button" tabIndex={0} className="z-[1] h-full w-full">
                        <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 border-b hover:border-base-border-focus/50 border-dashed border-transparent">
                            <div
                                style={{
                                    position: "absolute",
                                    top: 1,
                                    bottom: 1,
                                    right: 12,
                                    width: `${(100 * bid[2]) / maxTotal}%`,
                                    height: "100%",
                                    background: "rgba(0, 194, 120, 0.16)",
                                    transition: "width 0.4s ease-in-out",
                                }}
                            />
                            <div className="flex h-full w-[30%] items-center">
                                <p className="z-[1] text-left text-xs font-normal tabular-nums text-[#00c278]">{bid[0]}</p>
                            </div>
                            <div className="flex h-full w-[35%] items-center justify-end">
                                <p className="z-[1] text-right text-xs font-normal tabular-nums text-gray-400">{bid[1]}</p>
                            </div>
                            <div className="flex h-full w-[35%] items-center justify-end">
                                <p className="z-[1] pr-2 text-right text-xs font-normal tabular-nums text-gray-400">{decimalFormat(bid[2])}</p>
                            </div>
                        </div>
                    </button>
                </div>
            ))}
        </>
    )
}
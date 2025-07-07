import { decimalFormat } from "@/app/utils/httpClient";

export default function AskList({ asks }: { asks: [string, string][] }) {

    const filteredAsks = asks.filter(([_, quantity]) => parseFloat(quantity) > 0);
    let currentTotal = 0;
    const relevantAsks = filteredAsks.slice(0, 14);
    relevantAsks.reverse();
    let asksWithTotal: [string, string, number][] = [];
    for (let i = relevantAsks.length - 1; i >= 0; i--) {
        const [price, quantity] = relevantAsks[i];
        asksWithTotal.push([price, quantity, currentTotal += Number(quantity)]);
    }
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    return (
        <>
            {
                asksWithTotal.map((ask, i) => (
                    <div className="flex h-[25px] items-center" key={i}>
                        <button type="button" tabIndex={0} className="z-[1] h-full w-full">
                            <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 border-t hover:border-base-border-focus/50 border-dashed border-transparent">
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 1,
                                        bottom: 1,
                                        right: 12,
                                        width: `${(100 * ask[2]) / maxTotal}%`,
                                        background: "rgba(253, 75, 78, 0.16)",
                                        transition: "width 0.4s ease-in-out",
                                    }}
                                />
                                <div className="flex h-full w-[30%] items-center">
                                    <p className="z-[1] text-left text-xs font-normal tabular-nums text-[#fd4b4e]">{ask[0]}</p>
                                </div>
                                <div className="flex h-full w-[35%] items-center justify-end">
                                    <p className="z-[1] text-right text-xs font-normal tabular-nums text-gray-400">{ask[1]}</p>
                                </div>
                                <div className="flex h-full w-[35%] items-center justify-end">
                                    <p className="z-[1] pr-2 text-right text-xs font-normal tabular-nums text-gray-400">{decimalFormat(ask[2])}</p>
                                </div>
                            </div>
                        </button>
                    </div>
                ))
            }
        </>
    )
}
import { useEffect, useRef } from "react";
import { ChartManager } from "../utils/ChartManager";
import { getKlines } from "../utils/httpClient";
import { KLine } from "../utils/types";

export function TradeView({
    market,
}: {
    market: string;
}) {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartManagerRef = useRef<ChartManager>(null);

    const init = async () => {
        let klineData: KLine[] = [];
        try {
            klineData = await getKlines(market, "1h", Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), Math.floor(new Date().getTime() / 1000));
        } catch (e) { }

        if (chartRef) {
            if (chartManagerRef.current) {
                chartManagerRef.current.destroy();
            }
            const chartManager = new ChartManager(
                chartRef.current,
                [
                    ...klineData?.map((x) => ({
                        close: parseFloat(x.close),
                        high: parseFloat(x.high),
                        low: parseFloat(x.low),
                        open: parseFloat(x.open),
                        timestamp: new Date(x.end),
                    })),
                ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
                {
                    background: "#0e0f14",
                    color: "white",
                }
            );
            //@ts-ignore
            chartManagerRef.current = chartManager;
        }
    };

    useEffect(() => {
        init();
    }, [market, chartRef]);

    return (
        <>
            <div
                ref={chartRef}
                className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[460px] max-w-[1175px] mt-1 overflow-hidden rounded-xl m-2"
            >
            </div>
        </>
    );
}

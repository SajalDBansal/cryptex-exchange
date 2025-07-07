import { seperateSpot, top5Gainers, top5NewTrade, top5Popular } from "../utils/httpClient";
import { Ticker } from "../utils/types";

interface TopchartProps {
    tickers: Ticker[];
}

export const Topchart = ({ tickers }: TopchartProps) => {

    const gainers = top5Gainers(tickers);
    const seperatedSpots = seperateSpot(tickers);
    const populars = top5Popular(seperatedSpots);
    const newTickers = ["NS_USDC", "HAEDAL_USDC", "BLUE_USDC", "SEND_USDC", "DEEP_USDC"];
    const newest = top5NewTrade(tickers, newTickers);

    return (
        <div className="grid w-full items-center gap-4 sm:grid-cols-2 md:grid-cols-3">

            <div className="bg-[#14151b] rounded-lg text-base shadow-xs w-full p-4 px-0">
                <div className="flex justify-between flex-row mb-2 items-baseline px-4">
                    <p className="text-high-emphasis font-medium"><b>New</b></p>
                </div>
                {newest.map((t) => (
                    <a
                        key={t.symbol}
                        className="flex px-4 py-2 hover:bg-white/4"
                        href={`/trade/${t.symbol}`}
                    >
                        <span className="w-[40%]">
                            <div className="flex items-center flex-row min-w-max gap-2 w-full">
                                <div className="flex flex-row relative shrink-0">
                                    <img
                                        alt="POL Logo"
                                        loading="lazy"
                                        width="20"
                                        height="20"
                                        decoding="async"
                                        data-nimg="1"
                                        className="z-10 rounded-full"
                                        srcSet={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=32&q=75 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75 2x`}
                                        src={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75`}
                                        style={{ color: "transparent" }}
                                    />
                                </div>
                                <p className="font-medium text-high-emphasis text-nowrap text-sm">{t.symbol.split('_')[0]}</p>
                            </div>
                        </span>
                        <span className="w-[30%]">
                            <p className="text-high-emphasis font-medium text-right text-sm tabular-nums">$ {t.lastPrice}</p>
                        </span>
                        <span className="w-[30%]">
                            <p
                                className={`font-medium text-right text-sm tabular-nums ${parseFloat(t.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                            >
                                {parseFloat(t.priceChangePercent) >= 0 && "+"}
                                {(parseFloat(t.priceChangePercent) * 100).toFixed(2)}%
                            </p>
                        </span>
                    </a>
                ))}

            </div>

            <div className="bg-[#14151b] rounded-lg text-base shadow-xs w-full p-4 px-0">
                <div className="flex justify-between flex-row mb-2 items-baseline px-4">
                    <p className="text-high-emphasis font-medium"><b>Top Gainers</b></p>
                </div>
                {gainers.map((t) => (
                    <a
                        key={t.symbol}
                        className="flex px-4 py-2 hover:bg-white/4"
                        href={`/trade/${t.symbol}`}
                    >
                        <span className="w-[40%]">
                            <div className="flex items-center flex-row min-w-max gap-2 w-full">
                                <div className="flex flex-row relative shrink-0">
                                    <img
                                        alt="POL Logo"
                                        loading="lazy"
                                        width="20"
                                        height="20"
                                        decoding="async"
                                        data-nimg="1"
                                        className="z-10 rounded-full"
                                        srcSet={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=32&q=75 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75 2x`}
                                        src={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75`}
                                        style={{ color: "transparent" }}
                                    />
                                </div>
                                <p className="font-medium text-high-emphasis text-nowrap text-sm">{t.symbol.split('_')[0]}</p>
                            </div>
                        </span>
                        <span className="w-[30%]">
                            <p className="text-high-emphasis font-medium text-right text-sm tabular-nums">$ {t.lastPrice}</p>
                        </span>
                        <span className="w-[30%]">
                            <p
                                className={`font-medium text-right text-sm tabular-nums ${parseFloat(t.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                            >
                                {parseFloat(t.priceChangePercent) >= 0 && "+"}
                                {(parseFloat(t.priceChangePercent) * 100).toFixed(2)}%
                            </p>
                        </span>
                    </a>
                ))}
            </div>

            <div className="bg-[#14151b] rounded-lg text-base shadow-xs w-full p-4 px-0 sm:hidden md:block">
                <div className="flex justify-between flex-row mb-2 items-baseline px-4">
                    <p className="text-high-emphasis font-medium"><b>Popular</b></p>
                </div>
                {populars.map((t) => (
                    <a
                        key={t.symbol}
                        className="flex px-4 py-2 hover:bg-white/4"
                        href={`/trade/${t.symbol}`}
                    >
                        <span className="w-[40%]">
                            <div className="flex items-center flex-row min-w-max gap-2 w-full">
                                <div className="flex flex-row relative shrink-0">
                                    <img
                                        alt="POL Logo"
                                        loading="lazy"
                                        width="20"
                                        height="20"
                                        decoding="async"
                                        data-nimg="1"
                                        className="z-10 rounded-full"
                                        srcSet={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=32&q=75 1x, https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75 2x`}
                                        src={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${t.symbol.split('_')[0].toLowerCase()}.png&w=48&q=75`}
                                        style={{ color: "transparent" }}
                                    />
                                </div>
                                <p className="font-medium text-high-emphasis text-nowrap text-sm">{t.symbol.split('_')[0]}</p>
                            </div>
                        </span>
                        <span className="w-[30%]">
                            <p className="text-high-emphasis font-medium text-right text-sm tabular-nums">$ {t.lastPrice}</p>
                        </span>
                        <span className="w-[30%]">
                            <p
                                className={`font-medium text-right text-sm tabular-nums ${parseFloat(t.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}
                            >
                                {parseFloat(t.priceChangePercent) >= 0 && "+"}
                                {(parseFloat(t.priceChangePercent) * 100).toFixed(2)}%
                            </p>
                        </span>
                    </a>
                ))}

            </div>
        </div>
    )
}
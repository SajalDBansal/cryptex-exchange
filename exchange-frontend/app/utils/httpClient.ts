import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

const URL = process.env.NEXT_PUBLIC_PROXY_URL;

export async function getTicker(market: string): Promise<Ticker> {
    const tickers = await getTickers();
    const ticker = tickers.find(t => t.symbol === market);
    if (!ticker) {
        throw new Error(`No ticker found for ${market}`);
    }
    return ticker;
}

export async function getDepth(market: string): Promise<Depth> {
    const response = await axios.get(`${URL}/depth?symbol=${market}`);
    return response.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
    const response = await axios.get(`${URL}/trades?symbol=${market}`);
    return response.data;
}

export async function getTickers(): Promise<Ticker[]> {
    const response = await fetch(`${URL}/tickers`, {
        next: { revalidate: 60 }, // Revalidate the cache every 60 seconds    
    })
    const tickers = await response.json();
    return tickers;
}

export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {
    const response = await fetch(`${URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
    const data: KLine[] = await response.json();
    return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export function top5Gainers(tickers: Ticker[]) {
    const gainers = tickers.sort((a: Ticker, b: Ticker) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent));
    const top5 = gainers.slice(0, 5);
    return top5;
}

export function top5Popular(tickers: Ticker[]) {
    const mostPopular = tickers.sort((a: Ticker, b: Ticker) => parseInt(b.trades) - parseInt(a.trades));
    const top5 = mostPopular.slice(0, 5);
    return top5;
}

export function seperateSpot(tickers: Ticker[]) {
    const spot = tickers.filter((t: Ticker) => t.symbol.split('_').length <= 2);
    return spot;
}

export function seperateFutures(tickers: Ticker[]) {
    const futures = tickers.filter((t: Ticker) => t.symbol.split('_').length > 2);
    return futures;
}

export function tickersSorter(tickers: Ticker[], fieldName: string, order: string) {
    let volumeRange: Ticker[] = [];
    switch (fieldName) {
        case "symbol":
            if (order == "asc") {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => a.symbol.localeCompare(b.symbol));
            } else {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => b.symbol.localeCompare(a.symbol));
            }
            break;
        case "lastPrice":
            if (order == "asc") {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(b.lastPrice) - parseInt(a.lastPrice));
            } else {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(a.lastPrice) - parseInt(b.lastPrice));
            }
            break;
        case "quoteVolume":
            if (order == "asc") {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(b.quoteVolume) - parseInt(a.quoteVolume));
            } else {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(a.quoteVolume) - parseInt(b.quoteVolume));
            }
            break;
        case "volume":
            if (order == "asc") {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(b.volume) - parseInt(a.volume));
            } else {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(a.volume) - parseInt(b.volume));
            }
            break;
        case "trades":
            if (order == "asc") {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(b.trades) - parseInt(a.trades));
            } else {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(a.trades) - parseInt(b.trades));
            }
            break;
        case "priceChangePercent":
            if (order == "asc") {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseInt(b.priceChangePercent) - parseInt(a.priceChangePercent));
            } else {
                volumeRange = tickers.sort((a: Ticker, b: Ticker) => parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent));
            }
            break;
    }

    return volumeRange;
}

export function top5NewTrade(tickers: Ticker[], markets: string[]) {
    const topNew = tickers.filter((t: Ticker) => markets.some(m => m === t.symbol));
    return topNew;
}

export function topCrypto(tickers: Ticker[], markets: { symbol: string, name: string }[]) {
    const topNew = tickers.filter((t: Ticker) => markets.some(m => m.symbol === t.symbol));
    return topNew;
}

export const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
    if (num >= 0 && num <= 1) return `$${num}`;
    return `$${num.toFixed(3).toLocaleString()}`;
};

export const decimalFormat = (num: number): string => {
    // Convert to string and handle trailing zeros properly
    const numStr = num.toString();

    // If the number doesn't have a decimal point, return as is
    if (!numStr.includes('.')) {
        return numStr;
    }

    // Remove trailing zeros after decimal point, but keep at least 2 decimal places
    const parts = numStr.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1];

    // Remove trailing zeros
    const trimmedDecimal = decimalPart.replace(/0+$/, '');

    // If we have decimal digits after trimming, format with at least 2 decimal places
    // but limit to maximum 5 decimal places
    if (trimmedDecimal.length > 0) {
        const minDecimals = Math.max(trimmedDecimal.length, 2);
        const maxDecimals = Math.min(minDecimals, 5);
        return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
    }

    // If no decimal digits remain, return integer part
    return integerPart;
}

"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import { Ticker } from '../utils/types';
import { getTickers, topCrypto } from '../utils/httpClient';
import { useRouter } from 'next/navigation';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    tickers: Ticker[]
}

export const SearchOverlay = ({
    isOpen,
    onClose,
    searchTerm,
    onSearchChange,
    tickers
}: SearchOverlayProps) => {
    const router = useRouter();

    const searchInputRef = useRef<HTMLInputElement>(null);

    const topCryptos = [
        { symbol: 'BTC_USDC', name: 'Bitcoin' },
        { symbol: 'ETH_USDC', name: 'Ethereum' },
        { symbol: 'LINK_USDC', name: 'Chainlink' },
        { symbol: 'SOL_USDC', name: 'Solana' },
    ];

    const filteredCryptos = searchTerm.length == 0 ?
        topCrypto(tickers, topCryptos) :
        tickers.filter(crypto =>
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-transparent bg-opacity-80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Search Modal */}
            <div className="relative w-full max-w-xl mx-4 bg-[#14151b] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search cryptocurrencies..."
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full bg-0e0f14 border border-gray-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors text-lg"
                            />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 text-gray-400 hover:text-white hover:bg-white/4 rounded-xl transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto search-overlay-scroll">
                    {searchTerm === '' && (
                        <div className="pl-4 pt-4 border-b border-gray-800">
                            <h3 className="text-white font-semibold text-sm mb-2">Popular Cryptocurrencies</h3>
                        </div>
                    )}

                    {filteredCryptos.length > 0 ? (
                        <div className="divide-y divide-gray-800">
                            {filteredCryptos.map((crypto) => (
                                <div
                                    key={crypto.symbol}
                                    // href={`/trade/${crypto.symbol}`}
                                    className="p-5 hover:bg-white/4 transition-colors cursor-pointer group"
                                    onClick={() => {
                                        // Handle crypto selection here
                                        router.push(`/trade/${crypto.symbol}`);
                                        onClose();
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
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
                                                <div className="text-white font-semibold text-lg">{crypto.symbol}</div>
                                                <div className="text-gray-400 text-sm">{crypto.symbol}</div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-white font-semibold text-lg mb-1">
                                                ${parseFloat(crypto.lastPrice) < 1 ? parseFloat(crypto.lastPrice).toFixed(4) : parseFloat(crypto.lastPrice).toLocaleString()}
                                            </div>
                                            <div className={`flex items-center justify-end space-x-1 ${parseFloat(crypto.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {parseFloat(crypto.priceChangePercent) >= 0 ? (
                                                    <TrendingUp size={14} />
                                                ) : (
                                                    <TrendingDown size={14} />
                                                )}
                                                <span className="font-medium text-sm">
                                                    {parseFloat(crypto.priceChangePercent) >= 0 ? '+' : ''}{parseFloat(crypto.priceChangePercent)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 text-lg mb-2">No results found</div>
                            <div className="text-gray-500 text-sm">
                                Try searching for a different cryptocurrency name or symbol
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 bg-[#14151b]">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Press ESC to close • Press "/" to search</span>
                        <span>{filteredCryptos.length} results</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
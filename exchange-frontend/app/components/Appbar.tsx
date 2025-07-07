"use client"
import { Search, Bell, User, Settings, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SearchOverlay } from './SearchOverlay';
import { Ticker } from '../utils/types';
import { getTickers } from '../utils/httpClient';

export const Appbar = () => {
    const location = usePathname();

    const [tickers, setTickers] = useState<Ticker[]>([]);

    const fetchData = useCallback(async () => {
        try {
            getTickers().then((res) => { setTickers(res) });
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const isActive = (path: string) => {
        return location === path;
    };

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchOpen = () => {
        setIsSearchOpen(true);
    };

    const handleSearchClose = () => {
        setIsSearchOpen(false);
        setSearchTerm('');
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if the pressed key is "/" and no input/textarea is focused
            if (e.key === '/' && !isSearchOpen) {
                const activeElement = document.activeElement;
                const isInputFocused =
                    activeElement?.tagName === 'INPUT' ||
                    activeElement?.tagName === 'TEXTAREA' ||
                    (activeElement instanceof HTMLElement && activeElement.isContentEditable);

                if (!isInputFocused) {
                    e.preventDefault();
                    handleSearchOpen();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isSearchOpen]);

    const pathname = usePathname();
    const isTrade = pathname.includes("/trade")

    return (
        <header className="bg-transparent px-6 py-4 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">

            <div className="flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-8">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">CryptEx</span>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className={`transition-colors font-medium ${isActive('/') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/markets"
                            className={`transition-colors font-medium ${isActive('/markets') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Markets
                        </Link>
                        <Link
                            href="/trade/BTC_USDC"
                            className={`transition-colors font-medium ${isTrade ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Trade
                        </Link>
                        <Link
                            href="/portfolio"
                            className={`transition-colors font-medium ${isActive('/portfolio') ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Portfolio
                        </Link>

                    </nav>
                </div>

                {/* Search and User Actions */}
                <div className="flex items-center space-x-4">
                    <div className="relative hidden lg:block">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search coins... (Press / to search)"
                            onClick={handleSearchOpen}
                            readOnly
                            className="bg-gray-950 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors w-80 cursor-pointer hover:border-gray-700"
                        />
                    </div>

                    <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-colors">
                        <Bell size={20} />
                    </button>

                    <button className="p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-colors">
                        <Settings size={20} />
                    </button>

                    <a
                        href='/auth'
                        className="hidden md:flex items-center space-x-3 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-colors"
                    >
                        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                        {/* <span className="text-white font-medium hidden md:block">john.doe</span> */}
                    </a>
                    <a
                        href='/auth'
                        className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center md:hidden">
                        <User size={16} className="text-white" />
                    </a>

                </div>

            </div>

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={handleSearchClose}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                tickers={tickers}
            />

        </header>
    );
};
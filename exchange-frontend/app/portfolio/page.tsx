"use client";
import { Download, Eye, EyeOff, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true);
    return (
        <div className="min-h-screen bg-[#0e0f14] pt-20">
            <div className="container mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Portfolio</h1>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                            className="p-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition-colors"
                        >
                            {isBalanceVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                        <button className="flex items-center space-x-2 bg-white/6 hover:bg-white/8 text-white px-6 py-3 rounded-xl transition-colors">
                            <Download size={16} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Portfolio Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Balance */}
                    <div className="lg:col-span-2 bg-[#14151b] border border-gray-900 rounded-2xl p-6">
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-white/4 rounded-2xl flex items-center justify-center mb-4">
                                <Wallet size={32} className="text-gray-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                            <p className="text-gray-400 mb-6 max-w-md">
                                Connect your wallet to view your portfolio balance, performance, and trading history.
                            </p>
                            <button className="bg-white/6 hover:bg-white/8 text-white px-8 py-3 rounded-xl font-medium transition-colors">
                                Connect Wallet
                            </button>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="bg-[#14151b] border border-gray-900 rounded-2xl p-6">
                        <h3 className="text-white font-semibold mb-4">Performance</h3>
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <div className="w-12 h-12 bg-white/4 rounded-xl flex items-center justify-center mb-3">
                                <TrendingUp size={24} className="text-gray-600" />
                            </div>
                            <p className="text-gray-400 text-sm">
                                Connect your wallet to see performance stats
                            </p>
                        </div>
                    </div>
                </div>

                {/* Portfolio Details and Recent Trades */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Holdings */}
                    <div className="bg-[#14151b] border border-gray-900 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Holdings</h2>
                            <button className="p-2 text-gray-400 hover:text-white transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 bg-white/4 rounded-2xl flex items-center justify-center mb-4">
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No Holdings Yet</h3>
                            <p className="text-gray-400 mb-6 max-w-sm">
                                Connect your wallet to view your cryptocurrency holdings and portfolio allocation.
                            </p>
                            <button className="bg-white/6 hover:bg-white/8 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Connect Wallet
                            </button>
                        </div>
                    </div>

                    {/* Recent Trades */}
                    <div className="bg-[#14151b] border border-gray-900 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">Recent Trades</h3>
                            <div className="w-4 h-4 bg-gray-700 rounded-full animate-pulse"></div>
                        </div>

                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-18 h-18 p-2 bg-white/4 rounded-2xl flex items-center justify-center mb-4">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-8 bg-green-500 rounded-sm"></div>
                                    <div className="w-2 h-6 bg-red-500 rounded-sm"></div>
                                    <div className="w-2 h-10 bg-green-500 rounded-sm"></div>
                                    <div className="w-2 h-4 bg-red-500 rounded-sm"></div>
                                    <div className="w-2 h-7 bg-green-500 rounded-sm"></div>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No Trading History</h3>
                            <p className="text-gray-400 mb-6 max-w-sm">
                                Connect your wallet to view your recent trades and transaction history.
                            </p>
                            <button className="bg-white/6 hover:bg-white/8 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                Start Trading
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {/* Total P&L */}
                    <div className="bg-[#14151b] border border-gray-900 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Total P&L</h3>
                            <TrendingUp size={20} className="text-gray-600" />
                        </div>
                        <div className="text-center py-8">
                            <div className="text-2xl font-bold text-gray-600 mb-2">--</div>
                            <p className="text-gray-400 text-sm">Connect wallet to see P&L</p>
                        </div>
                    </div>

                    {/* Best Performer */}
                    <div className="bg-[#14151b] border border-gray-900 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Best Performer</h3>
                            <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                        </div>
                        <div className="text-center py-8">
                            <div className="text-2xl font-bold text-gray-600 mb-2">--</div>
                            <p className="text-gray-400 text-sm">Connect wallet to see stats</p>
                        </div>
                    </div>

                    {/* Worst Performer */}
                    <div className="bg-[#14151b] border border-gray-900 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Worst Performer</h3>
                            <TrendingDown size={20} className="text-gray-600" />
                        </div>
                        <div className="text-center py-8">
                            <div className="text-2xl font-bold text-gray-600 mb-2">--</div>
                            <p className="text-gray-400 text-sm">Connect wallet to see stats</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
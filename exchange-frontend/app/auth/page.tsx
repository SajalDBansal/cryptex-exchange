"use client";
import { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle authentication logic here
        console.log('Form submitted:', formData);
    };

    // Mock candlestick data for background
    const generateCandlesticks = () => {
        return Array.from({ length: 50 }, (_, i) => {
            const basePrice = 43000 + Math.sin(i * 0.1) * 2000;
            const volatility = Math.random() * 500;
            const isGreen = Math.random() > 0.5;

            return {
                x: i * 20,
                open: basePrice + (Math.random() - 0.5) * volatility,
                high: basePrice + Math.random() * volatility,
                low: basePrice - Math.random() * volatility,
                close: basePrice + (isGreen ? 1 : -1) * Math.random() * volatility,
                isGreen
            };
        });
    };

    const candlesticks = generateCandlesticks();

    return (
        <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center pt-25">
            {/* Trading Chart Background */}
            <div className="absolute inset-0 opacity-20">
                <img
                    className='h-full w-full opacity-50'
                    src={"/chart.svg"}
                />

            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"></div>
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

            {/* Authentication Form */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-gray-950/80 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <TrendingUp size={32} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {isSignUp ? 'Create Account' : 'Sign In'}
                        </h1>
                        <p className="text-gray-400">
                            {isSignUp
                                ? 'Join the future of crypto trading'
                                : 'Welcome back to CryptoEx'
                            }
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Name Fields (Sign Up Only) */}
                        {isSignUp && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 focus:bg-black/70"
                                        required={isSignUp}
                                    />
                                </div>
                                <div className="relative">
                                    <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 focus:bg-black/70"
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="relative">
                            <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 focus:bg-black/70"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 focus:bg-black/70"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Confirm Password Field (Sign Up Only) */}
                        {isSignUp && (
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 focus:bg-black/70"
                                    required={isSignUp}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        )}

                        {/* Forgot Password Link (Sign In Only) */}
                        {!isSignUp && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">
                                    New here?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUp(true)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Sign up
                                    </button>
                                </span>
                                <button
                                    type="button"
                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        {/* Sign Up Link (Sign Up Only) */}
                        {isSignUp && (
                            <div className="text-center text-sm">
                                <span className="text-gray-400">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setIsSignUp(false)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25"
                        >
                            {isSignUp ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-4 flex items-center">
                        <div className="flex-1 border-t border-gray-700"></div>
                        <span className="px-4 text-gray-400 text-sm">or</span>
                        <div className="flex-1 border-t border-gray-700"></div>
                    </div>

                    {/* Social Login Options */}
                    <div className="space-y-3">
                        <button className="w-full bg-white/10 hover:bg-white/20 border border-gray-700 hover:border-gray-600 text-white py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3">
                            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                                <span className="text-black text-xs font-bold">G</span>
                            </div>
                            <span>Continue with Google</span>
                        </button>

                        <button className="w-full bg-white/10 hover:bg-white/20 border border-gray-700 hover:border-gray-600 text-white py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-3">
                            <div className="w-5 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                                <span className="text-white text-xs font-bold">f</span>
                            </div>
                            <span>Continue with Facebook</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
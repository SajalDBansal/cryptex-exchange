import { ArrowRight, Award, BarChart3, Globe, Shield, Star, TrendingDown, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Topchart } from "./components/Topchart";
import { getTickers, topCrypto } from "./utils/httpClient";

export default async function Home() {
  const tickers = await getTickers();

  const topCryptos = [
    { symbol: 'BTC_USDC', name: 'Bitcoin' },
    { symbol: 'ETH_USDC', name: 'Ethereum' },
    { symbol: 'LINK_USDC', name: 'Chainlink' },
    { symbol: 'SOL_USDC', name: 'Solana' },
  ];
  const topChart = topCrypto(tickers, topCryptos);

  const features = [
    {
      icon: <Shield className="w-10 h-10 text-blue-400" />,
      title: 'Bank-Grade Security',
      description: 'Multi-signature wallets, cold storage, and advanced encryption protect your digital assets 24/7'
    },
    {
      icon: <Zap className="w-10 h-10 text-yellow-400" />,
      title: 'Lightning Fast Execution',
      description: 'Execute trades in under 10ms with our cutting-edge matching engine and global infrastructure'
    },
    {
      icon: <Globe className="w-10 h-10 text-green-400" />,
      title: 'Global Liquidity',
      description: 'Access deep liquidity pools and trade 200+ cryptocurrencies with minimal slippage'
    },
    {
      icon: <BarChart3 className="w-10 h-10 text-purple-400" />,
      title: 'Advanced Analytics',
      description: 'Professional trading tools, real-time charts, and comprehensive market analysis'
    }
  ];

  const achievements = [
    { icon: <Users className="w-8 h-8 text-blue-400" />, value: '50M+', label: 'Trusted Users' },
    { icon: <Award className="w-8 h-8 text-yellow-400" />, value: '#1', label: 'Security Rating' },
    { icon: <Star className="w-8 h-8 text-green-400" />, value: '99.9%', label: 'Uptime' },
    { icon: <BarChart3 className="w-8 h-8 text-purple-400" />, value: '$2.1T', label: 'Volume Traded' }
  ];

  return (
    <div className="min-h-screen bg-[#0e0f14]">

      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 py-20 mt-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Live Trading • 24/7</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              The Future of
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Crypto Trading
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the most advanced cryptocurrency exchange with institutional-grade security,
              lightning-fast execution, and access to global liquidity pools.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/trade"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 flex items-center space-x-3"
              >
                <span>Start Trading Now</span>
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/markets"
                className="group border-2 border-gray-700 hover:border-gray-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-900/50 backdrop-blur-sm"
              >
                Explore Markets
              </Link>
            </div>
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl group-hover:border-gray-700 transition-colors">
                    {achievement.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{achievement.value}</div>
                <div className="text-gray-400">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Chart Ticker */}
      <div className="pt-6 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Top Chart</h2>
            <Link href="/markets" className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 group">
              <span>View All Markets</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <Topchart tickers={tickers} />
        </div>
      </div>

      {/* Live Market Ticker */}
      <div className=" py-6 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Live Markets</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topChart.map((crypto, index) => (
              <a
                href={`/trade/${crypto.symbol}_USD`}
                key={crypto.symbol}
                className="group bg-[#14151b] backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 hover:bg-white/4 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {/* <div className={`w-12 h-12 bg-gradient-to-r ${crypto.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{crypto.icon}</span>
                    </div> */}

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
                      <div className="text-white font-bold text-lg">{crypto.symbol}</div>
                      <div className="text-gray-400 text-sm">{topCryptos[index].name}</div>
                    </div>
                  </div>
                </div>

                <div className="text-2xl font-bold text-white mb-3">
                  ${crypto.lastPrice.toLocaleString()}
                </div>

                <div className={`flex items-center space-x-2 ${parseFloat(crypto.priceChangePercent) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                  {parseFloat(crypto.priceChangePercent) >= 0 ? (
                    <TrendingUp size={18} />
                  ) : (
                    <TrendingDown size={18} />
                  )}
                  <span className="font-semibold text-lg">
                    {parseFloat(crypto.priceChangePercent) >= 0 ? '+' : ''}{(parseFloat(crypto.priceChangePercent) * 100).toFixed(2)}%
                  </span>
                  <span className="text-gray-400 text-sm">24h</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose CryptoEx?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built for traders, by traders. Experience the difference with our cutting-edge platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-950/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 hover:bg-gray-950/70 transition-all duration-300">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 p-4 bg-gray-900/50 rounded-2xl group-hover:bg-gray-900/70 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 bg-gradient-to-r from-gray-950 via-[#0e0f14] to-gray-950">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join millions of traders worldwide and experience the future of cryptocurrency trading.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/trade"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              Create Free Account
            </Link>
            <Link
              href="/portfolio"
              className="border-2 border-gray-700 hover:border-gray-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-900/50"
            >
              View Demo Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>

  );
}

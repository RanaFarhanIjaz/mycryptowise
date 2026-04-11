'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
  AlertCircle,
  Zap,
  Globe,
  DollarSign,
  BarChart3,
  Activity,
  Github,
  Twitter,
  MessageCircle,
  ExternalLink,
  Calendar,
  Users,
  Target,
  Rocket,
  Sparkles,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Star,
  Info,
  Shield,
  Zap as ZapIcon,
  Cpu,
  Network,
  Coins
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import axios from 'axios'

// Types
interface PriceData {
  price: number
  change: number
  changePercent: number
  high24h: number
  low24h: number
  volume: number
  quoteVolume: number
}

// Crypto Database (same as your existing)
export interface CryptoInfo {
  name: string
  fullName: string
  symbol?: string
  description: string
  longDescription: string
  founded: string
  founder: string
  website: string
  whitepaper?: string
  github?: string
  twitter?: string
  discord?: string
  consensus: string
  maxSupply: string
  circulatingSupply: string
  marketCap: string
  allTimeHigh: string
  allTimeLow: string
  useCases: string[]
  features: string[]
  strengths?: string[]
  weaknesses?: string[]
  whyInvest?: string[]
  futureOutlook?: string[]
  competitors?: string[]
  roadmap?: Array<{ year: string; event: string }>
  price?: number
  change24h?: number
}

// Your existing crypto database (keeping it short here, use your full version)
const cryptoDatabase: Record<string, CryptoInfo> = {
  BTC: {
    name: 'Bitcoin',
    fullName: 'Bitcoin (BTC)',
    symbol: 'BTC',
    description: 'First decentralized cryptocurrency',
    longDescription: 'Bitcoin is the world\'s first cryptocurrency...',
    founded: '2009',
    founder: 'Satoshi Nakamoto',
    website: 'https://bitcoin.org',
    whitepaper: 'https://bitcoin.org/bitcoin.pdf',
    github: 'https://github.com/bitcoin',
    twitter: 'https://twitter.com/bitcoin',
    discord: 'https://discord.gg/bitcoin',
    consensus: 'Proof of Work (PoW)',
    maxSupply: '21,000,000 BTC',
    circulatingSupply: '~19,600,000 BTC',
    marketCap: '~$1,200,000,000,000',
    allTimeHigh: '$73,750',
    allTimeLow: '$0.01',
    useCases: ['Store of value', 'Cross-border payments', 'Hedge against inflation'],
    features: ['Decentralized', 'Limited supply', 'Proof of Work', 'Most secure'],
    strengths: ['First mover advantage', 'Strongest network effect', 'Most secure'],
    weaknesses: ['Slow transactions', 'High energy consumption', 'Limited scalability'],
    whyInvest: ['Digital scarcity', 'Fixed supply', 'Growing institutional adoption'],
    futureOutlook: ['Lightning Network', 'Increased adoption', 'Global reserve asset'],
    competitors: ['Ethereum', 'Litecoin', 'Bitcoin Cash'],
    roadmap: [
      { year: '2009', event: 'Network Launch' },
      { year: '2012', event: 'First Halving' },
      { year: '2017', event: 'SegWit Activation' },
      { year: '2021', event: 'Taproot Upgrade' },
      { year: '2024', event: 'Fourth Halving' }
    ]
  },
  ETH: {
    name: 'Ethereum',
    fullName: 'Ethereum (ETH)',
    symbol: 'ETH',
    description: 'Decentralized global computer for smart contracts',
    longDescription: 'Ethereum is a decentralized blockchain with smart contract functionality...',
    founded: '2015',
    founder: 'Vitalik Buterin',
    website: 'https://ethereum.org',
    whitepaper: 'https://ethereum.org/whitepaper',
    github: 'https://github.com/ethereum',
    twitter: 'https://twitter.com/ethereum',
    discord: 'https://discord.gg/ethereum',
    consensus: 'Proof of Stake (PoS)',
    maxSupply: 'No max supply',
    circulatingSupply: '~120,000,000 ETH',
    marketCap: '~$350,000,000,000',
    allTimeHigh: '$4,878',
    allTimeLow: '$0.42',
    useCases: ['Smart contracts', 'DeFi', 'NFTs', 'DAOs'],
    features: ['Smart contract platform', 'EVM', 'Proof of Stake', 'Layer 2'],
    strengths: ['First-mover in smart contracts', 'Largest developer ecosystem'],
    weaknesses: ['High gas fees', 'Scalability challenges'],
    whyInvest: ['Foundation of DeFi', 'Staking yields', 'Network effects'],
    futureOutlook: ['Danksharding', 'Further fee reductions', 'ZK-rollups'],
    competitors: ['Solana', 'Cardano', 'Avalanche'],
    roadmap: [
      { year: '2015', event: 'Mainnet Launch' },
      { year: '2022', event: 'The Merge' },
      { year: '2024', event: 'Cancun Upgrade' }
    ]
  },
  SOL: {
    name: 'Solana',
    fullName: 'Solana (SOL)',
    symbol: 'SOL',
    description: 'High-performance blockchain for scalable apps',
    longDescription: 'Solana is a high-performance blockchain with 50,000+ TPS...',
    founded: '2020',
    founder: 'Anatoly Yakovenko',
    website: 'https://solana.com',
    whitepaper: 'https://solana.com/solana-whitepaper.pdf',
    github: 'https://github.com/solana-labs',
    twitter: 'https://twitter.com/solana',
    discord: 'https://discord.gg/solana',
    consensus: 'Proof of History + PoS',
    maxSupply: 'No max supply',
    circulatingSupply: '~450,000,000 SOL',
    marketCap: '~$45,000,000,000',
    allTimeHigh: '$260',
    allTimeLow: '$0.50',
    useCases: ['DeFi', 'NFTs', 'Web3 gaming', 'Payments'],
    features: ['50,000+ TPS', 'Sub-second finality', 'Low fees', 'EVM compatible'],
    strengths: ['Extremely fast', 'Low fees', 'Growing ecosystem'],
    weaknesses: ['Network outages', 'Centralization concerns'],
    whyInvest: ['High scalability', 'Strong VC backing', 'Real-world partnerships'],
    futureOutlook: ['Firedancer', 'Mobile Stack', 'Token extensions'],
    competitors: ['Ethereum', 'BNB Chain', 'Avalanche'],
    roadmap: [
      { year: '2020', event: 'Mainnet Launch' },
      { year: '2022', event: 'Mobile Stack Launch' },
      { year: '2024', event: 'Firedancer Alpha' }
    ]
  },
  BNB: {
    name: 'BNB',
    fullName: 'BNB (BNB Chain)',
    symbol: 'BNB',
    description: 'Native cryptocurrency of BNB Chain ecosystem',
    longDescription: 'BNB powers the BNB Chain ecosystem including BSC...',
    founded: '2017',
    founder: 'Changpeng Zhao',
    website: 'https://bnbchain.org',
    github: 'https://github.com/bnb-chain',
    twitter: 'https://twitter.com/BNBCHAIN',
    consensus: 'Proof of Staked Authority',
    maxSupply: '200,000,000 BNB',
    circulatingSupply: '~153,000,000 BNB',
    marketCap: '~$50,000,000,000',
    allTimeHigh: '$690',
    allTimeLow: '$0.10',
    useCases: ['Transaction fees', 'Staking', 'Exchange utility'],
    features: ['Fast transactions', 'EVM compatible', 'Regular token burns'],
    strengths: ['Binance backing', 'Large user base', 'Low fees'],
    weaknesses: ['Centralization concerns', 'Regulatory scrutiny'],
    whyInvest: ['Deflationary tokenomics', 'Exchange integration', 'Growing L2'],
    futureOutlook: ['opBNB scaling', 'Greenfield storage', 'ZK-rollups'],
    competitors: ['Ethereum', 'Solana', 'Polygon'],
    roadmap: [
      { year: '2017', event: 'Token Launch' },
      { year: '2021', event: 'BSC Launch' },
      { year: '2023', event: 'opBNB Launch' }
    ]
  },
  XRP: {
    name: 'XRP',
    fullName: 'XRP (Ripple)',
    symbol: 'XRP',
    description: 'Digital payment protocol for fast settlements',
    longDescription: 'XRP is designed for enterprise cross-border payments...',
    founded: '2012',
    founder: 'Chris Larsen, Jed McCaleb',
    website: 'https://ripple.com/xrp',
    github: 'https://github.com/ripple',
    twitter: 'https://twitter.com/Ripple',
    consensus: 'Federated Consensus',
    maxSupply: '100,000,000,000 XRP',
    circulatingSupply: '~55,000,000,000 XRP',
    marketCap: '~$30,000,000,000',
    allTimeHigh: '$3.84',
    allTimeLow: '$0.002',
    useCases: ['Cross-border payments', 'Bank settlements', 'Remittances'],
    features: ['Fast settlement (3-5 sec)', 'Very low fees', 'Energy efficient'],
    strengths: ['Banking partnerships', 'Regulatory progress', 'Fast transactions'],
    weaknesses: ['SEC lawsuit', 'Centralization concerns'],
    whyInvest: ['Real-world banking use', 'Cross-border payments', 'Regulatory clarity'],
    futureOutlook: ['SEC resolution', 'US banking adoption', 'CBDC integration'],
    competitors: ['Stellar', 'SWIFT', 'Visa'],
    roadmap: [
      { year: '2012', event: 'XRP Ledger Launch' },
      { year: '2023', event: 'Partial Court Victory' }
    ]
  },
  ADA: {
    name: 'Cardano',
    fullName: 'Cardano (ADA)',
    symbol: 'ADA',
    description: 'Proof-of-stake blockchain focused on sustainability',
    longDescription: 'Cardano is built on peer-reviewed academic research...',
    founded: '2017',
    founder: 'Charles Hoskinson',
    website: 'https://cardano.org',
    github: 'https://github.com/input-output-hk',
    twitter: 'https://twitter.com/Cardano',
    discord: 'https://discord.gg/cardano',
    consensus: 'Ouroboros PoS',
    maxSupply: '45,000,000,000 ADA',
    circulatingSupply: '~35,000,000,000 ADA',
    marketCap: '~$15,000,000,000',
    allTimeHigh: '$3.09',
    allTimeLow: '$0.02',
    useCases: ['Smart contracts', 'DeFi', 'Supply chain', 'Digital identity'],
    features: ['Peer-reviewed', 'Energy-efficient', 'Layered architecture'],
    strengths: ['Research-driven', 'Energy efficient', 'Real-world adoption'],
    weaknesses: ['Slow development', 'Smaller ecosystem'],
    whyInvest: ['Scientific approach', 'Sustainable', 'Staking yields'],
    futureOutlook: ['Hydra scaling', 'Midnight sidechain', 'DeFi growth'],
    competitors: ['Ethereum', 'Solana', 'Avalanche'],
    roadmap: [
      { year: '2017', event: 'Mainnet Launch' },
      { year: '2021', event: 'Smart Contracts' }
    ]
  },
  GOLD: {
    name: 'Gold',
    fullName: 'Gold (XAU)',
    symbol: 'GOLD',
    description: 'Precious metal and historical store of value',
    longDescription: 'Gold has been used as money for thousands of years...',
    founded: 'Ancient times',
    founder: 'Unknown',
    website: 'https://www.gold.org',
    consensus: 'Physical commodity',
    maxSupply: '~244,000 metric tons',
    circulatingSupply: '~201,000 metric tons',
    marketCap: '~$12,000,000,000,000',
    allTimeHigh: '$2,750',
    allTimeLow: '$35',
    useCases: ['Store of value', 'Hedge against inflation', 'Jewelry'],
    features: ['Physical asset', 'Historical value', 'Global liquidity'],
    strengths: ['Thousands of years as money', 'Central bank holdings'],
    weaknesses: ['Storage costs', 'No yield'],
    whyInvest: ['Ultimate store of value', 'Portfolio diversification', 'Safe-haven'],
    futureOutlook: ['Central bank buying', 'Digital gold tokens', 'ETF growth'],
    competitors: ['Bitcoin', 'Silver', 'Treasury bonds'],
    roadmap: [
      { year: '3000 BC', event: 'First Gold Use' },
      { year: '1971', event: 'End of Gold Standard' }
    ]
  },
  SILVER: {
    name: 'Silver',
    fullName: 'Silver (XAG)',
    symbol: 'SILVER',
    description: 'Precious metal with industrial applications',
    longDescription: 'Silver has both investment value and industrial uses...',
    founded: 'Ancient times',
    founder: 'Unknown',
    website: 'https://www.silverinstitute.org',
    consensus: 'Physical commodity',
    maxSupply: '~1.7 million metric tons',
    circulatingSupply: '~1.5 million metric tons',
    marketCap: '~$1,300,000,000,000',
    allTimeHigh: '$49.45',
    allTimeLow: '$3.50',
    useCases: ['Store of value', 'Solar panels', 'Electronics', 'Jewelry'],
    features: ['Industrial + precious', 'Affordable', 'Good conductor'],
    strengths: ['Industrial demand', 'Affordable entry', 'Dual demand'],
    weaknesses: ['Price volatility', 'Industrial dependency'],
    whyInvest: ['Green energy transition', 'EV manufacturing', 'Historical money'],
    futureOutlook: ['Solar demand', 'EV growth', '5G applications'],
    competitors: ['Gold', 'Platinum', 'Copper'],
    roadmap: [
      { year: '3000 BC', event: 'First Silver Use' },
      { year: '2025', event: 'Solar Demand Surge' }
    ]
  }
}

function getCryptoInfo(symbol: string): CryptoInfo {
  const upperSymbol = symbol.toUpperCase()
  const defaultInfo: CryptoInfo = {
    name: symbol,
    fullName: `${symbol} (${symbol})`,
    description: `${symbol} is a cryptocurrency in the market.`,
    longDescription: `${symbol} is a digital asset traded on various exchanges.`,
    founded: 'N/A',
    founder: 'Unknown',
    website: '#',
    consensus: 'Various',
    maxSupply: 'Unknown',
    circulatingSupply: 'Unknown',
    marketCap: 'Unknown',
    allTimeHigh: 'Unknown',
    allTimeLow: 'Unknown',
    useCases: ['Trading', 'Investment'],
    features: ['Digital asset', 'Blockchain-based'],
    roadmap: []
  }
  return cryptoDatabase[upperSymbol] || { ...defaultInfo, name: symbol, symbol: upperSymbol }
}

async function getLivePrice(symbol: string): Promise<number> {
  try {
    if (symbol === 'GOLD' || symbol === 'XAU') {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=XAUUSDT')
      return parseFloat(response.data.lastPrice)
    }
    if (symbol === 'SILVER' || symbol === 'XAG') {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=XAGUSDT')
      return parseFloat(response.data.lastPrice)
    }
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`)
    return parseFloat(response.data.price)
  } catch (error) {
    if (symbol === 'GOLD' || symbol === 'XAU') return 2334.50
    if (symbol === 'SILVER' || symbol === 'XAG') return 27.50
    throw new Error(`Could not fetch price for ${symbol}`)
  }
}

async function get24hrStats(symbol: string) {
  try {
    if (symbol === 'SILVER' || symbol === 'XAG') {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=XAGUSDT')
      return {
        priceChange: parseFloat(response.data.priceChange),
        priceChangePercent: parseFloat(response.data.priceChangePercent),
        high24h: parseFloat(response.data.highPrice),
        low24h: parseFloat(response.data.lowPrice),
        volume: parseFloat(response.data.volume),
        quoteVolume: parseFloat(response.data.quoteVolume)
      }
    }
    if (symbol === 'GOLD' || symbol === 'XAU') {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=XAUUSDT')
      return {
        priceChange: parseFloat(response.data.priceChange),
        priceChangePercent: parseFloat(response.data.priceChangePercent),
        high24h: parseFloat(response.data.highPrice),
        low24h: parseFloat(response.data.lowPrice),
        volume: parseFloat(response.data.volume),
        quoteVolume: parseFloat(response.data.quoteVolume)
      }
    }
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`)
    return {
      priceChange: parseFloat(response.data.priceChange),
      priceChangePercent: parseFloat(response.data.priceChangePercent),
      high24h: parseFloat(response.data.highPrice),
      low24h: parseFloat(response.data.lowPrice),
      volume: parseFloat(response.data.volume),
      quoteVolume: parseFloat(response.data.quoteVolume)
    }
  } catch (error) {
    return null
  }
}

export default function CryptoDetailPage() {
  const params = useParams()
  const symbol = (params.symbol as string).toUpperCase()
  const cryptoInfo = getCryptoInfo(symbol)
  
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [price, stats] = await Promise.all([
          getLivePrice(symbol),
          get24hrStats(symbol)
        ])
        setPriceData({
          price,
          change: stats?.priceChange || 0,
          changePercent: stats?.priceChangePercent || 0,
          high24h: stats?.high24h || price,
          low24h: stats?.low24h || price,
          volume: stats?.volume || 0,
          quoteVolume: stats?.quoteVolume || 0
        })
        setLastUpdate(new Date())
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch price')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [symbol])

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return '---'
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    if (price < 10) return price.toFixed(3)
    if (price < 1000) return price.toFixed(2)
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const formatLargeNumber = (num: number | undefined) => {
    if (num === undefined) return '---'
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-4 max-w-full">
        
        {/* Mobile Back Button - Simple */}
        <div className="mb-4">
          <Link href="/prices" className="inline-flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </div>

        {/* Header - Mobile Optimized */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold">
            {symbol}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{cryptoInfo.name}</h1>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Founded: {cryptoInfo.founded}</span>
              <span>•</span>
              <span>{cryptoInfo.founder}</span>
            </div>
          </div>
        </div>

        {/* Live Price Card - Mobile Optimized */}
        {loading && !priceData ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        ) : priceData ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {time.toLocaleTimeString()}
                </Badge>
                <Badge className="bg-green-500 text-xs">
                  <Zap className="h-3 w-3 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              </div>
              <div className="flex gap-1">
                {cryptoInfo.website && cryptoInfo.website !== '#' && (
                  <a href={cryptoInfo.website} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Globe className="h-3 w-3" />
                  </a>
                )}
                {cryptoInfo.twitter && (
                  <a href={cryptoInfo.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Twitter className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">
                  ${formatPrice(priceData?.price)}
                </span>
                <div className={`flex items-center px-2 py-1 rounded-full text-sm ${
                  (priceData?.changePercent || 0) > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {(priceData?.changePercent || 0) > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  <span className="ml-1 font-medium">{Math.abs(priceData?.changePercent || 0).toFixed(2)}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">24h Change: ${formatPrice(priceData?.change)}</p>
            </div>
          </div>
        ) : null}

        {/* 2x2 Stats Grid - Mobile Optimized */}
        {priceData && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500">24h High</p>
              <p className="text-base font-semibold text-green-600">${formatPrice(priceData.high24h)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500">24h Low</p>
              <p className="text-base font-semibold text-red-600">${formatPrice(priceData.low24h)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500">Volume ({symbol})</p>
              <p className="text-base font-semibold">{formatLargeNumber(priceData.volume)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500">Volume (USDT)</p>
              <p className="text-base font-semibold">${formatLargeNumber(priceData.quoteVolume)}</p>
            </div>
          </div>
        )}

        {/* Tabs - Mobile Optimized (Horizontal Scroll) */}
        <div className="overflow-x-auto pb-2 -mx-1 px-1">
          <div className="flex gap-1 min-w-max">
            {['Overview', 'About', 'Why Invest', 'Future', 'Stats'].map((tab) => (
              <button
                key={tab}
                className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Overview Section */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4">
          <h2 className="text-lg font-bold mb-2">About {cryptoInfo.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {cryptoInfo.longDescription.substring(0, 200)}...
          </p>
        </div>

        {/* Key Features - Mobile Grid */}
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-3">Key Features</h3>
          <div className="space-y-2">
            {cryptoInfo.features.slice(0, 4).map((feature, i) => (
              <div key={i} className="flex items-start gap-2 bg-white dark:bg-gray-800 rounded-xl p-3">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-3">Use Cases</h3>
          <div className="space-y-2">
            {cryptoInfo.useCases.slice(0, 4).map((useCase, i) => (
              <div key={i} className="flex items-start gap-2 bg-white dark:bg-gray-800 rounded-xl p-3">
                <ZapIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{useCase}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4">
          <h3 className="text-md font-semibold mb-3">Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Market Cap</span>
              <span className="font-medium">{cryptoInfo.marketCap}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Circulating Supply</span>
              <span className="font-medium">{cryptoInfo.circulatingSupply}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Max Supply</span>
              <span className="font-medium">{cryptoInfo.maxSupply}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">All-Time High</span>
              <span className="font-medium text-green-600">{cryptoInfo.allTimeHigh}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Consensus</span>
              <span className="font-medium">{cryptoInfo.consensus}</span>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        {cryptoInfo.roadmap && cryptoInfo.roadmap.length > 0 && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4">
            <h3 className="text-md font-semibold mb-3">Roadmap</h3>
            <div className="space-y-2">
              {cryptoInfo.roadmap.slice(0, 4).map((item, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <Badge variant="outline" className="text-xs h-fit">{item.year}</Badge>
                  <span>{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Padding */}
        <div className="h-6" />
      </div>
    </div>
  )
}
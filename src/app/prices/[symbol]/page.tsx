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
// src/lib/crypto-database.ts

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

// Complete Crypto Database
const cryptoDatabase: Record<string, CryptoInfo> = {
  // ============================================
  // BITCOIN (BTC)
  // ============================================
  BTC: {
    name: 'Bitcoin',
    fullName: 'Bitcoin (BTC)',
    symbol: 'BTC',
    description: 'Bitcoin is the first decentralized cryptocurrency, operating on a peer-to-peer network without central authority.',
    longDescription: 'Bitcoin is the world\'s first cryptocurrency, created in 2009 by an anonymous person or group known as Satoshi Nakamoto. It operates on a decentralized network using blockchain technology and proof-of-work consensus. Bitcoin introduced the concept of digital scarcity and has become "digital gold" - a store of value that is borderless, censorship-resistant, and deflationary by design.',
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
    allTimeHigh: '$126,750',
    allTimeLow: '$0.01',
    useCases: [
      'Store of value (Digital Gold)',
      'Cross-border payments',
      'Hedge against inflation',
      'Remittances',
      'Settlement layer'
    ],
    features: [
      'Decentralized network',
      'Limited supply (21 million)',
      'Proof of Work consensus',
      'Halving events every 4 years',
      'Most secure blockchain',
      'Global and censorship-resistant'
    ],
    strengths: [
      'First mover advantage',
      'Strongest network effect',
      'Most secure blockchain',
      'Global brand recognition',
      'Institutional adoption growing'
    ],
    weaknesses: [
      'Slow transaction speed (7 TPS)',
      'High energy consumption',
      'Limited smart contract functionality',
      'Scalability challenges'
    ],
    whyInvest: [
      'Digital scarcity similar to gold',
      'Fixed supply protects against inflation',
      'Growing institutional adoption',
      'ETF approval brings new capital',
      'Global store of value'
    ],
    futureOutlook: [
      'Lightning Network scaling solutions',
      'Increased institutional adoption',
      'Potential as global reserve asset',
      'Taproot upgrades for privacy',
      'Ordinals and NFTs on Bitcoin'
    ],
    competitors: ['Ethereum', 'Litecoin', 'Bitcoin Cash', 'Monero'],
    roadmap: [
      { year: '2009', event: 'Bitcoin Network Launch' },
      { year: '2010', event: 'First Real-world Transaction (10,000 BTC for pizza)' },
      { year: '2012', event: 'First Halving' },
      { year: '2017', event: 'SegWit Activation' },
      { year: '2020', event: 'Third Halving' },
      { year: '2021', event: 'Taproot Upgrade' },
      { year: '2024', event: 'Fourth Halving' },
      { year: '2025', event: 'Lightning Network Growth' }
    ]
  },

  // ============================================
  // ETHEREUM (ETH)
  // ============================================
  ETH: {
    name: 'Ethereum',
    fullName: 'Ethereum (ETH)',
    symbol: 'ETH',
    description: 'Ethereum is a decentralized global computer that enables smart contracts and decentralized applications.',
    longDescription: 'Ethereum is a decentralized blockchain with smart contract functionality. It\'s the foundation for DeFi, NFTs, and countless Web3 applications. Ethereum transitioned to Proof of Stake in 2022 (The Merge), reducing energy consumption by 99.9%. It remains the most active blockchain for developers with thousands of dApps.',
    founded: '2015',
    founder: 'Vitalik Buterin (co-founders: Gavin Wood, Joseph Lubin)',
    website: 'https://ethereum.org',
    whitepaper: 'https://ethereum.org/whitepaper',
    github: 'https://github.com/ethereum',
    twitter: 'https://twitter.com/ethereum',
    discord: 'https://discord.gg/ethereum',
    consensus: 'Proof of Stake (PoS)',
    maxSupply: 'No max supply (inflationary)',
    circulatingSupply: '~120,000,000 ETH',
    marketCap: '~$350,000,000,000',
    allTimeHigh: '$4,878',
    allTimeLow: '$0.42',
    useCases: [
      'Smart contracts',
      'Decentralized Finance (DeFi)',
      'NFTs and digital art',
      'Decentralized Autonomous Organizations (DAOs)',
      'Layer 2 scaling solutions',
      'Web3 gaming'
    ],
    features: [
      'Smart contract platform',
      'EVM (Ethereum Virtual Machine)',
      'Proof of Stake consensus',
      'Layer 2 compatibility',
      'Large developer ecosystem',
      'ERC-20 token standard'
    ],
    strengths: [
      'First-mover in smart contracts',
      'Largest developer ecosystem',
      'Most active dApps',
      'Strong DeFi and NFT presence',
      'Continuous upgrades (Shanghai, Cancun)'
    ],
    weaknesses: [
      'High gas fees during congestion',
      'Scalability challenges',
      'Competition from faster L1s',
      'Complex upgrades'
    ],
    whyInvest: [
      'Foundation of DeFi and Web3',
      'Strong network effects',
      'Continuous development and upgrades',
      'Staking yields (4-6% APY)',
      'Institutional interest growing'
    ],
    futureOutlook: [
      'Danksharding for scalability',
      'Further fee reductions',
      'Account abstraction improvements',
      'ZK-rollup adoption',
      'Enterprise adoption of private chains'
    ],
    competitors: ['Solana', 'Cardano', 'Avalanche', 'Polygon', 'BNB Chain', 'Near Protocol'],
    roadmap: [
      { year: '2015', event: 'Ethereum Mainnet Launch' },
      { year: '2016', event: 'DAO Fork & Ethereum Classic Split' },
      { year: '2017', event: 'DeFi Summer & ICO Boom' },
      { year: '2020', event: 'Beacon Chain Launch (Phase 0)' },
      { year: '2021', event: 'EIP-1559 (Fee Burn)' },
      { year: '2022', event: 'The Merge (PoS Transition)' },
      { year: '2023', event: 'Shanghai Upgrade (Staking Withdrawals)' },
      { year: '2024', event: 'Cancun Upgrade (Proto-Danksharding)' },
      { year: '2025', event: 'Verkle Trees & Further Scaling' }
    ]
  },

  // ============================================
  // SOLANA (SOL)
  // ============================================
  SOL: {
    name: 'Solana',
    fullName: 'Solana (SOL)',
    symbol: 'SOL',
    description: 'Solana is a high-performance blockchain supporting builders creating crypto apps that scale today.',
    longDescription: 'Solana is a decentralized blockchain built to enable scalable, user-friendly apps for the world. It achieves high transaction speeds through a unique combination of proof-of-history (PoH) and proof-of-stake (PoS) consensus mechanisms. Solana can process 50,000+ transactions per second with sub-second finality and extremely low fees (<$0.01).',
    founded: '2020',
    founder: 'Anatoly Yakovenko (co-founders: Raj Gokal)',
    website: 'https://solana.com',
    whitepaper: 'https://solana.com/solana-whitepaper.pdf',
    github: 'https://github.com/solana-labs',
    twitter: 'https://twitter.com/solana',
    discord: 'https://discord.gg/solana',
    consensus: 'Proof of History (PoH) + Proof of Stake (PoS)',
    maxSupply: 'No max supply (inflationary)',
    circulatingSupply: '~450,000,000 SOL',
    marketCap: '~$45,000,000,000',
    allTimeHigh: '$295',
    allTimeLow: '$0.50',
    useCases: [
      'DeFi applications',
      'NFT marketplaces (Tensor, Magic Eden)',
      'Web3 gaming',
      'Decentralized exchanges',
      'Payment processing',
      'Mobile dApps (Solana Saga)'
    ],
    features: [
      'Proof of History consensus',
      '50,000+ TPS',
      'Sub-second finality',
      'Low fees (<$0.01)',
      'EVM compatibility (Neon)',
      'Energy efficient'
    ],
    strengths: [
      'Extremely fast transaction speed',
      'Very low fees',
      'Growing ecosystem',
      'Strong developer community',
      'Institutional adoption (Visa, Shopify)',
      'Mobile-first approach'
    ],
    weaknesses: [
      'Network outages in the past',
      'Centralization concerns',
      'Competition from Ethereum L2s',
      'Younger ecosystem than Ethereum'
    ],
    whyInvest: [
      'High scalability solution for mass adoption',
      'Strong venture capital backing (a16z, Multicoin)',
      'Growing DeFi and NFT ecosystem',
      'Real-world partnerships (Visa, Google, Shopify)',
      'Innovative technology stack'
    ],
    futureOutlook: [
      'Firedancer validator client (Jupiter) for decentralization',
      'Solana Mobile Stack for Web3 adoption',
      'Token extensions for enterprise use cases',
      'Potential ETF approval',
      'Expansion in Asian markets'
    ],
    competitors: ['Ethereum', 'BNB Chain', 'Avalanche', 'Polygon', 'Near Protocol', 'Sui'],
    roadmap: [
      { year: '2020', event: 'Mainnet Beta Launch' },
      { year: '2021', event: 'DeFi Summer & Solana Season' },
      { year: '2022', event: 'Solana Mobile Stack Launch' },
      { year: '2023', event: 'Solana Saga Phone Release' },
      { year: '2024', event: 'Token Extensions & Firedancer Alpha' },
      { year: '2025', event: 'Firedancer Full Launch & ZK Compression' }
    ]
  },

  // ============================================
  // BNB (BNB Chain)
  // ============================================
  BNB: {
    name: 'BNB',
    fullName: 'BNB (BNB Chain)',
    symbol: 'BNB',
    description: 'BNB is the native cryptocurrency of the BNB Chain ecosystem, one of the largest blockchain networks.',
    longDescription: 'BNB started as an ERC-20 token on Ethereum and later moved to its own blockchain, BNB Chain (formerly Binance Chain). It powers the entire BNB ecosystem including BSC (BNB Smart Chain), opBNB, and BNB Greenfield. BNB is used for transaction fees, staking, and governance.',
    founded: '2017',
    founder: 'Changpeng Zhao (CZ)',
    website: 'https://bnbchain.org',
    whitepaper: 'https://www.binance.com/resources/whitepaper',
    github: 'https://github.com/bnb-chain',
    twitter: 'https://twitter.com/BNBCHAIN',
    discord: 'https://discord.gg/bnb-chain',
    consensus: 'Proof of Staked Authority (PoSA)',
    maxSupply: '200,000,000 BNB (deflationary via burns)',
    circulatingSupply: '~153,000,000 BNB',
    marketCap: '~$50,000,000,000',
    allTimeHigh: '$1290',
    allTimeLow: '$0.10',
    useCases: [
      'Transaction fees on BSC',
      'Staking and governance',
      'Exchange utility token',
      'Gas fees for opBNB',
      'Storage fees for Greenfield'
    ],
    features: [
      'Fast and cheap transactions',
      'EVM compatible',
      'Regular token burns (deflationary)',
      'Large ecosystem',
      'Cross-chain compatibility'
    ],
    strengths: [
      'Binance exchange backing',
      'Large user base',
      'Fast and low-cost transactions',
      'Strong ecosystem of dApps',
      'Regular token burns increase scarcity'
    ],
    weaknesses: [
      'Centralization concerns',
      'Regulatory scrutiny on Binance',
      'Competition from Ethereum L2s'
    ],
    whyInvest: [
      'Utility across BNB Chain ecosystem',
      'Deflationary tokenomics via burns',
      'Binance exchange integration',
      'Growing L2 ecosystem (opBNB)',
      'Real-world partnerships'
    ],
    futureOutlook: [
      'opBNB Layer 2 scaling',
      'BNB Greenfield data storage',
      'Continued token burns',
      'Increased decentralization',
      'ZK-rollup integration'
    ],
    competitors: ['Ethereum', 'Solana', 'Polygon', 'Avalanche'],
    roadmap: [
      { year: '2017', event: 'BNB Token Launch (ERC-20)' },
      { year: '2019', event: 'Binance Chain Launch' },
      { year: '2021', event: 'BSC Launch & DeFi Boom' },
      { year: '2022', event: 'First Quarterly Burn' },
      { year: '2023', event: 'opBNB & Greenfield Launch' },
      { year: '2024', event: 'BSC Ecosystem Expansion' }
    ]
  },

  // ============================================
  // XRP (Ripple)
  // ============================================
  XRP: {
    name: 'XRP',
    fullName: 'XRP (Ripple)',
    symbol: 'XRP',
    description: 'XRP is a digital payment protocol designed for fast, low-cost international settlements.',
    longDescription: 'XRP is the native cryptocurrency of the XRP Ledger, created by Ripple Labs. It is designed for enterprise use cases, particularly cross-border payments and settlements. XRP transactions settle in 3-5 seconds with extremely low fees (<$0.01).',
    founded: '2012',
    founder: 'Chris Larsen, Jed McCaleb, David Schwartz',
    website: 'https://ripple.com/xrp',
    whitepaper: 'https://ripple.com/files/ripple_consensus_whitepaper.pdf',
    github: 'https://github.com/ripple',
    twitter: 'https://twitter.com/Ripple',
    consensus: 'Federated Consensus (XRP Ledger)',
    maxSupply: '100,000,000,000 XRP',
    circulatingSupply: '~55,000,000,000 XRP',
    marketCap: '~$30,000,000,000',
    allTimeHigh: '$3.84',
    allTimeLow: '$0.002',
    useCases: [
      'Cross-border payments',
      'Bank settlements',
      'Remittances',
      'Liquidity provider',
      'On-demand liquidity (ODL)'
    ],
    features: [
      'Fast settlement (3-5 seconds)',
      'Very low fees',
      'Scalable (1,500+ TPS)',
      'Energy efficient',
      'Enterprise focus'
    ],
    strengths: [
      'Banking and financial institution partnerships',
      'Regulatory clarity (partial court victory)',
      'Fast and cheap transactions',
      'Large remittance corridor use'
    ],
    weaknesses: [
      'Ongoing SEC lawsuit (partially resolved)',
      'Centralization concerns',
      'Limited DeFi ecosystem',
      'Controlled by Ripple Labs'
    ],
    whyInvest: [
      'Real-world banking partnerships',
      'Cross-border payment solution',
      'Regulatory progress',
      'Utility for financial institutions',
      'Large remittance market'
    ],
    futureOutlook: [
      'SEC lawsuit resolution',
      'US banking adoption',
      'CBDC integration',
      'Expansion into new markets',
      'Tokenization of assets'
    ],
    competitors: ['Stellar (XLM)', 'SWIFT', 'Visa', 'Mastercard'],
    roadmap: [
      { year: '2012', event: 'XRP Ledger Launch' },
      { year: '2013', event: 'Ripple Labs Founded' },
      { year: '2017', event: 'XRP Market Cap Surge' },
      { year: '2020', event: 'SEC Lawsuit Filed' },
      { year: '2023', event: 'Partial Court Victory' },
      { year: '2024', event: 'Ongoing Regulatory Progress' }
    ]
  },

  // ============================================
  // CARDANO (ADA)
  // ============================================
  ADA: {
    name: 'Cardano',
    fullName: 'Cardano (ADA)',
    symbol: 'ADA',
    description: 'Cardano is a proof-of-stake blockchain platform focused on sustainability, scalability, and peer-reviewed research.',
    longDescription: 'Cardano is a decentralized blockchain platform built on peer-reviewed academic research. It uses the Ouroboros proof-of-stake consensus mechanism, which is energy-efficient and secure. Cardano focuses on smart contracts, dApps, and real-world use cases in finance, supply chain, and identity.',
    founded: '2017',
    founder: 'Charles Hoskinson (co-founder of Ethereum)',
    website: 'https://cardano.org',
    whitepaper: 'https://cardano.org/whitepaper',
    github: 'https://github.com/input-output-hk/cardano-node',
    twitter: 'https://twitter.com/Cardano',
    discord: 'https://discord.gg/cardano',
    consensus: 'Ouroboros Proof of Stake (PoS)',
    maxSupply: '45,000,000,000 ADA',
    circulatingSupply: '~35,000,000,000 ADA',
    marketCap: '~$15,000,000,000',
    allTimeHigh: '$3.09',
    allTimeLow: '$0.02',
    useCases: [
      'Smart contracts',
      'DeFi applications',
      'Supply chain tracking',
      'Digital identity (Atala PRISM)',
      'Voting systems'
    ],
    features: [
      'Peer-reviewed development',
      'Energy-efficient PoS',
      'Layered architecture',
      'Formal verification',
      'Treasury system'
    ],
    strengths: [
      'Scientific, research-driven approach',
      'Strong founder and team',
      'Energy efficient',
      'Growing ecosystem',
      'Real-world partnerships in Africa'
    ],
    weaknesses: [
      'Slow development pace',
      'Smaller dApp ecosystem than Ethereum',
      'Smart contracts came later than competitors'
    ],
    whyInvest: [
      'Research-driven, secure approach',
      'Sustainable and green blockchain',
      'Real-world adoption in developing nations',
      'Strong community support',
      'Staking yields (3-5% APY)'
    ],
    futureOutlook: [
      'Hydra scaling solution',
      'Midnight privacy-focused sidechain',
      'Increased DeFi adoption',
      'More enterprise partnerships',
      'Cross-chain interoperability'
    ],
    competitors: ['Ethereum', 'Solana', 'Avalanche', 'Polkadot'],
    roadmap: [
      { year: '2017', event: 'Cardano Mainnet Launch' },
      { year: '2020', event: 'Shelley Upgrade (Decentralization)' },
      { year: '2021', event: 'Alonzo Upgrade (Smart Contracts)' },
      { year: '2022', event: 'Vasil Upgrade (Scalability)' },
      { year: '2023', event: 'SECADA' },
      { year: '2024', event: 'Hydra Rollout' }
    ]
  },

  // ============================================
  // GOLD (XAU)
  // ============================================
  GOLD: {
    name: 'Gold',
    fullName: 'Gold (XAU)',
    symbol: 'GOLD',
    description: 'Gold is a precious metal and historically the most important store of value for civilizations.',
    longDescription: 'Gold has been used as money and a store of value for thousands of years. It is a physical commodity, not a cryptocurrency. In the digital age, gold-backed tokens (PAXG, XAUT) bring gold to the blockchain, offering the stability of gold with the convenience of crypto.',
    founded: 'Ancient times (c. 3000 BC)',
    founder: 'Unknown (discovered by ancient civilizations)',
    website: 'https://www.gold.org',
    consensus: 'Physical commodity',
    maxSupply: '~244,000 metric tons mined (estimated)',
    circulatingSupply: '~201,000 metric tons',
    marketCap: '~$12,000,000,000,000',
    allTimeHigh: '$5600',
    allTimeLow: '$35 (1971)',
    useCases: [
      'Store of value',
      'Hedge against inflation',
      'Jewelry and decoration',
      'Industrial applications (electronics, dentistry)',
      'Central bank reserves',
      'Investment portfolio diversification'
    ],
    features: [
      'Physical tangible asset',
      'Historically preserved value',
      'Global liquidity',
      'No counterparty risk',
      'Inflation hedge'
    ],
    strengths: [
      'Thousands of years as money',
      'Global recognition',
      'Central bank holdings',
      'Limited supply growth',
      'Safe-haven asset during crises'
    ],
    weaknesses: [
      'Storage and security costs',
      'No yield or dividends',
      'Transportation difficulty',
      'Price manipulation concerns',
      'No utility beyond value storage'
    ],
    whyInvest: [
      'Ultimate store of value',
      'Portfolio diversification',
      'Hedge against inflation and currency debasement',
      'Safe-haven during economic uncertainty',
      'Digital gold tokens offer crypto convenience'
    ],
    futureOutlook: [
      'Central bank buying continues',
      'Digital gold token adoption',
      'Increased retail investment via ETFs',
      'Potential as global reserve asset alongside USD',
      'Gold-backed cryptocurrencies growth'
    ],
    competitors: ['Bitcoin (digital gold)', 'Silver', 'Treasury bonds', 'Real estate'],
    roadmap: [
      { year: '3000 BC', event: 'First Gold Use in Egypt' },
      { year: '560 BC', event: 'First Gold Coins (Lydia)' },
      { year: '1717', event: 'Gold Standard Begins (UK)' },
      { year: '1971', event: 'US Leaves Gold Standard (Nixon Shock)' },
      { year: '2004', event: 'First Gold ETF (GLD)' },
      { year: '2019', event: 'Gold-Backed Tokens (PAXG, XAUT)' },
      { year: '2024', event: 'Record High Prices' }
    ]
  },

  // ============================================
  // SILVER (XAG)
  // ============================================
  SILVER: {
    name: 'Silver',
    fullName: 'Silver (XAG)',
    symbol: 'SILVER',
    description: 'Silver is a precious metal with both investment value and extensive industrial applications.',
    longDescription: 'Silver has been used as money and a store of value for millennia. Unlike gold, silver has significant industrial uses including electronics, solar panels, and medical applications. This dual demand (investment + industrial) creates unique market dynamics. Silver-backed tokens bring this metal to the blockchain.',
    founded: 'Ancient times (c. 3000 BC)',
    founder: 'Unknown',
    website: 'https://www.silverinstitute.org',
    consensus: 'Physical commodity',
    maxSupply: '~1.7 million metric tons estimated',
    circulatingSupply: '~1.5 million metric tons',
    marketCap: '~$1,300,000,000,000',
    allTimeHigh: '$121.45 (1980, inflation-adjusted ~$180)',
    allTimeLow: '$3.50 (2001)',
    useCases: [
      'Store of value',
      'Industrial manufacturing',
      'Solar panels (photovoltaic)',
      'Electronics and circuitry',
      'Medical applications',
      'Jewelry and silverware',
      'Photography'
    ],
    features: [
      'Industrial + precious metal',
      'More affordable than gold',
      'Good conductor of electricity',
      'Antibacterial properties',
      'Highly malleable'
    ],
    strengths: [
      'Industrial demand growth (solar, EVs)',
      'More affordable entry point than gold',
      'Historically recognized as money',
      'Limited new mine supply',
      'Dual demand drivers'
    ],
    weaknesses: [
      'Industrial demand tied to economy',
      'Price volatility higher than gold',
      'Storage costs',
      'Larger supply than gold'
    ],
    whyInvest: [
      'Green energy transition (solar demand)',
      'Electric vehicle manufacturing',
      'Historical monetary metal',
      'More leveraged than gold to industrial growth',
      'Affordable precious metal entry'
    ],
    futureOutlook: [
      'Solar panel demand growth',
      'EV manufacturing needs',
      '5G and electronics demand',
      'Space exploration uses',
      'Silver tokenization growth'
    ],
    competitors: ['Gold', 'Platinum', 'Palladium', 'Copper'],
    roadmap: [
      { year: '3000 BC', event: 'First Silver Use (Anatolia)' },
      { year: '600 BC', event: 'First Silver Coins (Greek)' },
      { year: '1870s', event: 'Silver Standard in Many Nations' },
      { year: '1980', event: 'Hunt Brothers Attempted Corner' },
      { year: '2020', event: 'Post-COVID Industrial Recovery' },
      { year: '2025', event: 'Solar & EV Demand Surge' }
    ]
  },

  // ============================================
  // DEFAULT / FALLBACK
  // ============================================
  DEFAULT: {
    name: 'Cryptocurrency',
    fullName: 'Digital Asset',
    description: 'A digital asset in the cryptocurrency market.',
    longDescription: 'This cryptocurrency is traded on various exchanges. More information will be updated as it becomes available. The crypto market continues to evolve with new projects and innovations.',
    founded: 'N/A',
    founder: 'Various',
    website: '#',
    consensus: 'Various',
    maxSupply: 'Unknown',
    circulatingSupply: 'Unknown',
    marketCap: 'Unknown',
    allTimeHigh: 'Unknown',
    allTimeLow: 'Unknown',
    useCases: ['Trading', 'Investment', 'Digital payments'],
    features: ['Blockchain-based', 'Digital asset', 'Decentralized']
  }
}

// Helper function to get crypto info with fallback
function getCryptoInfo(symbol: string): CryptoInfo {
  const upperSymbol = symbol.toUpperCase()
  return cryptoDatabase[upperSymbol] || { ...cryptoDatabase.DEFAULT, name: symbol, fullName: `${symbol} (${symbol})` }
}

// Get all available symbols
function getAllCryptoSymbols(): string[] {
  return Object.keys(cryptoDatabase).filter(key => key !== 'DEFAULT')
}

// Get all crypto info
function getAllCryptoInfo(): Record<string, CryptoInfo> {
  return cryptoDatabase
}

// Search crypto by name or symbol
function searchCrypto(query: string): CryptoInfo[] {
  const lowerQuery = query.toLowerCase()
  return Object.values(cryptoDatabase)
    .filter(crypto => 
      crypto.name?.toLowerCase().includes(lowerQuery) ||
      crypto.fullName?.toLowerCase().includes(lowerQuery) ||
      crypto.symbol?.toLowerCase().includes(lowerQuery)
    )
    .filter(crypto => crypto.name !== 'Cryptocurrency') // Filter out default
}
// Live price fetching function
async function getLivePrice(symbol: string): Promise<number> {
  try {
    
    // Handle Silver - Use Binance Futures API (working)

 if (symbol === 'GOLD' || symbol === 'XAU') {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=XAUUSDT')
      return parseFloat(response.data.lastPrice)
    }
    

    if (symbol === 'SILVER' || symbol === 'XAG') {
      const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=XAGUSDT')
      return parseFloat(response.data.lastPrice)
    }
    
    // Default: Crypto spot from Binance
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`)
    return parseFloat(response.data.price)
    
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error)
    
    // Return fallback prices
    if (symbol === 'GOLD' || symbol === 'XAU') {
      return 2334.50
    }
    if (symbol === 'SILVER' || symbol === 'XAG') {
      return 27.50
    }
    
    throw new Error(`Could not fetch price for ${symbol}`)
  }
}

async function get24hrStats(symbol: string) {
  try {
    // Handle Silver - Use Binance Futures API
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
    
    // Handle Gold - No futures data, return estimated values
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
    
    // Default: Crypto spot from Binance
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
    console.error(`Error fetching 24hr stats for ${symbol}:`, error)
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

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch initial data
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

    // Set up polling every 5 seconds
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" size="sm" asChild>
            <Link href="/prices">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Prices
            </Link>
          </Button>
        </motion.div>

        {/* Header with Symbol Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {symbol}
            </div>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                {cryptoInfo.name}
                <span className="text-2xl text-gray-400">({symbol})</span>
              </h1>
              <div className="flex items-center gap-2 mt-1 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Founded: {cryptoInfo.founded}</span>
                <span className="mx-2">•</span>
                <Users className="h-4 w-4" />
                <span className="text-sm">Founder: {cryptoInfo.founder}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-2">
            {cryptoInfo.website && cryptoInfo.website !== '#' && (
              <Button variant="outline" size="icon" asChild>
                <a href={cryptoInfo.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            )}
            {cryptoInfo.github && (
              <Button variant="outline" size="icon" asChild>
                <a href={cryptoInfo.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {cryptoInfo.twitter && (
              <Button variant="outline" size="icon" asChild>
                <a href={cryptoInfo.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            )}
            {cryptoInfo.discord && (
              <Button variant="outline" size="icon" asChild>
                <a href={cryptoInfo.discord} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Live Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-2 border-primary/20">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardContent className="p-6">
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
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left side - Current Price */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {time.toLocaleTimeString()}
                      </Badge>
                      <Badge className="bg-green-500 flex items-center gap-1">
                        <Zap className="h-3 w-3 animate-pulse" />
                        LIVE
                      </Badge>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={priceData.price}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <p className="text-sm text-gray-500">Current Price (USDT)</p>
                        <div className="flex items-center gap-4">
                          <span className="text-6xl font-bold">
                            ${formatPrice(priceData.price)}
                          </span>
                          <div className={`flex items-center px-3 py-1 rounded-full ${
                            priceData.changePercent > 0 
                              ? 'bg-green-100 text-green-700' 
                              : priceData.changePercent < 0
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {priceData.changePercent > 0 ? <ArrowUp className="h-5 w-5" /> : 
                             priceData.changePercent < 0 ? <ArrowDown className="h-5 w-5" /> : 
                             <Minus className="h-5 w-5" />}
                            <span className="text-xl font-bold ml-1">
                              {Math.abs(priceData.changePercent).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          24h Change: ${priceData.change.toFixed(2)}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right side - 24h Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">24h High</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${formatPrice(priceData.high24h)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">24h Low</p>
                      <p className="text-lg font-semibold text-red-600">
                        ${formatPrice(priceData.low24h)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Volume (24h)</p>
                      <p className="text-lg font-semibold">
                        {formatLargeNumber(priceData.volume)} {symbol}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Volume (USDT)</p>
                      <p className="text-lg font-semibold">
                        ${formatLargeNumber(priceData.quoteVolume)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Detailed Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="what-is">What is {symbol}?</TabsTrigger>
              <TabsTrigger value="why-invest">Why Invest?</TabsTrigger>
              <TabsTrigger value="future">Future Outlook</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {cryptoInfo.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {cryptoInfo.longDescription}
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {cryptoInfo.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-primary" />
                      Use Cases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {cryptoInfo.useCases.map((useCase, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ZapIcon className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* What is SOL Tab */}
            <TabsContent value="what-is">
              <Card>
                <CardHeader>
                  <CardTitle>What is {symbol}?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg">{cryptoInfo.description}</p>
                    
                    <h3 className="text-xl font-bold mt-6">How Does It Work?</h3>
                    <p>{cryptoInfo.longDescription}</p>
                    
                    <h3 className="text-xl font-bold mt-6">Technology</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Consensus</span>
                        </div>
                        <p>{cryptoInfo.consensus}</p>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="h-5 w-5 text-primary" />
                          <span className="font-semibold">Network</span>
                        </div>
                        <p>Decentralized blockchain</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Why Invest Tab */}
            <TabsContent value="why-invest">
              <Card>
                <CardHeader>
                  <CardTitle>Why Invest in {symbol}?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cryptoInfo.strengths && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {cryptoInfo.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded">
                            <Shield className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cryptoInfo.weaknesses && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        Considerations
                      </h3>
                      <ul className="space-y-2">
                        {cryptoInfo.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded">
                            <Info className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {cryptoInfo.whyInvest && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        Investment Thesis
                      </h3>
                      <ul className="space-y-2">
                        {cryptoInfo.whyInvest.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded">
                            <Star className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Future Outlook Tab */}
            <TabsContent value="future">
              <Card>
                <CardHeader>
                  <CardTitle>The Future of {symbol}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cryptoInfo.roadmap && cryptoInfo.roadmap.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Roadmap & Milestones</h3>
                      <div className="space-y-4">
                        {cryptoInfo.roadmap.map((item, i) => (
                          <div key={i} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <Badge variant="outline" className="h-fit">{item.year}</Badge>
                            <p>{item.event}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {cryptoInfo.futureOutlook && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Future Outlook</h3>
                      <ul className="space-y-2">
                        {cryptoInfo.futureOutlook.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded">
                            <Rocket className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>{symbol} Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">Market Cap</span>
                        <span className="font-semibold">{cryptoInfo.marketCap}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">Circulating Supply</span>
                        <span className="font-semibold">{cryptoInfo.circulatingSupply}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">Max Supply</span>
                        <span className="font-semibold">{cryptoInfo.maxSupply}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">All-Time High</span>
                        <span className="font-semibold text-green-600">{cryptoInfo.allTimeHigh}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">All-Time Low</span>
                        <span className="font-semibold text-red-600">{cryptoInfo.allTimeLow}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
                        <span className="text-gray-500">Consensus</span>
                        <span className="font-semibold">{cryptoInfo.consensus}</span>
                      </div>
                    </div>
                  </div>

                  {cryptoInfo.competitors && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Competitors</h3>
                      <div className="flex flex-wrap gap-2">
                        {cryptoInfo.competitors.map((comp, i) => (
                          <Badge key={i} variant="secondary">{comp}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
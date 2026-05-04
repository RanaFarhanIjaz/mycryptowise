'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Wallet,
  ArrowRightLeft,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PortfolioHolding, PortfolioSummary, AssetAllocation, PortfolioPerformance } from '@/types'
import { usePortfolio } from '@/hooks/usePortfolio'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { addTransaction } from '@/lib/db/transactions'
import { processDeposit, processWithdrawal, updateBalance } from '@/lib/db/account'
import { getLivePrice } from '@/lib/api/live-prices'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/Dialog'
import { FormInput } from '@/components/auth/FormInput'
import { toast } from 'react-hot-toast'

export default function PortfolioPage() {
  const { user } = useAuth()
  const { holdings, summary: portfolioSummary, accountStats, transactions, loading, refresh } = usePortfolio()
  const [showValues, setShowValues] = useState(true)
  
  // Local state for the action form
  const [actionAmount, setActionAmount] = useState('')
  const [actionAsset, setActionAsset] = useState('BTC')
  const [isProcessing, setIsProcessing] = useState(false)

  // Dialog states
  const [activeDialog, setActiveDialog] = useState<'buy' | 'sell' | 'deposit' | 'withdraw' | null>(null)

  // Calculate asset allocation from real holdings
  const assetAllocation: AssetAllocation[] = useMemo(() => {
    const colors = ['#f7931a', '#627eea', '#9945ff', '#375bd2', '#0033ad', '#6b7280']
    return holdings.map((h, i) => ({
      asset: h.asset,
      symbol: h.symbol,
      value: h.marketValue,
      percentage: h.allocation,
      color: colors[i % colors.length]
    }))
  }, [holdings])

  // Mock performance data (last 30 days) - would need historical pricing for real data
  const performanceData: PortfolioPerformance[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const baseValue = portfolioSummary.totalValue * 0.9
    const change = (Math.random() - 0.5) * (portfolioSummary.totalValue * 0.05)
    const value = baseValue + (i * (portfolioSummary.totalValue * 0.005)) + change

    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
      change: Math.round(change),
      changePercentage: Math.round((change / value) * 10000) / 100
    }
  })

  const handleRefresh = async () => {
    await refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center"
        >
          <div className="w-1 h-12 bg-gradient-to-b from-primary to-transparent mb-6 animate-pulse" />
          <p className="text-white text-lg font-light tracking-[0.2em] uppercase">
            Securing your financial data...
          </p>
        </motion.div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Portfolio Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your crypto investments and performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowValues(!showValues)}
                className="flex items-center gap-2"
              >
                {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showValues ? 'Hide Values' : 'Show Values'}
              </Button>
              <div className="h-8 w-[1px] bg-gray-300 dark:bg-gray-700 mx-1" />
              <Button
                onClick={() => setActiveDialog('deposit')}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Deposit
              </Button>
              <Button
                onClick={() => setActiveDialog('withdraw')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Minus className="w-4 h-4" />
                Withdraw
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Exness-style Financial Analytics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { label: 'Balance', value: accountStats.balance, icon: Wallet, color: 'text-blue-500' },
            { label: 'Equity', value: accountStats.equity, icon: Target, color: 'text-purple-500' },
            { label: 'Margin', value: accountStats.margin, icon: ShieldCheck, color: 'text-orange-500' },
            { label: 'Free Margin', value: accountStats.freeMargin, icon: Zap, color: 'text-yellow-500' },
            { label: 'Margin Level', value: `${accountStats.marginLevel}%`, icon: TrendingUp, color: 'text-green-500' },
            { label: 'Profit/Loss', value: accountStats.equity - accountStats.balance, icon: ArrowRightLeft, color: 'text-emerald-500' },
          ].map((stat, i) => (
            <Card key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-none shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </span>
                </div>
                <div className="text-sm font-bold truncate">
                  {typeof stat.value === 'string' ? stat.value : (showValues ? formatCurrency(stat.value) : '••••••')}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Portfolio Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showValues ? formatCurrency(portfolioSummary.totalValue) : '••••••'}
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: {portfolioSummary.lastUpdated.toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              {portfolioSummary.totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                portfolioSummary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {showValues ? formatCurrency(portfolioSummary.totalPnL) : '••••••'}
              </div>
              <p className={`text-xs ${
                portfolioSummary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {showValues ? formatPercentage(portfolioSummary.totalPnLPercentage) : '•••%'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Day Change</CardTitle>
              {portfolioSummary.dayChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                portfolioSummary.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {showValues ? formatCurrency(portfolioSummary.dayChange) : '••••••'}
              </div>
              <p className={`text-xs ${
                portfolioSummary.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {showValues ? formatPercentage(portfolioSummary.dayChangePercentage) : '•••%'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Performer</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {portfolioSummary.bestPerformer.asset}
              </div>
              <p className="text-xs text-green-600">
                {formatPercentage(portfolioSummary.bestPerformer.pnlPercentage)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trade Execution & Asset Allocation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Trade Card */}
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Quick Trade
                </CardTitle>
                <CardDescription className="text-slate-400">Execute instant demo orders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => setActiveDialog('buy')}
                    className="bg-green-500 hover:bg-green-600 h-16 flex flex-col items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    <span className="font-bold">BUY</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveDialog('sell')}
                    className="bg-red-500 hover:bg-red-600 h-16 flex flex-col items-center justify-center gap-1"
                  >
                    <ArrowDownRight className="w-5 h-5" />
                    <span className="font-bold">SELL</span>
                  </Button>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                  <div className="flex justify-between mb-1">
                    <span>Leverage</span>
                    <span className="text-white font-bold">1:500 (Demo)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Execution</span>
                    <span className="text-white font-bold">Instant</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Asset Allocation
                </CardTitle>
                <CardDescription>
                  Distribution of your portfolio by asset
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetAllocation.map((asset) => (
                    <div key={asset.symbol} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <div>
                          <p className="font-medium text-sm">{asset.asset}</p>
                          <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {showValues ? formatCurrency(asset.value) : '••••••'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {asset.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Simple pie chart representation */}
                <div className="mt-6 flex justify-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {assetAllocation.map((asset, index) => {
                        const startAngle = assetAllocation
                          .slice(0, index)
                          .reduce((sum, a) => sum + a.percentage, 0) * 3.6
                        const endAngle = startAngle + asset.percentage * 3.6

                        const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
                        const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
                        const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
                        const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

                        const largeArcFlag = asset.percentage > 50 ? 1 : 0

                        return (
                          <path
                            key={asset.symbol}
                            d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={asset.color}
                          />
                        )
                      })}
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Holdings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Holdings
                </CardTitle>
                <CardDescription>
                  Your current crypto positions and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Asset</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Quantity</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Avg Cost</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Current Price</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Market Value</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">P&L</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Allocation</th>
                      </tr>
                    </thead>
                    <tbody>
                    {holdings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-muted-foreground">
                          No holdings found. Add a transaction to see your portfolio.
                        </td>
                      </tr>
                    ) : holdings.map((holding) => (
                      <tr key={holding.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{holding.asset}</p>
                            <p className="text-sm text-muted-foreground">{holding.symbol}</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          {holding.quantity.toFixed(4)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {showValues ? formatCurrency(holding.averageCost) : '••••••'}
                        </td>
                        <td className="text-right py-3 px-4">
                          {showValues ? formatCurrency(holding.currentPrice) : '••••••'}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {showValues ? formatCurrency(holding.marketValue) : '••••••'}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div>
                            <p className={`font-medium ${
                              holding.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {showValues ? formatCurrency(holding.unrealizedPnL) : '••••••'}
                            </p>
                            <p className={`text-sm ${
                              holding.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {showValues ? formatPercentage(holding.unrealizedPnLPercentage) : '•••%'}
                            </p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          <Badge variant="secondary">
                            {holding.allocation.toFixed(1)}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Portfolio Performance (30 Days)
              </CardTitle>
              <CardDescription>
                Track your portfolio value over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      hide={true}
                    />
                    <YAxis 
                      hide={true}
                      domain={['dataMin - 1000', 'dataMax + 1000']}
                    />
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800">
                              <p className="text-xs text-slate-500 mb-1">{payload[0].payload.date}</p>
                              <p className="text-lg font-bold text-blue-600">
                                {formatCurrency(payload[0].value as number)}
                              </p>
                              <p className={`text-xs ${payload[0].payload.changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatPercentage(payload[0].payload.changePercentage)}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={1500}
                    />
                    <ReferenceLine y={performanceData[0].value} stroke="#94a3b8" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Simple performance summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {showValues ? formatCurrency(performanceData[performanceData.length - 1].value - performanceData[0].value) : '••••••'}
                  </p>
                  <p className="text-sm text-muted-foreground">30-Day Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {showValues ? `${((performanceData[performanceData.length - 1].value / performanceData[0].value - 1) * 100).toFixed(2)}%` : '•••%'}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Return</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {showValues ? formatCurrency(Math.max(...performanceData.map(d => d.value))) : '••••••'}
                  </p>
                  <p className="text-sm text-muted-foreground">Peak Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {showValues ? formatCurrency(Math.min(...performanceData.map(d => d.value))) : '••••••'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest trades, deposits, and withdrawals
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-primary"
                onClick={() => window.location.href = '/transactions'}
              >
                View All
              </Button>

            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-center py-8 text-slate-500 text-sm">No recent activity</p>
                ) : transactions.slice(0, 5).map((item, i) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        item.type === 'BUY' ? 'bg-green-100 text-green-600' : 
                        item.type === 'SELL' ? 'bg-red-100 text-red-600' : 
                        item.type === 'DEPOSIT' ? 'bg-cyan-100 text-cyan-600' :
                        item.type === 'WITHDRAW' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {item.type === 'BUY' && <ArrowUpRight className="w-4 h-4" />}
                        {item.type === 'SELL' && <ArrowDownRight className="w-4 h-4" />}
                        {item.type === 'DEPOSIT' && <Plus className="w-4 h-4" />}
                        {item.type === 'WITHDRAW' && <Minus className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.type} {item.asset}</p>
                        <p className="text-xs text-slate-500">
                          {item.date instanceof Date ? item.date.toLocaleDateString() : item.date} {item.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">
                        {item.type === 'BUY' || item.type === 'SELL' ? `${item.quantity} ${item.asset}` : formatCurrency(item.quantity)}
                      </p>
                      <p className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Financial Action Dialogs */}
      <Dialog open={!!activeDialog} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 capitalize">
              {activeDialog === 'buy' && <TrendingUp className="text-green-500" />}
              {activeDialog === 'sell' && <TrendingDown className="text-red-500" />}
              {activeDialog === 'deposit' && <Plus className="text-blue-500" />}
              {activeDialog === 'withdraw' && <Minus className="text-orange-500" />}
              {activeDialog} Funds
            </DialogTitle>
            <DialogDescription>
              {activeDialog === 'buy' || activeDialog === 'sell' 
                ? "Execute a demo trade at market price."
                : "Manage your account balance."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {(activeDialog === 'buy' || activeDialog === 'sell') && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Asset Symbol (Top 5 Spot Only)
                </label>
                <select
                  value={actionAsset}
                  onChange={(e) => setActionAsset(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                >
                  <option value="BTC">BTC - Bitcoin</option>
                  <option value="ETH">ETH - Ethereum</option>
                  <option value="SOL">SOL - Solana</option>
                  <option value="BNB">BNB - Binance Coin</option>
                  <option value="XRP">XRP - Ripple</option>
                </select>
              </div>
            )}
            <FormInput 
              label={activeDialog === 'buy' || activeDialog === 'sell' ? "Quantity" : "Amount (USD)"} 
              type="number" 
              value={actionAmount}
              onChange={(e) => setActionAmount(e.target.value)}
              placeholder="0.00" 
            />
          </div>

          <DialogFooter>
            <Button 
              className={`w-full ${
                activeDialog === 'buy' ? 'bg-green-600' : 
                activeDialog === 'sell' ? 'bg-red-600' : 
                'bg-blue-600'
              }`}
              disabled={isProcessing}
              onClick={async () => {
                if (!user) {
                  toast.error("Please sign in to manage your demo account");
                  return;
                }
                if (!activeDialog || !actionAmount) {
                  toast.error("Please enter an amount");
                  return;
                }
                
                setIsProcessing(true);
                const loadingToast = toast.loading(`Processing ${activeDialog}...`);
                
                try {
                  const amount = parseFloat(actionAmount);
                  if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
                  
                  const symbol = actionAsset.toUpperCase();
                  console.log(`[Trade] Executing ${activeDialog} for ${amount} ${symbol}`);

                  if (activeDialog === 'deposit') {
                    await processDeposit(user.uid, amount);
                    await addTransaction({
                      userId: user.uid,
                      asset: 'USD',
                      type: 'DEPOSIT',
                      quantity: amount,
                      price: 1,
                      totalValue: amount,
                      date: new Date(),
                      time: new Date().toLocaleTimeString(),
                      status: 'completed'
                    });
                  } else if (activeDialog === 'withdraw') {
                    await processWithdrawal(user.uid, amount);
                    await addTransaction({
                      userId: user.uid,
                      asset: 'USD',
                      type: 'WITHDRAW',
                      quantity: amount,
                      price: 1,
                      totalValue: amount,
                      date: new Date(),
                      time: new Date().toLocaleTimeString(),
                      status: 'completed'
                    });
                  } else {
                    // Buy/Sell
                    console.log(`[Trade] Fetching live price for ${symbol}...`);
                    let price: number;
                    try {
                      price = await getLivePrice(symbol);
                    } catch (priceErr) {
                      console.error("Price fetch failed:", priceErr);
                      throw new Error(`Could not fetch live price for ${symbol}. Check if it's a valid Binance symbol.`);
                    }
                    
                    const totalValue = amount * price;
                    console.log(`[Trade] Price: ${price}, Total Value: ${totalValue}`);
                    
                    if (activeDialog === 'buy') {
                      await updateBalance(user.uid, -totalValue);
                    } else {
                      await updateBalance(user.uid, totalValue);
                    }

                    await addTransaction({
                      userId: user.uid,
                      asset: symbol,
                      type: activeDialog === 'buy' ? 'BUY' : 'SELL',
                      quantity: amount,
                      price: price,
                      totalValue: totalValue,
                      date: new Date(),
                      time: new Date().toLocaleTimeString(),
                      status: 'completed'
                    });
                  }

                  toast.success(`${activeDialog.toUpperCase()} processed successfully!`, { id: loadingToast });
                  await refresh();
                  setActiveDialog(null);
                  setActionAmount('');
                } catch (err: any) {
                  console.error(`[Trade Error] ${activeDialog}:`, err);
                  toast.error(err.message || `Failed to process ${activeDialog}`, { id: loadingToast });
                } finally {
                  setIsProcessing(false);
                }
              }}
            >
              {isProcessing ? 'Processing...' : `Confirm ${activeDialog}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
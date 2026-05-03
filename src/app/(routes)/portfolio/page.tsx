'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PortfolioHolding, PortfolioSummary, AssetAllocation, PortfolioPerformance } from '@/types'

export default function PortfolioPage() {
  const [showValues, setShowValues] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock portfolio summary data
  const portfolioSummary: PortfolioSummary = {
    userId: 'user-1',
    totalValue: 125750.45,
    totalCost: 112500.00,
    totalPnL: 13250.45,
    totalPnLPercentage: 11.78,
    dayChange: 1250.30,
    dayChangePercentage: 1.00,
    bestPerformer: {
      asset: 'Ethereum',
      pnlPercentage: 24.5
    },
    worstPerformer: {
      asset: 'Cardano',
      pnlPercentage: -5.2
    },
    lastUpdated: new Date()
  }

  // Mock holdings data
  const holdings: PortfolioHolding[] = [
    {
      id: '1',
      userId: 'user-1',
      asset: 'Bitcoin',
      symbol: 'BTC',
      quantity: 1.25,
      averageCost: 42000,
      currentPrice: 48500,
      marketValue: 60625,
      unrealizedPnL: 5562.50,
      unrealizedPnLPercentage: 11.25,
      allocation: 48.2,
      lastUpdated: new Date()
    },
    {
      id: '2',
      userId: 'user-1',
      asset: 'Ethereum',
      symbol: 'ETH',
      quantity: 8.5,
      averageCost: 2800,
      currentPrice: 3480,
      marketValue: 29600,
      unrealizedPnL: 5780,
      unrealizedPnLPercentage: 24.25,
      allocation: 23.5,
      lastUpdated: new Date()
    },
    {
      id: '3',
      userId: 'user-1',
      asset: 'Solana',
      symbol: 'SOL',
      quantity: 45,
      averageCost: 85,
      currentPrice: 98,
      marketValue: 4410,
      unrealizedPnL: 585,
      unrealizedPnLPercentage: 15.29,
      allocation: 3.5,
      lastUpdated: new Date()
    },
    {
      id: '4',
      userId: 'user-1',
      asset: 'Cardano',
      symbol: 'ADA',
      quantity: 2500,
      averageCost: 0.45,
      currentPrice: 0.38,
      marketValue: 950,
      unrealizedPnL: -175,
      unrealizedPnLPercentage: -15.56,
      allocation: 0.8,
      lastUpdated: new Date()
    },
    {
      id: '5',
      userId: 'user-1',
      asset: 'Chainlink',
      symbol: 'LINK',
      quantity: 120,
      averageCost: 12.50,
      currentPrice: 14.20,
      marketValue: 1704,
      unrealizedPnL: 204,
      unrealizedPnLPercentage: 13.60,
      allocation: 1.4,
      lastUpdated: new Date()
    }
  ]

  // Mock asset allocation data
  const assetAllocation: AssetAllocation[] = [
    { asset: 'Bitcoin', symbol: 'BTC', value: 60625, percentage: 48.2, color: '#f7931a' },
    { asset: 'Ethereum', symbol: 'ETH', value: 29600, percentage: 23.5, color: '#627eea' },
    { asset: 'Solana', symbol: 'SOL', value: 4410, percentage: 3.5, color: '#9945ff' },
    { asset: 'Chainlink', symbol: 'LINK', value: 1704, percentage: 1.4, color: '#375bd2' },
    { asset: 'Cardano', symbol: 'ADA', value: 950, percentage: 0.8, color: '#0033ad' },
    { asset: 'Others', symbol: 'OTH', value: 23461.45, percentage: 18.6, color: '#6b7280' }
  ]

  // Mock performance data (last 30 days)
  const performanceData: PortfolioPerformance[] = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const baseValue = 115000
    const change = (Math.random() - 0.5) * 2000
    const value = baseValue + (i * 350) + change

    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
      change: Math.round(change),
      changePercentage: Math.round((change / value) * 10000) / 100
    }
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
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
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
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
          {/* Asset Allocation Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
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
                      {holdings.map((holding) => (
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
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Performance chart would be implemented here
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Using a charting library like Recharts or Chart.js
                  </p>
                </div>
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
                  <p className="text-sm text-muted-foreground">Lowest Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
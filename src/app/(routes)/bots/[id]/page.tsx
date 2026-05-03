'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Bot,
  ArrowLeft,
  Play,
  Pause,
  Settings,
  Zap,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Save,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Calendar,
  DollarSign,
  Percent,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FormInput, FormCheckbox } from '@/components/auth/FormInput'
import { Bot as BotType, BotDeploymentConfig, BotPerformance } from '@/types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface BotDetailPageProps {
  botId?: string
}

const mockBot: BotType = {
  id: 'bot-1',
  userId: 'user-1',
  name: 'Scalper Pro',
  description: 'High-frequency scalping bot for BTC/USDT trading',
  strategy: 'Grid Trading + MACD',
  status: 'active',
  profitLoss: 2500,
  profitLossPercentage: 12.5,
  trades: 245,
  winRate: 68,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-04-28'),
  settings: {
    maxTradeSize: 0.5,
    stopLoss: 2,
    takeProfit: 5,
    tradingPair: 'BTC/USDT',
    timeframe: '1h',
    riskPercentage: 1,
  },
}

const mockPerformance: BotPerformance = {
  botId: 'bot-1',
  totalTrades: 245,
  winningTrades: 167,
  losingTrades: 78,
  profitLoss: 2500,
  profitLossPercentage: 12.5,
  averageTradeSize: 500,
  sharpeRatio: 1.85,
  maxDrawdown: 8.5,
  updateDate: new Date(),
}

const performanceData = [
  { date: 'Day 1', profit: 100, trades: 12 },
  { date: 'Day 2', profit: 250, trades: 18 },
  { date: 'Day 3', profit: 150, trades: 14 },
  { date: 'Day 4', profit: 400, trades: 22 },
  { date: 'Day 5', profit: 350, trades: 20 },
  { date: 'Day 6', profit: 500, trades: 25 },
  { date: 'Day 7', profit: 275, trades: 19 },
]

export default function BotDetailPage({ botId = 'bot-1' }: BotDetailPageProps) {
  const router = useRouter()
  const [bot, setBot] = useState<BotType>(mockBot)
  const [performance] = useState<BotPerformance>(mockPerformance)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [deploymentConfig, setDeploymentConfig] = useState<Partial<BotDeploymentConfig>>({
    apiKey: '',
    apiSecret: '',
    exchangeId: 'binance',
    liveTrading: false,
    paperTrading: true,
    maxConcurrentTrades: 5,
    notificationEmail: 'notifications@example.com',
  })

  const handleBotSettingChange = (key: keyof BotType['settings'], value: string | number) => {
    setBot(prev => ({
      ...prev,
      settings: {
        ...prev.settings!,
        [key]: value,
      },
    }))
  }

  const handleDeploymentChange = (key: keyof BotDeploymentConfig, value: string | number | boolean) => {
    setDeploymentConfig(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleStatusToggle = async (newStatus: 'active' | 'inactive' | 'paused') => {
    try {
      setBot(prev => ({ ...prev, status: newStatus }))
      setSaveMessage({
        type: 'success',
        message: `Bot ${newStatus === 'active' ? 'started' : 'stopped'} successfully!`,
      })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to update bot status.' })
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSaveMessage({ type: 'success', message: 'Bot settings saved successfully!' })
      setIsEditing(false)
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to save bot settings.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeploy = async () => {
    if (!deploymentConfig.apiKey || !deploymentConfig.apiSecret) {
      setSaveMessage({
        type: 'error',
        message: 'Please enter both API key and secret.',
      })
      return
    }

    setIsSaving(true)
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSaveMessage({
        type: 'success',
        message: 'Bot deployed successfully! Live trading is now active.',
      })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to deploy bot.' })
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: BotType['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'paused':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Bot className="w-8 h-8" />
                {bot.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{bot.description}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(bot.status)} border-0 text-lg px-3 py-1`}>
            {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
          </Badge>
        </motion.div>

        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg flex items-center gap-2 ${
              saveMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            {saveMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {saveMessage.message}
          </motion.div>
        )}

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Total Profit/Loss
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      bot.profitLoss >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    ${bot.profitLoss.toLocaleString()}
                  </p>
                  <p
                    className={`text-xs ${
                      bot.profitLossPercentage >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {bot.profitLossPercentage >= 0 ? '+' : ''}{bot.profitLossPercentage}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Total Trades
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{bot.trades}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {performance.winningTrades} wins, {performance.losingTrades} losses
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Win Rate
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{bot.winRate}%</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-2">
                    <div
                      className="bg-blue-500 h-1 rounded-full"
                      style={{ width: `${bot.winRate}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Sharpe Ratio
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {performance.sharpeRatio.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Max Drawdown: {performance.maxDrawdown}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Daily profit and trade count for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    dot={{ fill: '#3b82f6' }}
                    name="Daily Profit ($)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bot Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Bot Settings
                </CardTitle>
                <CardDescription>Configure bot parameters and strategy</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <FormInput
                  id="tradingPair"
                  type="text"
                  label="Trading Pair"
                  value={bot.settings?.tradingPair || ''}
                  onChange={e => handleBotSettingChange('tradingPair', e.target.value)}
                  disabled={!isEditing}
                />

                <FormInput
                  id="timeframe"
                  type="text"
                  label="Timeframe"
                  value={bot.settings?.timeframe || ''}
                  onChange={e => handleBotSettingChange('timeframe', e.target.value)}
                  disabled={!isEditing}
                />

                <FormInput
                  id="maxTradeSize"
                  type="number"
                  label="Max Trade Size"
                  value={bot.settings?.maxTradeSize || ''}
                  onChange={e => handleBotSettingChange('maxTradeSize', parseFloat(e.target.value))}
                  disabled={!isEditing}
                />

                <FormInput
                  id="stopLoss"
                  type="number"
                  label="Stop Loss (%)"
                  value={bot.settings?.stopLoss || ''}
                  onChange={e => handleBotSettingChange('stopLoss', parseFloat(e.target.value))}
                  disabled={!isEditing}
                />

                <FormInput
                  id="takeProfit"
                  type="number"
                  label="Take Profit (%)"
                  value={bot.settings?.takeProfit || ''}
                  onChange={e => handleBotSettingChange('takeProfit', parseFloat(e.target.value))}
                  disabled={!isEditing}
                />

                <FormInput
                  id="riskPercentage"
                  type="number"
                  label="Risk Per Trade (%)"
                  value={bot.settings?.riskPercentage || ''}
                  onChange={e => handleBotSettingChange('riskPercentage', parseFloat(e.target.value))}
                  disabled={!isEditing}
                />

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex gap-2">
                  {!isEditing ? (
                    <>
                      <Button onClick={() => setIsEditing(true)} variant="outline" className="flex-1">
                        Edit Settings
                      </Button>
                      <Button
                        onClick={() =>
                          handleStatusToggle(bot.status === 'active' ? 'paused' : 'active')
                        }
                        className="flex-1"
                      >
                        {bot.status === 'active' ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Deployment Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Deployment Configuration
                </CardTitle>
                <CardDescription>Connect to exchange and configure deployment</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <FormInput
                  id="exchangeId"
                  type="text"
                  label="Exchange"
                  value={deploymentConfig.exchangeId || ''}
                  onChange={e => handleDeploymentChange('exchangeId', e.target.value)}
                  placeholder="e.g., binance, kraken, coinbase"
                />

                <FormInput
                  id="apiKey"
                  type="password"
                  label="API Key"
                  value={deploymentConfig.apiKey || ''}
                  onChange={e => handleDeploymentChange('apiKey', e.target.value)}
                  placeholder="Enter your exchange API key"
                  showPasswordToggle
                />

                <FormInput
                  id="apiSecret"
                  type="password"
                  label="API Secret"
                  value={deploymentConfig.apiSecret || ''}
                  onChange={e => handleDeploymentChange('apiSecret', e.target.value)}
                  placeholder="Enter your exchange API secret"
                  showPasswordToggle
                />

                <FormInput
                  id="maxConcurrentTrades"
                  type="number"
                  label="Max Concurrent Trades"
                  value={deploymentConfig.maxConcurrentTrades || ''}
                  onChange={e => handleDeploymentChange('maxConcurrentTrades', parseInt(e.target.value))}
                />

                <FormInput
                  id="notificationEmail"
                  type="email"
                  label="Notification Email"
                  value={deploymentConfig.notificationEmail || ''}
                  onChange={e => handleDeploymentChange('notificationEmail', e.target.value)}
                />

                <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <FormCheckbox
                    id="paperTrading"
                    label="Paper Trading (Simulation Mode)"
                    checked={deploymentConfig.paperTrading || false}
                    onChange={e => handleDeploymentChange('paperTrading', e.target.checked)}
                  />
                  <FormCheckbox
                    id="liveTrading"
                    label="Live Trading (Real Money)"
                    checked={deploymentConfig.liveTrading || false}
                    onChange={e => handleDeploymentChange('liveTrading', e.target.checked)}
                  />
                </div>

                <Button onClick={handleDeploy} disabled={isSaving} className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  {isSaving ? 'Deploying...' : 'Deploy Bot'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bot Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Bot Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Strategy</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{bot.strategy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {bot.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {bot.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bot ID</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm font-mono">
                    {bot.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

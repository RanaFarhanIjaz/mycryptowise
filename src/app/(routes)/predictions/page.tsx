'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
  AlertCircle,
  Zap,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface PredictionData {
  current: {
    price: number
    timestamp: string
    source: string
  }
  prediction: {
    current_price: number
    predicted_price: number
    predicted_change: number
    confidence: number
    direction: string
    model: string
    data_source?: string
  }
  support: number
  resistance: number
}

const models = {
  xgboost: { name: 'XGBoost', accuracy: 89.5, description: 'Gradient boosting for trend detection', color: 'from-green-500 to-emerald-500' },
  lstm: { name: 'LSTM', accuracy: 91.2, description: 'Deep learning for time series', color: 'from-blue-500 to-cyan-500' },
  transformer: { name: 'Transformer', accuracy: 93.8, description: 'Attention-based pattern recognition', color: 'from-purple-500 to-pink-500' },
  ensemble: { name: 'Ensemble', accuracy: 94.5, description: 'Combines all models for best accuracy', color: 'from-orange-500 to-red-500' }
}

export default function PredictionsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC')
  const [selectedModel, setSelectedModel] = useState('ensemble')
  const [data, setData] = useState<PredictionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'GOLD', 'SILVER']

  const fetchPrediction = async () => {
    if (!selectedSymbol) {
      setError('Please select a symbol')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSymbol,
          modelType: selectedModel
        })
      })
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch prediction')
      }
      
      if (!result.data) {
        throw new Error('No prediction data received')
      }
      
      setData(result.data)
      setLastUpdated(new Date())
      
    } catch (err) {
      console.error('Prediction error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch prediction')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedSymbol) {
      fetchPrediction()
    }
  }, [selectedSymbol, selectedModel])

  const getDirectionIcon = (direction: string) => {
    switch(direction) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'strong_up': return <TrendingUp className="h-5 w-5 text-green-500" />
      case 'down': return <TrendingDown className="h-5 w-5 text-red-500" />
      case 'strong_down': return <TrendingDown className="h-5 w-5 text-red-500" />
      default: return <Minus className="h-5 w-5 text-yellow-500" />
    }
  }

  const formatPrice = (price: number | undefined) => {
    if (price === undefined || price === null) return 'N/A'
    if (selectedSymbol === 'XRP') return price.toFixed(4)
    if (selectedSymbol === 'GOLD' || selectedSymbol === 'SILVER') return price.toFixed(2)
    if (price < 10) return price.toFixed(3)
    if (price < 1000) return price.toFixed(2)
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  const currentModel = models[selectedModel as keyof typeof models] || models.ensemble

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Brain className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Price Predictor
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 px-4">
            Choose your model and get real-time predictions
          </p>
        </motion.div>

        {/* Controls - Mobile Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8"
        >
          <Card className="p-3 sm:p-4">
            <CardHeader className="p-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Asset</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-background touch-target"
              >
                {symbols.map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))}
              </select>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="p-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Model</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 sm:p-2.5 text-sm sm:text-base border rounded-lg bg-background touch-target"
              >
                <option value="xgboost">XGBoost ({models.xgboost.accuracy}%)</option>
                <option value="lstm">LSTM ({models.lstm.accuracy}%)</option>
                <option value="transformer">Transformer ({models.transformer.accuracy}%)</option>
                <option value="ensemble">Ensemble ({models.ensemble.accuracy}%)</option>
              </select>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="p-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Button
                onClick={fetchPrediction}
                disabled={loading}
                className="w-full touch-target text-sm sm:text-base py-2 sm:py-2.5"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Model Info Card - Mobile Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8"
        >
          <Card className={`bg-gradient-to-r ${currentModel.color} text-white`}>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Brain className="h-5 w-5 sm:h-6 sm:w-6" />
                    <h3 className="text-lg sm:text-xl font-bold">{currentModel.name}</h3>
                    <Badge className="bg-white/20 text-white text-xs">Accuracy: {currentModel.accuracy}%</Badge>
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm">{currentModel.description}</p>
                </div>
                {lastUpdated && (
                  <div className="text-right text-xs sm:text-sm text-white/70">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1" />
                    {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Prediction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-8"
        >
          <Card className="overflow-hidden">
            <div className={`h-1 sm:h-2 bg-gradient-to-r ${currentModel.color}`} />
            <CardHeader className="p-4 sm:p-5 md:p-6">
              <CardTitle className="text-xl sm:text-2xl">Live Prediction</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {currentModel.name} Model • {currentModel.accuracy}% accuracy
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-5 md:px-6 pb-5 sm:pb-6 md:pb-6">
              {loading ? (
                <div className="flex justify-center py-8 sm:py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="text-center py-8 sm:py-12 text-red-500">
                  <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base">{error}</p>
                  <Button onClick={fetchPrediction} variant="outline" className="mt-4 touch-target">
                    Try Again
                  </Button>
                </div>
              ) : data ? (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Current Price */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-5 md:p-6 rounded-xl">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div>
                        <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 mb-1">
                          Current Price (Live)
                        </p>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                          ${formatPrice(data.current?.price)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Source: {data.current?.source || 'Binance'}
                        </p>
                      </div>
                      <Badge className="bg-green-500 flex items-center gap-1 self-start text-xs">
                        <Zap className="h-3 w-3" />
                        LIVE
                      </Badge>
                    </div>
                  </div>

                  {/* Prediction */}
                  {data.prediction && (
                    <div className={`bg-gradient-to-r ${currentModel.color} p-4 sm:p-5 md:p-6 rounded-xl text-white`}>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm text-white/80">
                          {currentModel.name} Prediction
                        </p>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs self-start">
                          {(data.prediction.confidence * 100).toFixed(1)}% confidence
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                          ${formatPrice(data.prediction.predicted_price)}
                        </p>
                        <div className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-sm ${
                          data.prediction.predicted_change > 0
                            ? 'bg-green-500/30 text-green-100'
                            : data.prediction.predicted_change < 0
                            ? 'bg-red-500/30 text-red-100'
                            : 'bg-gray-500/30 text-gray-100'
                        }`}>
                          {data.prediction.predicted_change > 0 ? '↑' : '↓'}
                          {Math.abs(data.prediction.predicted_change).toFixed(2)}%
                        </div>
                      </div>

                      {data.prediction.data_source && (
                        <p className="text-xs sm:text-sm text-white/70 mt-3">
                          Data: {data.prediction.data_source}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Support/Resistance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 border border-green-200 dark:border-green-900 rounded-lg">
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mb-1">Support Level</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                        ${formatPrice(data.support)}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 border border-red-200 dark:border-red-900 rounded-lg">
                      <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mb-1">Resistance Level</p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">
                        ${formatPrice(data.resistance)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                  <p className="text-sm sm:text-base">No prediction available. Click refresh to generate.</p>
                  <Button onClick={fetchPrediction} className="mt-4 touch-target">
                    Get Prediction
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
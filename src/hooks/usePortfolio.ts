'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getUserTransactions, addTransaction as addTxToDb } from '@/lib/db/transactions'
import { getLivePrice } from '@/lib/api/live-prices'
import { getAccountStats, updateBalance } from '@/lib/db/account'
import { Transaction, PortfolioHolding, PortfolioSummary } from '@/types'

export const usePortfolio = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [livePrices, setLivePrices] = useState<Record<string, number>>({})
  const [accountStats, setAccountStats] = useState({
    balance: 50000.00,
    equity: 50000.00,
    margin: 0.00,
    freeMargin: 50000.00,
    marginLevel: 0,
    totalDeposit: 50000.00,
    totalWithdrawal: 0.00,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchTransactions = async () => {
      try {
        const txs = await getUserTransactions(user.uid)
        setTransactions(txs)
        
        // Extract unique assets
        const assets = Array.from(new Set(txs.map(tx => tx.asset)))
        
        // Fetch live prices for all assets (excluding stable/fiat)
        const prices: Record<string, number> = { 'USD': 1.0, 'USDT': 1.0 }
        const cryptoAssets = assets.filter(a => a !== 'USD' && a !== 'USDT')
        
        await Promise.all(cryptoAssets.map(async (asset) => {
          try {
            prices[asset] = await getLivePrice(asset)
          } catch (e) {
            console.error(`Failed to fetch price for ${asset}`, e)
            prices[asset] = 0 // Fallback
          }
        }))

        setLivePrices(prices)

        // Fetch real account info from firebase
        const stats = await getAccountStats(user.uid)
        setAccountStats(prev => ({
          ...prev,
          ...stats
        }))
      } catch (err) {
        console.error('Portfolio fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [user])

  const holdings = useMemo(() => {
    const assets: Record<string, { quantity: number; totalCost: number }> = {}

    transactions.forEach(tx => {
      if (!assets[tx.asset]) {
        assets[tx.asset] = { quantity: 0, totalCost: 0 }
      }

      if (tx.type === 'BUY') {
        assets[tx.asset].quantity += tx.quantity
        assets[tx.asset].totalCost += tx.totalValue
      } else if (tx.type === 'SELL') {
        assets[tx.asset].quantity -= tx.quantity
        // Average cost remains the same, but total cost for the remaining quantity is adjusted
        // Total cost reduction = quantity_sold * average_cost_before_sale
        const avgCost = assets[tx.asset].totalCost / (assets[tx.asset].quantity + tx.quantity)
        assets[tx.asset].totalCost -= tx.quantity * avgCost
      }
    })

    const portfolioHoldings: PortfolioHolding[] = Object.keys(assets).map(symbol => {
      const { quantity, totalCost } = assets[symbol]
      const currentPrice = livePrices[symbol] || 0
      const marketValue = quantity * currentPrice
      const averageCost = quantity > 0 ? totalCost / quantity : 0
      const unrealizedPnL = quantity > 0 ? marketValue - totalCost : 0
      const unrealizedPnLPercentage = totalCost > 0 ? (unrealizedPnL / totalCost) * 100 : 0

      return {
        id: symbol,
        userId: user?.uid || '',
        asset: symbol,
        symbol: symbol,
        quantity,
        averageCost,
        currentPrice,
        marketValue,
        unrealizedPnL,
        unrealizedPnLPercentage,
        allocation: 0, // Calculated later
        lastUpdated: new Date()
      }
    }).filter(h => h.quantity > 0)

    const totalPortfolioValue = portfolioHoldings.reduce((sum, h) => sum + h.marketValue, 0)

    return portfolioHoldings.map(h => ({
      ...h,
      allocation: totalPortfolioValue > 0 ? (h.marketValue / totalPortfolioValue) * 100 : 0
    }))
  }, [transactions, livePrices, user])

  const summary = useMemo((): PortfolioSummary => {
    const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0)
    const totalCost = holdings.reduce((sum, h) => sum + (h.quantity * h.averageCost), 0)
    const totalPnL = totalValue - totalCost
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0
    
    // Sort to find best/worst performers
    const sortedByPnL = [...holdings].sort((a, b) => b.unrealizedPnLPercentage - a.unrealizedPnLPercentage)

    return {
      userId: user?.uid || '',
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercentage,
      dayChange: 0, // Need historical data for this
      dayChangePercentage: 0,
      bestPerformer: sortedByPnL.length > 0 ? {
        asset: sortedByPnL[0].asset,
        pnlPercentage: sortedByPnL[0].unrealizedPnLPercentage
      } : { asset: 'None', pnlPercentage: 0 },
      worstPerformer: sortedByPnL.length > 0 ? {
        asset: sortedByPnL[sortedByPnL.length - 1].asset,
        pnlPercentage: sortedByPnL[sortedByPnL.length - 1].unrealizedPnLPercentage
      } : { asset: 'None', pnlPercentage: 0 },
      lastUpdated: new Date()
    }
  }, [holdings, user])

  const stats = useMemo(() => {
    const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0)
    const equity = accountStats.balance + totalValue
    const margin = holdings.length * 50 // Simple mock margin per position
    const freeMargin = equity - margin
    const marginLevel = margin > 0 ? (equity / margin) * 100 : 0

    return {
      ...accountStats,
      equity,
      margin,
      freeMargin,
      marginLevel: Math.round(marginLevel)
    }
  }, [holdings, accountStats])

  return {
    holdings,
    summary,
    accountStats: stats,
    transactions,
    loading,
    refresh: async () => {
      // Re-fetch transactions and prices
      setLoading(true)
      const txs = await getUserTransactions(user?.uid || '')
      setTransactions(txs)
      const assets = Array.from(new Set(txs.map(tx => tx.asset)))
      const prices: Record<string, number> = { 'USD': 1.0, 'USDT': 1.0 }
      const cryptoAssets = assets.filter(a => a !== 'USD' && a !== 'USDT')
      
      await Promise.all(cryptoAssets.map(async (asset) => {
        try {
          prices[asset] = await getLivePrice(asset)
        } catch (e) {
          prices[asset] = 0
        }
      }))
      setLivePrices(prices)

      
      const stats = await getAccountStats(user?.uid || '')
      setAccountStats(prev => ({ ...prev, ...stats }))
      
      setLoading(false)
    }
  }
}

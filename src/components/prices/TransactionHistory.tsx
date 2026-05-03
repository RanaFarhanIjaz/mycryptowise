'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronUp,
  ChevronDown,
  ArrowDownLeft,
  ArrowUpRight,
  Bot,
  Search,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Transaction, TransactionFilters } from '@/types'

interface TransactionHistoryProps {
  transactions?: Transaction[]
  onExport?: () => void
  isLoading?: boolean
}

type SortField = 'date' | 'amount' | 'type'
type SortDirection = 'asc' | 'desc'

const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'BUY',
    asset: 'BTC',
    quantity: 0.5,
    price: 45000,
    totalValue: 22500,
    date: new Date('2024-05-01'),
    time: '14:30',
    status: 'completed',
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'SELL',
    asset: 'ETH',
    quantity: 2.0,
    price: 2500,
    totalValue: 5000,
    date: new Date('2024-04-30'),
    time: '11:15',
    status: 'completed',
  },
  {
    id: '3',
    userId: 'user-1',
    type: 'BOT',
    asset: 'XRP',
    quantity: 100,
    price: 0.52,
    totalValue: 52,
    date: new Date('2024-04-29'),
    time: '09:45',
    status: 'completed',
    botId: 'bot-1',
  },
  {
    id: '4',
    userId: 'user-1',
    type: 'BUY',
    asset: 'ADA',
    quantity: 500,
    price: 0.98,
    totalValue: 490,
    date: new Date('2024-04-28'),
    time: '16:20',
    status: 'completed',
  },
  {
    id: '5',
    userId: 'user-1',
    type: 'BOT',
    asset: 'SOL',
    quantity: 5,
    price: 140,
    totalValue: 700,
    date: new Date('2024-04-27'),
    time: '13:00',
    status: 'completed',
    botId: 'bot-2',
  },
]

export function TransactionHistory({
  transactions = mockTransactions,
  onExport,
  isLoading = false,
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [typeFilter, setTypeFilter] = useState<Transaction['type'] | 'ALL'>('ALL')

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(t => t.type === typeFilter)
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: number | Date
      let bValue: number | Date

      switch (sortField) {
        case 'date':
          aValue = a.date.getTime()
          bValue = b.date.getTime()
          break
        case 'amount':
          aValue = a.totalValue
          bValue = b.totalValue
          break
        case 'type':
          aValue = a.type.charCodeAt(0)
          bValue = b.type.charCodeAt(0)
          break
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [transactions, searchTerm, typeFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'BUY':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />
      case 'SELL':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />
      case 'BOT':
        return <Bot className="w-5 h-5 text-blue-500" />
    }
  }

  const getTypeColor = (type: Transaction['type']): string => {
    switch (type) {
      case 'BUY':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'SELL':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
      case 'BOT':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
    }
  }

  const SortableHeader = ({
    field,
    label,
  }: {
    field: SortField
    label: string
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
    >
      {label}
      {sortField === field && (
        <span>
          {sortDirection === 'asc' ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      )}
    </button>
  )

  const totalValue = filteredAndSortedTransactions.reduce((sum, t) => sum + t.totalValue, 0)
  const buyCount = filteredAndSortedTransactions.filter(t => t.type === 'BUY').length
  const sellCount = filteredAndSortedTransactions.filter(t => t.type === 'SELL').length
  const botCount = filteredAndSortedTransactions.filter(t => t.type === 'BOT').length

  return (
    <div className="w-full space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                  <ArrowDownLeft className="w-4 h-4 text-green-500" />
                  Buy Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{buyCount}</p>
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
                  <ArrowUpRight className="w-4 h-4 text-red-500" />
                  Sell Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sellCount}</p>
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
                  <Bot className="w-4 h-4 text-blue-500" />
                  Bot Trades
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{botCount}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View and manage your trading transactions</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by asset or type..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {(['ALL', 'BUY', 'SELL', 'BOT'] as const).map(type => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                >
                  {type === 'ALL' ? 'All' : type}
                </Button>
              ))}
            </div>

            {onExport && (
              <Button onClick={onExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500 dark:text-gray-400">Loading transactions...</div>
              </div>
            ) : filteredAndSortedTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Filter className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Type</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Asset</span>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <SortableHeader field="date" label="Date/Time" />
                    </th>
                    <th className="px-4 py-3 text-right">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Quantity</span>
                    </th>
                    <th className="px-4 py-3 text-right">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Price</span>
                    </th>
                    <th className="px-4 py-3 text-right">
                      <SortableHeader field="amount" label="Total Value" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Status</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedTransactions.map((transaction, idx) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <Badge className={`${getTypeColor(transaction.type)} border-0`}>
                            {transaction.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                        {transaction.asset}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        <div className="text-sm">
                          <p className="font-medium">{transaction.date.toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{transaction.time}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                        {transaction.quantity.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                        ${transaction.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                        ${transaction.totalValue.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={transaction.status === 'completed' ? 'default' : 'outline'}
                          className={
                            transaction.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-0'
                              : transaction.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-0'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-0'
                          }
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 pt-4">
            Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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
  Plus,
  Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Transaction, TransactionFilters } from '@/types'
import { Trash2 } from 'lucide-react'

interface TransactionHistoryProps {
  transactions?: Transaction[]
  onExport?: () => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

type SortField = 'date' | 'amount' | 'type'
type SortDirection = 'asc' | 'desc'

const SortableHeader = ({
  field,
  label,
  sortField,
  sortDirection,
  handleSort,
}: {
  field: SortField
  label: string
  sortField: SortField
  sortDirection: SortDirection
  handleSort: (field: SortField) => void
}) => {
  return (
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
}


export function TransactionHistory({
  transactions = [],
  onExport,
  onDelete,
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
      case 'BUY':     return <ArrowDownLeft className="w-5 h-5 text-green-500" />
      case 'SELL':    return <ArrowUpRight className="w-5 h-5 text-red-500" />
      case 'BOT':     return <Bot className="w-5 h-5 text-blue-500" />
      case 'DEPOSIT': return <Plus className="w-5 h-5 text-cyan-500" />
      case 'WITHDRAW':return <Minus className="w-5 h-5 text-orange-500" />
      default:        return null
    }
  }

  const getTypeColor = (type: Transaction['type']): string => {
    switch (type) {
      case 'BUY':     return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
      case 'SELL':    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
      case 'BOT':     return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
      case 'DEPOSIT': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200'
      case 'WITHDRAW':return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
      default:        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalValue = filteredAndSortedTransactions.reduce((sum, t) => sum + t.totalValue, 0);
  const buyCount     = filteredAndSortedTransactions.filter(t => t.type === 'BUY').length;
  const sellCount    = filteredAndSortedTransactions.filter(t => t.type === 'SELL').length;
  const depositCount = filteredAndSortedTransactions.filter(t => t.type === 'DEPOSIT').length;
  const withdrawCount= filteredAndSortedTransactions.filter(t => t.type === 'WITHDRAW').length;

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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-500" />
                  Deposits
                </p>
                <p className="text-2xl font-bold text-cyan-600">{depositCount}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Minus className="w-4 h-4 text-orange-500" />
                  Withdrawals
                </p>
                <p className="text-2xl font-bold text-orange-600">{withdrawCount}</p>
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

            <div className="flex flex-wrap gap-2">
              {(['ALL', 'BUY', 'SELL', 'DEPOSIT', 'WITHDRAW', 'BOT'] as const).map(type => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className={
                    typeFilter === type
                      ? type === 'BUY' ? 'bg-green-600' :
                        type === 'SELL' ? 'bg-red-600' :
                        type === 'DEPOSIT' ? 'bg-cyan-600' :
                        type === 'WITHDRAW' ? 'bg-orange-600' : ''
                      : ''
                  }
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
                      <SortableHeader 
                        field="date" 
                        label="Date & Time" 
                        sortField={sortField}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                      />
                    </th>
                    <th className="px-4 py-3 text-left">Asset</th>
                    <th className="px-4 py-3 text-left">
                      <SortableHeader 
                        field="type" 
                        label="Type" 
                        sortField={sortField}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                      />
                    </th>
                    <th className="px-4 py-3 text-right">Quantity</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">
                      <SortableHeader 
                        field="amount" 
                        label="Total Value" 
                        sortField={sortField}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                      />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Status</span>
                    </th>
                    {onDelete && <th className="px-4 py-3 text-right"></th>}
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
                      {onDelete && (
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onDelete(transaction.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      )}
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

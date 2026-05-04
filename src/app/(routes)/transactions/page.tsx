'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { History, Download, Filter, Search, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { TransactionHistory } from '@/components/prices/TransactionHistory'
import { Transaction } from '@/types'
import { useAuth } from '@/context/AuthContext'
import { getUserTransactions, deleteTransaction } from '@/lib/db/transactions'
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog'
import { toast } from 'react-hot-toast'

export default function TransactionsPage() {
  const { user } = useAuth()
  const [isExporting, setIsExporting] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTransactions = async () => {
    if (user) {
      setIsLoading(true)
      const data = await getUserTransactions(user.uid)
      setTransactions(data)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [user])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        if (!user) return
        await deleteTransaction(user.uid, id)
        toast.success('Transaction deleted')
        fetchTransactions()
      } catch (error) {
        toast.error('Failed to delete transaction')
      }
    }
  }

  const filteredTransactions = transactions.filter(t => 
    t.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real app, this would trigger a download
      const csvContent = transactions.map(t =>
        `${t.date.toISOString().split('T')[0]},${t.time},${t.type},${t.asset},${t.quantity},${t.price},${t.totalValue}`
      ).join('\n')

      const blob = new Blob([`Date,Time,Type,Asset,Quantity,Price,Total Value\n${csvContent}`], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'transaction-history.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
                <p className="text-gray-600 dark:text-gray-400">View and manage all your crypto transactions</p>
              </div>
            </div>
            <AddTransactionDialog onTransactionAdded={fetchTransactions} />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                  <History className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
                    <p className="text-2xl font-bold">${transactions.reduce((sum, t) => sum + t.totalValue, 0).toLocaleString()}</p>
                  </div>
                  <Filter className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Buy Orders</p>
                    <p className="text-2xl font-bold">{transactions.filter(t => t.type === 'BUY').length}</p>
                  </div>
                  <Search className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sell Orders</p>
                    <p className="text-2xl font-bold text-red-600">{transactions.filter(t => t.type === 'SELL').length}</p>
                  </div>
                  <Filter className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deposits</p>
                    <p className="text-2xl font-bold text-green-600">{transactions.filter(t => t.type === 'DEPOSIT').length}</p>
                  </div>
                  <Download className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Transaction History Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Complete history of your crypto trading activities
                  </CardDescription>
                </div>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <TransactionHistory
                  transactions={filteredTransactions}
                  onExport={handleExport}
                  onDelete={handleDelete}
                  isLoading={false}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
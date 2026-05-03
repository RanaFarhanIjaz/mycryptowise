'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { History, Download, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { TransactionHistory } from '@/components/prices/TransactionHistory'
import { Transaction } from '@/types'

export default function TransactionsPage() {
  const [isExporting, setIsExporting] = useState(false)

  // Mock transaction data - in a real app, this would come from an API
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
    {
      id: '6',
      userId: 'user-1',
      type: 'SELL',
      asset: 'DOT',
      quantity: 50,
      price: 8.50,
      totalValue: 425,
      date: new Date('2024-04-26'),
      time: '10:30',
      status: 'completed',
    },
    {
      id: '7',
      userId: 'user-1',
      type: 'BUY',
      asset: 'LINK',
      quantity: 25,
      price: 15.20,
      totalValue: 380,
      date: new Date('2024-04-25'),
      time: '15:45',
      status: 'completed',
    },
    {
      id: '8',
      userId: 'user-1',
      type: 'BOT',
      asset: 'AVAX',
      quantity: 10,
      price: 35.75,
      totalValue: 357.50,
      date: new Date('2024-04-24'),
      time: '12:15',
      status: 'completed',
      botId: 'bot-3',
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real app, this would trigger a download
      const csvContent = mockTransactions.map(t =>
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
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
              <p className="text-gray-600 dark:text-gray-400">View and manage all your crypto transactions</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                    <p className="text-2xl font-bold">{mockTransactions.length}</p>
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
                    <p className="text-2xl font-bold">${mockTransactions.reduce((sum, t) => sum + t.totalValue, 0).toLocaleString()}</p>
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
                    <p className="text-2xl font-bold">{mockTransactions.filter(t => t.type === 'BUY').length}</p>
                  </div>
                  <Search className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Bot Trades</p>
                    <p className="text-2xl font-bold">{mockTransactions.filter(t => t.type === 'BOT').length}</p>
                  </div>
                  <Download className="w-8 h-8 text-orange-500" />
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
              <TransactionHistory
                transactions={mockTransactions}
                onExport={handleExport}
                isLoading={false}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
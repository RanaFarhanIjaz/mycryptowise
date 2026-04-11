'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Zap, 
  TrendingUp, 
  Activity, 
  DollarSign,
  BarChart3,
  Brain,
  Sparkles,
  Filter,
  Search,
  ArrowRight,
  Check,
  AlertTriangle,
  Copy,
  CheckCircle,
  Send,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { bots } from '@/lib/bots/bots-data'
import toast from 'react-hot-toast'

// TRC20 USDT Address (Replace with your actual address)
const TRC20_ADDRESS = "TXgQZf7YQk5Qk5Qk5Qk5Qk5Qk5Qk5Qk5Qk5"
const BOTS_EMAIL = "bots@cryptowise.com"

const iconMap: any = {
  Zap, TrendingUp, Activity, BarChart3, Brain, DollarSign, Sparkles
}

const riskColors = {
  Low: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  Medium: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
  High: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
}

export default function BotsPage() {
  const [search, setSearch] = useState('')
  const [selectedRisk, setSelectedRisk] = useState<string>('all')
  const [selectedBot, setSelectedBot] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [licenseType, setLicenseType] = useState<'lifetime' | 'monthly'>('lifetime')
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details')
  const [copied, setCopied] = useState(false)
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    transactionId: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(search.toLowerCase()) ||
                         bot.description.toLowerCase().includes(search.toLowerCase())
    const matchesRisk = selectedRisk === 'all' || bot.risk.toLowerCase() === selectedRisk.toLowerCase()
    return matchesSearch && matchesRisk
  })

  const risks = ['all', 'Low', 'Medium', 'High']

  const copyAddress = () => {
    navigator.clipboard.writeText(TRC20_ADDRESS)
    setCopied(true)
    toast.success('Address copied to clipboard!')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleSendEmail = async () => {
    if (!userDetails.name || !userDetails.email || !userDetails.transactionId) {
      toast.error('Please fill all fields')
      return
    }

    setSubmitting(true)

    // Create email content
    const emailContent = `
      Bot Purchase Details
      --------------------
      Customer Name: ${userDetails.name}
      Customer Email: ${userDetails.email}
      Bot Name: ${selectedBot?.name}
      License Type: ${licenseType}
      Amount: $${licenseType === 'lifetime' ? selectedBot?.price : selectedBot?.monthlyRental} USDT
      Transaction ID: ${userDetails.transactionId}
      Payment Date: ${new Date().toLocaleString()}
    `

    // Create mailto link
    const mailtoLink = `mailto:${BOTS_EMAIL}?subject=Bot Purchase - ${selectedBot?.name} - ${userDetails.name}&body=${encodeURIComponent(emailContent)}`
    
    // Open email client
    window.location.href = mailtoLink
    
    setStep('confirmation')
    setSubmitting(false)
    
    toast.success('Email client opened! Please send the email to complete your purchase.')
  }

  const resetModal = () => {
    setSelectedBot(null)
    setStep('details')
    setLicenseType('lifetime')
    setUserDetails({ name: '', email: '', transactionId: '' })
    setCopied(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bot Marketplace
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Deploy automated trading bots with MQL5 files and license keys
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <Bot className="h-6 w-6 mb-2" />
              <div className="text-2xl font-bold">{bots.length}</div>
              <div className="text-sm opacity-90">Total Bots</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <DollarSign className="h-6 w-6 mb-2" />
              <div className="text-2xl font-bold">$99</div>
              <div className="text-sm opacity-90">Starting Price</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <TrendingUp className="h-6 w-6 mb-2" />
              <div className="text-2xl font-bold">+67.8%</div>
              <div className="text-sm opacity-90">Best Return</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <Activity className="h-6 w-6 mb-2" />
              <div className="text-2xl font-bold">MT5/MT4</div>
              <div className="text-sm opacity-90">Compatible</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search bots by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <h3 className="font-semibold mb-3">Risk Level</h3>
                <div className="flex flex-wrap gap-2">
                  {risks.map((risk) => (
                    <button
                      key={risk}
                      onClick={() => setSelectedRisk(risk)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        selectedRisk === risk
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {risk === 'all' ? 'All Risks' : risk}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bot Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredBots.map((bot, index) => {
            const IconComponent = iconMap[bot.icon] || Bot
            
            return (
              <motion.div
                key={bot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                {bot.popular && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      POPULAR
                    </span>
                  </div>
                )}
                
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 p-2 flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className={riskColors[bot.risk]}>
                        {bot.risk} Risk
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl">{bot.name}</CardTitle>
                    <CardDescription>{bot.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Performance</p>
                        <p className="text-2xl font-bold text-green-500">{bot.performance}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Timeframe</p>
                        <p className="font-medium">{bot.timeframe}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Price</p>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Lifetime</p>
                          <p className="text-xl font-bold">${bot.price}</p>
                        </div>
                        {bot.monthlyRental && (
                          <div>
                            <p className="text-xs text-gray-400">Monthly</p>
                            <p className="text-lg">${bot.monthlyRental}/mo</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Key Features</p>
                      <ul className="space-y-1">
                        {bot.features.slice(0, 2).map((feature, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full group"
                      onClick={() => setSelectedBot(bot)}
                    >
                      Purchase Bot
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Empty State */}
        {filteredBots.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bot className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bots found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* Purchase Modal with TRC20 Payment */}
        <AnimatePresence>
          {selectedBot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={resetModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Step 1: Details */}
                {step === 'details' && (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Purchase {selectedBot.name}</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                        <Input
                          placeholder="Enter your full name"
                          value={userDetails.name}
                          onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={userDetails.email}
                          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">License will be sent to this email</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">License Type</label>
                        <div className="flex gap-4 mt-2">
                          <button
                            onClick={() => setLicenseType('lifetime')}
                            className={`flex-1 p-4 rounded-lg border-2 transition ${
                              licenseType === 'lifetime'
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <p className="font-bold text-lg">${selectedBot.price}</p>
                            <p className="text-sm text-gray-500">Lifetime</p>
                          </button>
                          {selectedBot.monthlyRental && (
                            <button
                              onClick={() => setLicenseType('monthly')}
                              className={`flex-1 p-4 rounded-lg border-2 transition ${
                                licenseType === 'monthly'
                                  ? 'border-primary bg-primary/5'
                                  : 'border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <p className="font-bold text-lg">${selectedBot.monthlyRental}</p>
                              <p className="text-sm text-gray-500">Monthly</p>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={resetModal}>
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => setStep('payment')}
                        disabled={!userDetails.name || !userDetails.email}
                      >
                        Continue to Payment
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 2: Payment - TRC20 Address */}
                {step === 'payment' && (
                  <>
                    <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Amount to Pay:</p>
                        <p className="text-3xl font-bold">
                          ${licenseType === 'lifetime' ? selectedBot.price : selectedBot.monthlyRental} USDT
                        </p>
                        <p className="text-xs text-gray-500 mt-1">on TRC20 Network</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Send USDT (TRC20) to this address:</label>
                        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                          <code className="text-sm break-all font-mono">{TRC20_ADDRESS}</code>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={copyAddress}
                        >
                          {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                          {copied ? 'Copied!' : 'Copy Address'}
                        </Button>
                      </div>

                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          Send exactly ${licenseType === 'lifetime' ? selectedBot.price : selectedBot.monthlyRental} USDT on TRC20 network only.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction ID (TxID)</label>
                        <Input
                          placeholder="Enter your TRC20 transaction ID"
                          value={userDetails.transactionId}
                          onChange={(e) => setUserDetails({ ...userDetails, transactionId: e.target.value })}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Paste the transaction hash from your wallet</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button variant="outline" className="flex-1" onClick={() => setStep('details')}>
                        Back
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleSendEmail}
                        disabled={!userDetails.transactionId || submitting}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {submitting ? 'Processing...' : 'Send Email'}
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3: Confirmation */}
                {step === 'confirmation' && (
                  <>
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">Email Sent!</h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        We've sent a confirmation email to {userDetails.email}
                      </p>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-left mb-4">
                        <p className="text-sm font-medium mb-2">What happens next?</p>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Our team will verify your transaction</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>You'll receive your license key within 24 hours</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>Check your email for download instructions</span>
                          </li>
                        </ul>
                      </div>
                      <Button onClick={resetModal} className="w-full">
                        Browse More Bots
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Risk Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Important Risk Disclosure</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Automated trading bots are tools that execute trades based on predefined strategies. 
                Past performance does not guarantee future results. Cryptocurrency and Forex trading 
                involves substantial risk of loss. License keys are non-refundable once issued.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


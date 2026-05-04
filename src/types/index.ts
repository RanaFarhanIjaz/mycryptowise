// User Types
export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile extends User {
  bio?: string
  phoneNumber?: string
  country?: string
  timezone?: string
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  priceAlerts: boolean
  transactionAlerts: boolean
  botAlerts: boolean
  weeklyReport: boolean
  monthlyReport: boolean
}

export interface AccountSecurity {
  userId: string
  twoFactorEnabled: boolean
  lastPasswordChange: Date
  loginHistory: LoginAttempt[]
}

export interface LoginAttempt {
  timestamp: Date
  ipAddress: string
  device: string
  status: 'success' | 'failed'
}

// Transaction Types
export interface Transaction {
  id: string
  userId: string
  type: 'BUY' | 'SELL' | 'BOT' | 'DEPOSIT' | 'WITHDRAW'
  asset: string
  quantity: number
  price: number
  totalValue: number
  date: Date
  time: string
  status: 'completed' | 'pending' | 'failed'
  botId?: string
}

export interface TransactionFilters {
  type?: 'BUY' | 'SELL' | 'BOT' | 'DEPOSIT' | 'WITHDRAW'
  asset?: string
  startDate?: Date
  endDate?: Date
  minAmount?: number
  maxAmount?: number
}

// Bot Types
export interface Bot {
  id: string
  userId: string
  name: string
  description: string
  strategy: string
  status: 'active' | 'inactive' | 'paused'
  profitLoss: number
  profitLossPercentage: number
  trades: number
  winRate: number
  createdAt: Date
  updatedAt: Date
  settings?: BotSettings
}

export interface BotSettings {
  maxTradeSize: number
  stopLoss: number
  takeProfit: number
  tradingPair: string
  timeframe: string
  riskPercentage: number
}

export interface BotDeploymentConfig {
  botId: string
  apiKey: string
  apiSecret: string
  exchangeId: string
  liveTrading: boolean
  paperTrading: boolean
  maxConcurrentTrades: number
  notificationEmail: string
}

export interface BotPerformance {
  botId: string
  totalTrades: number
  winningTrades: number
  losingTrades: number
  profitLoss: number
  profitLossPercentage: number
  averageTradeSize: number
  sharpeRatio: number
  maxDrawdown: number
  updateDate: Date
}

// Prediction Types
export interface Prediction {
  id: string
  asset: string
  predictedPrice: number
  predictedChange: number
  confidence: number
  direction: 'UP' | 'DOWN' | 'NEUTRAL'
  model: string
  modelAccuracy: number
  timestamp: Date
  supportLevel: number
  resistanceLevel: number
  technicals: {
    rsi: number
    macd: number
  }
}

// Portfolio Types
export interface PortfolioHolding {
  id: string
  userId: string
  asset: string
  symbol: string
  quantity: number
  averageCost: number
  currentPrice: number
  marketValue: number
  unrealizedPnL: number
  unrealizedPnLPercentage: number
  allocation: number
  lastUpdated: Date
}

export interface PortfolioSummary {
  userId: string
  totalValue: number
  totalCost: number
  totalPnL: number
  totalPnLPercentage: number
  dayChange: number
  dayChangePercentage: number
  bestPerformer: {
    asset: string
    pnlPercentage: number
  }
  worstPerformer: {
    asset: string
    pnlPercentage: number
  }
  lastUpdated: Date
}

export interface AssetAllocation {
  asset: string
  symbol: string
  value: number
  percentage: number
  color: string
}

export interface PortfolioPerformance {
  date: string
  value: number
  change: number
  changePercentage: number
}

// Form Validation Types
export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignUpFormData {
  email: string
  username: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
  termsAccepted: boolean
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface FormValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

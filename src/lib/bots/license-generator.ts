import crypto from 'crypto'

export interface License {
  key: string
  botId: string
  userId: string
  purchaseId: string
  expiresAt: Date | null
  maxActivations: number
  activations: number
  createdAt: Date
  metadata: {
    email: string
    transactionId: string
    amount: number
  }
}

export function generateLicenseKey(botId: string, userId: string, timestamp: number): string {
  const data = `${botId}-${userId}-${timestamp}-${crypto.randomBytes(4).toString('hex')}`
  const hash = crypto.createHash('sha256').update(data).digest('hex').toUpperCase()
  
  return `${hash.slice(0,5)}-${hash.slice(5,10)}-${hash.slice(10,15)}-${hash.slice(15,20)}`
}

export function verifyLicenseKey(licenseKey: string, botId: string): boolean {
  const pattern = /^[A-F0-9]{5}-[A-F0-9]{5}-[A-F0-9]{5}-[A-F0-9]{5}$/
  return pattern.test(licenseKey)
}

export function generateHardwareId(): string {
  const components = [
    navigator.userAgent,
    screen.width.toString(),
    screen.height.toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    navigator.platform
  ]
  
  const data = components.join('|')
  return crypto.createHash('sha256').update(data).digest('hex')
}

export function validateActivation(license: License, hardwareId: string): boolean {
  if (license.expiresAt && new Date() > license.expiresAt) {
    return false
  }
  
  if (license.activations >= license.maxActivations) {
    return false
  }
  
  return true
}
import { NextResponse } from 'next/server'
import { bots } from '@/lib/bots/bots-data'
import { generateLicenseKey } from '@/lib/bots/license-generator'
import crypto from 'crypto'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const risk = searchParams.get('risk')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  let filteredBots = [...bots]

  if (category && category !== 'all') {
    filteredBots = filteredBots.filter(bot => bot.category === category)
  }

  if (risk && risk !== 'all') {
    filteredBots = filteredBots.filter(bot => bot.risk.toLowerCase() === risk.toLowerCase())
  }

  if (minPrice) {
    filteredBots = filteredBots.filter(bot => bot.price >= parseInt(minPrice))
  }

  if (maxPrice) {
    filteredBots = filteredBots.filter(bot => bot.price <= parseInt(maxPrice))
  }

  return NextResponse.json({
    bots: filteredBots,
    total: filteredBots.length,
    categories: ['all', ...Array.from(new Set(bots.map(b => b.category)))]
  })
}

export async function POST(request: Request) {
  try {
    const { botId, userId, paymentMethod, licenseType } = await request.json()
    
    const bot = bots.find(b => b.id === botId)
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 })
    }

    const purchaseId = `PUR-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const licenseKey = generateLicenseKey(botId, userId, Date.now())
    
    const purchase = {
      id: purchaseId,
      botId,
      userId,
      licenseKey,
      licenseType,
      amount: licenseType === 'lifetime' ? bot.price : bot.monthlyRental,
      status: 'completed',
      createdAt: new Date().toISOString(),
      expiresAt: licenseType === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null
    }

    const downloadToken = crypto.randomBytes(32).toString('hex')
    
    return NextResponse.json({
      success: true,
      purchase,
      downloadUrl: `/api/bots/download/${botId}?token=${downloadToken}`,
      licenseKey
    })

  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json({ error: 'Purchase failed' }, { status: 500 })
  }
}

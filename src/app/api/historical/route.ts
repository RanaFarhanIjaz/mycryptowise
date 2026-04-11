import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const interval = searchParams.get('interval') || '1d'
  const limit = parseInt(searchParams.get('limit') || '30')

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    // Handle Gold and Silver separately
    if (symbol === 'GOLD' || symbol === 'XAU') {
      // Gold doesn't have historical on Binance, use fallback or external API
      return NextResponse.json({
        labels: [],
        prices: [],
        message: 'Gold historical data from external API coming soon'
      })
    }

    if (symbol === 'SILVER' || symbol === 'XAG') {
      return NextResponse.json({
        labels: [],
        prices: [],
        message: 'Silver historical data from external API coming soon'
      })
    }

    // For crypto, use Binance API
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`
    )
    
    const data = await response.json()
    
    const labels = data.map((item: any) => {
      const date = new Date(item[0])
      return `${date.getMonth() + 1}/${date.getDate()}`
    })
    
    const prices = data.map((item: any) => parseFloat(item[4]))
    
    return NextResponse.json({ labels, prices })
    
  } catch (error) {
    console.error('Historical data error:', error)
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 })
  }
}
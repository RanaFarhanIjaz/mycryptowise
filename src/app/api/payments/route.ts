import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { botId, amount, paymentMethod, userDetails } = await request.json()
    
    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const success = Math.random() > 0.1
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Payment failed. Please try again.'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      paymentId,
      transactionId: `TXN-${Date.now()}`,
      amount,
      currency: 'USD',
      status: 'completed',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}

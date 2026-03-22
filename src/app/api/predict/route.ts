import { NextResponse } from 'next/server'
import { getLivePrice } from '@/lib/api/live-prices'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    const { symbol = 'BTC' } = await request.json()
    
    console.log(`ðŸ”® Predicting ${symbol} with XGBoost...`)
    
    // Get LIVE current price
    const currentPrice = await getLivePrice(symbol)
    console.log(`ðŸ“ Live price: $${currentPrice}`)
    
    // Use XGBoost-only predictor
    const pythonScript = path.join(process.cwd(), 'src/lib/ml/predict_xgb.py')
    const { stdout, stderr } = await execAsync(
      `python3 "${pythonScript}" --symbol ${symbol} --price ${currentPrice}`
    )
    
    if (stderr) {
      console.error('Python stderr:', stderr)
    }
    
    const result = JSON.parse(stdout)
    
    if (!result.success) {
      throw new Error(result.error || 'Prediction failed')
    }
    
    // Return response
    return NextResponse.json({
      success: true,
      data: {
        current: {
          price: currentPrice,
          timestamp: new Date().toISOString(),
          source: 'Binance'
        },
        prediction: result.prediction,
        support: result.support,
        resistance: result.resistance
      }
    })
    
  } catch (error) {
    console.error('Prediction API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate prediction'
    }, { status: 500 })
  }
}

export async function GET() {
  // Return XGBoost metrics
  return NextResponse.json({
    xgboost: {
      accuracy: 0.906,
      mse: 0.000833,
      mae: 0.020294,
      lastTrained: '2026-03-01'
    }
  })
}


import { NextResponse } from 'next/server'
import { getLivePrice } from '@/lib/api/live-prices'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execAsync = promisify(exec)

// Prioritize Python interpreters that include Nix-managed packages on Railway.
async function runPythonScript(script: string, symbol: string, price: number, modelType: string) {
  const pythonCommands = [
    '/root/.nix-profile/bin/python3',
    '/nix/var/nix/profiles/default/bin/python3',
    'python3',
    'python'
  ];
  let lastError: Error | null = null;
  
  for (const pythonCmd of pythonCommands) {
    try {
      console.log(`Trying with: ${pythonCmd}`);
      const { stdout, stderr } = await execAsync(
        `${pythonCmd} "${script}" --symbol ${symbol} --price ${price} --model ${modelType}`,
        { timeout: 30000 }
      );
      
      if (stderr && !stderr.includes('Universal ML Predictor')) {
        console.log(`⚠️ Stderr from ${pythonCmd}: ${stderr.substring(0, 200)}`);
      }
      
      console.log(`✅ Success with: ${pythonCmd}`);
      return { stdout, stderr };
      
    } catch (error: any) {
      console.log(`❌ Failed with ${pythonCmd}: ${error.message}`);
      lastError = error;
    }
  }
  
  throw lastError || new Error('No python command found');
}

export async function POST(request: Request) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { symbol = 'BTC', modelType = 'ensemble' } = body
    
    console.log('\n' + '='.repeat(70))
    console.log(`🔮 PREDICTION REQUEST [${new Date().toLocaleTimeString()}]`)
    console.log('='.repeat(70))
    console.log(`📊 Symbol: ${symbol} | 🤖 Model: ${modelType}`)
    
    // Validate symbol
    if (!symbol) {
      return NextResponse.json({
        success: false,
        error: 'Symbol is required'
      }, { status: 400 })
    }
    
    // Get live price
    let currentPrice: number
    try {
      currentPrice = await getLivePrice(symbol)
      console.log(`💰 Live Price: $${currentPrice.toFixed(4)}`)
    } catch (priceError) {
      console.error(`Failed to get price for ${symbol}:`, priceError)
      return NextResponse.json({
        success: false,
        error: `Could not fetch price for ${symbol}. Please try again.`
      }, { status: 400 })
    }
    
    // Universal predictor script
    const script = path.join(process.cwd(), 'src/lib/ml/predict_universal.py')
    
    try {
      // Try python3 first, then fallback to python
      const { stdout, stderr } = await runPythonScript(script, symbol, currentPrice, modelType)
      
      const result = JSON.parse(stdout)
      
      if (!result.success) {
        throw new Error(result.error || 'Prediction failed')
      }
      
      const totalTime = Date.now() - startTime
      
      console.log(`\n✅ ${result.prediction.model.toUpperCase()} PREDICTION (${totalTime}ms)`)
      console.log(`   Predicted: $${result.prediction.predicted_price.toFixed(4)} (${result.prediction.predicted_change > 0 ? '+' : ''}${result.prediction.predicted_change.toFixed(2)}%)`)
      console.log(`   Confidence: ${(result.prediction.confidence * 100).toFixed(1)}%`)
      console.log(`   Direction: ${result.prediction.direction}`)
      console.log('='.repeat(70) + '\n')
      
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
      
    } catch (pythonError: any) {
      console.error('Python error:', pythonError.message)
      
      // Fallback prediction
      const fallbackChange = (Math.random() - 0.48) * 0.03
      const fallbackPrice = currentPrice * (1 + fallbackChange)
      
      return NextResponse.json({
        success: true,
        data: {
          current: {
            price: currentPrice,
            timestamp: new Date().toISOString(),
            source: 'Binance'
          },
          prediction: {
            current_price: currentPrice,
            predicted_price: fallbackPrice,
            predicted_change: fallbackChange * 100,
            confidence: 0.65,
            direction: fallbackChange > 0 ? 'up' : 'down',
            model: 'fallback',
            data_source: 'FALLBACK'
          },
          support: currentPrice * 0.98,
          resistance: currentPrice * 1.02
        }
      })
    }
    
  } catch (error) {
    console.error('Prediction API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate prediction'
    }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const modelsDir = path.join(process.cwd(), 'src/lib/ml/models')
    
    // Get all symbols from directories
    const symbols = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB']
    const metrics: any = {}
    
    for (const symbol of symbols) {
      metrics[symbol] = {}
      
      // LSTM metrics
      try {
        const lstmFile = path.join(modelsDir, 'lstm', `${symbol}_metrics.json`)
        const lstmData = await fs.readFile(lstmFile, 'utf-8')
        metrics[symbol].lstm = JSON.parse(lstmData)
      } catch (e) {}
      
      // XGBoost metrics
      try {
        const xgbFile = path.join(modelsDir, 'xgboost', `${symbol}_metrics.json`)
        const xgbData = await fs.readFile(xgbFile, 'utf-8')
        metrics[symbol].xgboost = JSON.parse(xgbData)
      } catch (e) {}
      
      // Ensemble (average)
      if (metrics[symbol].lstm && metrics[symbol].xgboost) {
        metrics[symbol].ensemble = {
          accuracy: (metrics[symbol].lstm.direction_accuracy + metrics[symbol].xgboost.direction_accuracy) / 2,
          mse: (metrics[symbol].lstm.mse + metrics[symbol].xgboost.mse) / 2,
          mae: (metrics[symbol].lstm.mae + metrics[symbol].xgboost.mae) / 2
        }
      }
    }
    
    return NextResponse.json(metrics)
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load metrics' }, { status: 500 })
  }
}
"""
Step 1b: Process Raw Data - Add Technical Indicators
Run: python process_data.py
"""

import pandas as pd
import numpy as np
import os

class DataProcessor:
    def __init__(self):
        self.raw_dir = os.path.join(os.path.dirname(__file__), 'raw')
        self.processed_dir = os.path.join(os.path.dirname(__file__), 'processed')
        os.makedirs(self.processed_dir, exist_ok=True)
    
    def add_technical_indicators(self, df):
        """Add all technical indicators needed for training"""
        df = df.copy()
        
        # Moving averages
        df['sma_7'] = df['close'].rolling(window=7).mean()
        df['sma_25'] = df['close'].rolling(window=25).mean()
        df['ema_12'] = df['close'].ewm(span=12).mean()
        df['ema_26'] = df['close'].ewm(span=26).mean()
        
        # RSI
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        # MACD
        df['macd'] = df['ema_12'] - df['ema_26']
        df['macd_signal'] = df['macd'].ewm(span=9).mean()
        df['macd_hist'] = df['macd'] - df['macd_signal']
        
        # Bollinger Bands
        df['bb_middle'] = df['close'].rolling(window=20).mean()
        bb_std = df['close'].rolling(window=20).std()
        df['bb_upper'] = df['bb_middle'] + (bb_std * 2)
        df['bb_lower'] = df['bb_middle'] - (bb_std * 2)
        df['bb_position'] = (df['close'] - df['bb_lower']) / (df['bb_upper'] - df['bb_lower'])
        
        # ATR
        df['tr'] = np.maximum(
            df['high'] - df['low'],
            np.maximum(
                abs(df['high'] - df['close'].shift()),
                abs(df['low'] - df['close'].shift())
            )
        )
        df['atr'] = df['tr'].rolling(window=14).mean()
        df['atr_percent'] = (df['atr'] / df['close']) * 100
        
        # Volume indicators
        df['volume_sma'] = df['volume'].rolling(window=20).mean()
        df['volume_ratio'] = df['volume'] / df['volume_sma']
        
        # Price patterns
        df['price_change'] = df['close'].pct_change()
        df['price_range'] = (df['high'] - df['low']) / df['close']
        df['volatility'] = df['price_change'].rolling(window=20).std() * np.sqrt(365)
        
        # Support/Resistance
        df['resistance_20'] = df['high'].rolling(window=20).max()
        df['support_20'] = df['low'].rolling(window=20).min()
        df['dist_to_resistance'] = (df['resistance_20'] - df['close']) / df['close']
        df['dist_to_support'] = (df['close'] - df['support_20']) / df['close']
        
        # Momentum
        df['momentum_1d'] = df['close'].pct_change(1)
        df['momentum_5d'] = df['close'].pct_change(5)
        df['momentum_20d'] = df['close'].pct_change(20)
        
        # Target (next day's return)
        df['target_return'] = df['close'].pct_change(-1).shift(-1)
        df['target_direction'] = (df['target_return'] > 0).astype(int)
        
        return df
    
    def process_all(self):
        """Process all raw files"""
        for file in os.listdir(self.raw_dir):
            if file.endswith('_raw.csv'):
                symbol = file.replace('_raw.csv', '')
                print(f"\n🔄 Processing {symbol}...")
                
                # Load raw data
                df = pd.read_csv(os.path.join(self.raw_dir, file))
                df['timestamp'] = pd.to_datetime(df['timestamp'])
                
                # Add indicators
                df = self.add_technical_indicators(df)
                
                # Drop NaN rows
                df = df.dropna()
                
                # Save processed
                out_file = os.path.join(self.processed_dir, f'{symbol}_processed.csv')
                df.to_csv(out_file, index=False)
                print(f"✅ Saved {len(df)} rows to {out_file}")

if __name__ == "__main__":
    processor = DataProcessor()
    processor.process_all()
    print("\n✅ All data processed successfully!")
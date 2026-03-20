"""
Step 1: Fetch Real Data from Binance
Run: python fetch_real_data.py
"""

import requests
import pandas as pd
import os
from datetime import datetime, timedelta
import time

class RealDataFetcher:
    def __init__(self):
        self.base_url = "https://api.binance.com/api/v3"
        self.symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT']
        self.data_dir = os.path.join(os.path.dirname(__file__), 'raw')
        
        # Create directory if not exists
        os.makedirs(self.data_dir, exist_ok=True)
    
    def fetch_klines(self, symbol, interval='1d', limit=1000):
        """Fetch candlestick data from Binance"""
        endpoint = f"{self.base_url}/klines"
        params = {
            'symbol': symbol,
            'interval': interval,
            'limit': limit
        }
        
        response = requests.get(endpoint, params=params)
        data = response.json()
        
        df = pd.DataFrame(data, columns=[
            'timestamp', 'open', 'high', 'low', 'close', 'volume',
            'close_time', 'quote_volume', 'trades', 'taker_base', 'taker_quote', 'ignore'
        ])
        
        # Convert to proper format
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        df['open'] = df['open'].astype(float)
        df['high'] = df['high'].astype(float)
        df['low'] = df['low'].astype(float)
        df['close'] = df['close'].astype(float)
        df['volume'] = df['volume'].astype(float)
        df['symbol'] = symbol.replace('USDT', '')
        
        return df[['timestamp', 'symbol', 'open', 'high', 'low', 'close', 'volume']]
    
    def fetch_historical(self, symbol, interval='1d', years=3):
        """Fetch multiple years of historical data"""
        all_data = []
        end_date = datetime.now()
        
        # Binance max limit is 1000 candles per request
        # For 3 years daily data = ~1095 candles
        for i in range(3):  # 3 requests of 500 days each
            start_date = end_date - timedelta(days=500)
            
            print(f"Fetching {symbol} from {start_date} to {end_date}")
            
            params = {
                'symbol': symbol,
                'interval': interval,
                'startTime': int(start_date.timestamp() * 1000),
                'endTime': int(end_date.timestamp() * 1000),
                'limit': 1000
            }
            
            response = requests.get(f"{self.base_url}/klines", params=params)
            data = response.json()
            
            if len(data) > 0:
                all_data.extend(data)
            
            end_date = start_date - timedelta(days=1)
            time.sleep(1)  # Rate limiting
        
        # Convert to DataFrame
        df = pd.DataFrame(all_data, columns=[
            'timestamp', 'open', 'high', 'low', 'close', 'volume',
            'close_time', 'quote_volume', 'trades', 'taker_base', 'taker_quote', 'ignore'
        ])
        
        df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
        df['open'] = df['open'].astype(float)
        df['high'] = df['high'].astype(float)
        df['low'] = df['low'].astype(float)
        df['close'] = df['close'].astype(float)
        df['volume'] = df['volume'].astype(float)
        df['symbol'] = symbol.replace('USDT', '')
        
        df = df.sort_values('timestamp')
        
        # Save to CSV
        filename = f"{self.data_dir}/{symbol.replace('USDT', '')}_raw.csv"
        df.to_csv(filename, index=False)
        print(f"✅ Saved {len(df)} rows to {filename}")
        
        return df
    
    def fetch_all(self):
        """Fetch data for all symbols"""
        for symbol in self.symbols:
            print(f"\n📥 Fetching {symbol}...")
            df = self.fetch_historical(symbol, years=3)
            print(f"   Got {len(df)} candles")

if __name__ == "__main__":
    fetcher = RealDataFetcher()
    fetcher.fetch_all()
    print("\n✅ All data fetched successfully!")
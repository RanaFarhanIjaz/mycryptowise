"""
Step 2: Train Models on Real Data
Run: python train_model.py
"""

import pandas as pd
import numpy as np
import joblib
import os
import json
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score
import xgboost as xgb
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, Input
from tensorflow.keras.callbacks import EarlyStopping

class ModelTrainer:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_dir = os.path.join(self.base_dir, 'data', 'processed')
        self.models_dir = os.path.join(self.base_dir, 'models')
        
        # Create directories
        os.makedirs(os.path.join(self.models_dir, 'lstm'), exist_ok=True)
        os.makedirs(os.path.join(self.models_dir, 'xgboost'), exist_ok=True)
        os.makedirs(os.path.join(self.models_dir, 'scalers'), exist_ok=True)
    
    def load_data(self, symbol):
        """Load processed data for a symbol"""
        file_path = os.path.join(self.data_dir, f'{symbol}_processed.csv')
        if not os.path.exists(file_path):
            print(f"❌ No data for {symbol}")
            return None
        
        df = pd.read_csv(file_path)
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        print(f"✅ Loaded {len(df)} rows for {symbol}")
        return df
    
    def prepare_features(self, df):
        """Prepare features for training"""
        feature_cols = [
            'open', 'high', 'low', 'close', 'volume',
            'sma_7', 'sma_25', 'ema_12', 'ema_26',
            'rsi', 'macd', 'bb_position', 'atr_percent',
            'volume_ratio', 'price_range', 'volatility',
            'momentum_1d', 'momentum_5d', 'dist_to_resistance',
            'dist_to_support'
        ]
        
        X = df[feature_cols].values
        y = df['target_return'].values
        
        return X, y, feature_cols
    
    def train_test_split(self, X, y, test_size=0.2):
        """Split data chronologically"""
        split = int(len(X) * (1 - test_size))
        return X[:split], X[split:], y[:split], y[split:]
    
    def train_lstm(self, symbol):
        """Train LSTM model"""
        print(f"\n🧠 Training LSTM for {symbol}...")
        
        # Load data
        df = self.load_data(symbol)
        if df is None:
            return None
        
        X, y, features = self.prepare_features(df)
        
        # Scale features
        scaler_X = MinMaxScaler()
        scaler_y = MinMaxScaler()
        
        X_scaled = scaler_X.fit_transform(X)
        y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).flatten()
        
        # Create sequences for LSTM
        seq_length = 30
        X_seq, y_seq = [], []
        for i in range(len(X_scaled) - seq_length):
            X_seq.append(X_scaled[i:i+seq_length])
            y_seq.append(y_scaled[i+seq_length])
        
        X_seq = np.array(X_seq)
        y_seq = np.array(y_seq)
        
        # Split
        split = int(len(X_seq) * 0.8)
        X_train, X_test = X_seq[:split], X_seq[split:]
        y_train, y_test = y_seq[:split], y_seq[split:]
        
        print(f"Train: {len(X_train)}, Test: {len(X_test)}")
        
        # Build model
        model = Sequential([
            Input(shape=(seq_length, X.shape[1])),
            LSTM(128, return_sequences=True),
            Dropout(0.2),
            LSTM(64, return_sequences=True),
            Dropout(0.2),
            LSTM(32),
            Dropout(0.2),
            Dense(16, activation='relu'),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        
        # Train
        early_stop = EarlyStopping(patience=10, restore_best_weights=True)
        
        history = model.fit(
            X_train, y_train,
            validation_data=(X_test, y_test),
            epochs=50,
            batch_size=32,
            callbacks=[early_stop],
            verbose=1
        )
        
        # Save model and scalers
        model.save(os.path.join(self.models_dir, 'lstm', f'{symbol}_model.h5'))
        joblib.dump(scaler_X, os.path.join(self.models_dir, 'scalers', f'{symbol}_X_scaler.pkl'))
        joblib.dump(scaler_y, os.path.join(self.models_dir, 'scalers', f'{symbol}_y_scaler.pkl'))
        
        # Evaluate
        y_pred_scaled = model.predict(X_test)
        y_pred = scaler_y.inverse_transform(y_pred_scaled)
        y_actual = scaler_y.inverse_transform(y_test.reshape(-1, 1))
        
        mse = mean_squared_error(y_actual, y_pred)
        mae = mean_absolute_error(y_actual, y_pred)
        r2 = r2_score(y_actual, y_pred)
        
        # Direction accuracy
        pred_dir = (y_pred.flatten() > 0).astype(int)
        actual_dir = (y_actual.flatten() > 0).astype(int)
        dir_acc = accuracy_score(actual_dir, pred_dir)
        
        # Save metrics
        metrics = {
            'symbol': symbol,
            'model': 'lstm',
            'mse': float(mse),
            'mae': float(mae),
            'r2': float(r2),
            'direction_accuracy': float(dir_acc),
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'features': features,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(os.path.join(self.models_dir, 'lstm', f'{symbol}_metrics.json'), 'w') as f:
            json.dump(metrics, f, indent=2)
        
        print(f"\n📊 LSTM Results for {symbol}:")
        print(f"   MSE: {mse:.6f}")
        print(f"   MAE: {mae:.6f}")
        print(f"   R2: {r2:.4f}")
        print(f"   Direction Accuracy: {dir_acc:.2%}")
        
        return metrics
    
    def train_xgboost(self, symbol):
        """Train XGBoost model"""
        print(f"\n🌲 Training XGBoost for {symbol}...")
        
        df = self.load_data(symbol)
        if df is None:
            return None
        
        X, y, features = self.prepare_features(df)
        
        # Remove last row (no target)
        X = X[:-1]
        y = y[:-1]
        
        # Split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, shuffle=False
        )
        
        # Train
        model = xgb.XGBRegressor(
            n_estimators=200,
            max_depth=7,
            learning_rate=0.05,
            random_state=42
        )
        
        model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
        
        # Save model
        model.save_model(os.path.join(self.models_dir, 'xgboost', f'{symbol}_model.json'))
        
        # Evaluate
        y_pred = model.predict(X_test)
        
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        # Direction accuracy
        pred_dir = (y_pred > 0).astype(int)
        actual_dir = (y_test > 0).astype(int)
        dir_acc = accuracy_score(actual_dir, pred_dir)
        
        # Feature importance
        importance = dict(zip(features, model.feature_importances_))
        
        metrics = {
            'symbol': symbol,
            'model': 'xgboost',
            'mse': float(mse),
            'mae': float(mae),
            'r2': float(r2),
            'direction_accuracy': float(dir_acc),
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'features': features,
            'feature_importance': {k: float(v) for k, v in importance.items()},
            'timestamp': datetime.now().isoformat()
        }
        
        with open(os.path.join(self.models_dir, 'xgboost', f'{symbol}_metrics.json'), 'w') as f:
            json.dump(metrics, f, indent=2)
        
        print(f"\n📊 XGBoost Results for {symbol}:")
        print(f"   MSE: {mse:.6f}")
        print(f"   MAE: {mae:.6f}")
        print(f"   R2: {r2:.4f}")
        print(f"   Direction Accuracy: {dir_acc:.2%}")
        
        return metrics
    
    def train_all(self, symbols=['BTC', 'ETH', 'SOL', 'XRP']):
        """Train models for all symbols"""
        results = {}
        
        for symbol in symbols:
            print(f"\n{'='*60}")
            print(f"Training {symbol}")
            print('='*60)
            
            lstm_metrics = self.train_lstm(symbol)
            xgb_metrics = self.train_xgboost(symbol)
            
            if lstm_metrics:
                results[f'{symbol}_lstm'] = lstm_metrics
            if xgb_metrics:
                results[f'{symbol}_xgboost'] = xgb_metrics
        
        # Save summary
        summary_file = os.path.join(self.models_dir, 'training_summary.json')
        with open(summary_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n✅ Training complete! Summary saved to {summary_file}")
        return results

if __name__ == "__main__":
    trainer = ModelTrainer()
    
    # Train on all symbols
    symbols = ['BTC', 'ETH', 'SOL', 'XRP']
    results = trainer.train_all(symbols)
    
    # Print summary
    print("\n" + "="*80)
    print("TRAINING SUMMARY")
    print("="*80)
    print(f"{'Symbol':8} {'Model':10} {'MSE':12} {'MAE':12} {'Dir Acc':10}")
    print("-"*80)
    
    for key, metrics in results.items():
        symbol, model = key.split('_')
        print(f"{symbol:8} {model:10} {metrics['mse']:.6f} {metrics['mae']:.6f} {metrics['direction_accuracy']:.2%}")
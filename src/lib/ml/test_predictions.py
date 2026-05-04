#!/usr/bin/env python3
"""
Test script to verify all symbol predictions and report whether they use:
1. Trained model weights (LSTM/XGBoost/Transformer)
2. Fallback/heuristic response (when model files missing)
3. CSV-based momentum prediction
"""

import os
import sys
import json
import subprocess
from pathlib import Path

# Test symbols with realistic prices
TEST_SYMBOLS = {
    'BTC': 52000.0,
    'ETH': 3200.0,
    'SOL': 120.0,
    'XRP': 0.45,
    'BNB': 300.0,
    'GOLD': 2100.0,
    'SILVER': 32.5,
}

# Models to test
MODELS = ['lstm', 'ensemble', 'xgboost', 'transformer']

# Path checks
ML_DIR = Path(__file__).parent
MODELS_DIR = ML_DIR / 'models'


def check_model_files(symbol: str, model_type: str) -> dict:
    """Check if trained model files exist for a symbol."""
    files = {
        'lstm': [
            MODELS_DIR / 'lstm' / f'{symbol}_model.h5',
            MODELS_DIR / 'scalers' / f'{symbol}_X_scaler.pkl',
            MODELS_DIR / 'scalers' / f'{symbol}_y_scaler.pkl',
        ],
        'xgboost': [
            MODELS_DIR / 'xgboost' / f'{symbol}_model.json',
        ],
        'transformer': [
            MODELS_DIR / 'transformer' / f'{symbol}_model.h5',
            MODELS_DIR / 'scalers' / f'{symbol}_X_scaler.pkl',
            MODELS_DIR / 'scalers' / f'{symbol}_y_scaler.pkl',
        ]
    }
    
    model_files = files.get(model_type, [])
    exists = {str(f.name): f.exists() for f in model_files}
    all_exist = all(exists.values())
    
    return {'all_exist': all_exist, 'files': exists}


def check_data_files(symbol: str) -> dict:
    """Check if CSV data files exist for a symbol."""
    data_dir = ML_DIR / 'data'
    files = {
        'raw_3years': data_dir / f'{symbol}_3years.csv',
        'processed': data_dir / 'processed' / f'{symbol}_processed.csv',
    }
    
    return {fname: f.exists() for fname, f in files.items()}


def test_predict_lstm(symbol: str, price: float) -> tuple[dict, str]:
    """Test predict_lstm.py (lightweight fallback)."""
    script = ML_DIR / 'predict_lstm.py'
    cmd = [sys.executable, str(script), '--symbol', symbol, '--price', str(price)]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            # Parse stdout for JSON (skip stderr messages)
            lines = result.stdout.strip().split('\n')
            json_line = lines[-1]  # Last line should be JSON
            pred = json.loads(json_line)
            return pred, 'SUCCESS'
        else:
            return {}, f'ERROR: {result.stderr[:100]}'
    except Exception as e:
        return {}, f'EXCEPTION: {str(e)[:100]}'


def test_predict_full(symbol: str, price: float, model_type: str) -> tuple[dict, str]:
    """Test predict.py (full ML pipeline)."""
    script = ML_DIR / 'predict.py'
    cmd = [sys.executable, str(script), '--symbol', symbol, '--price', str(price), '--model', model_type]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')
            json_line = lines[-1]
            pred = json.loads(json_line)
            return pred, 'SUCCESS'
        else:
            stderr_msg = result.stderr[:150] if result.stderr else 'No error'
            return {}, f'ERROR: {stderr_msg}'
    except subprocess.TimeoutExpired:
        return {}, 'TIMEOUT'
    except Exception as e:
        return {}, f'EXCEPTION: {str(e)[:100]}'


def determine_prediction_source(pred: dict, model_files_exist: dict, data_files_exist: dict, model_type: str) -> str:
    """Determine whether prediction came from trained model, CSV momentum, or heuristic."""
    if not pred or 'prediction' not in pred:
        return 'UNKNOWN'
    
    prediction = pred['prediction']
    model_field = prediction.get('model', '').lower()
    data_source = prediction.get('data_source', '').lower()
    
    # Check which path was taken based on model field and data_source
    if 'trained' in data_source or 'ml model' in data_source:
        return '✓ TRAINED MODEL'
    elif model_field == 'fallback' or 'fallback' in data_source:
        return '✓ FALLBACK (no model files)'
    elif model_field == 'heuristic' or 'heuristic' in data_source:
        return '✓ HEURISTIC (no data)'
    elif model_field in ['lstm_momentum', 'lstm_fallback']:
        return '✓ CSV MOMENTUM'
    elif model_field in ['lstm', 'xgboost', 'transformer', 'ensemble']:
        # Check if files exist to infer
        if all(model_files_exist.get(m, False) for m in [model_type]):
            return '✓ TRAINED MODEL'
        elif data_files_exist.get('raw_3years', False):
            return '✓ CSV MOMENTUM'
        else:
            return '✓ HEURISTIC'
    
    return '? UNCLEAR'


def print_header(title: str):
    """Print section header."""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}")


def print_row(symbol: str, price: float, model: str, status: str, source: str, pred_price: float = 0, conf: float = 0):
    """Print a test result row."""
    price_display = f"${price:>10.2f}" if symbol not in ['XRP'] else f"${price:>10.4f}"
    pred_display = f"${pred_price:>10.2f}" if pred_price and symbol not in ['XRP'] else f"${pred_price:>10.4f}" if pred_price else "  N/A"
    conf_display = f"{conf*100:>6.1f}%" if conf else "  N/A"
    
    print(f"  {symbol:8} {model:12} {price_display}  →  {pred_display}  {conf_display}  {status:20}  {source}")


def main():
    print_header("🔬 SYMBOL PREDICTION MODEL SOURCE TEST")
    print("\nTesting which prediction path each symbol uses:\n")
    
    # Test predict_lstm.py (fallback path)
    print_header("PHASE 1: Lightweight Fallback Predictor (predict_lstm.py)")
    print("  Symbol    Model        Current Price  → Predicted Price  Confidence  Status                Source")
    print("  " + "-"*76)
    
    for symbol, price in TEST_SYMBOLS.items():
        pred, status = test_predict_lstm(symbol, price)
        
        if status == 'SUCCESS' and pred.get('success'):
            p = pred['prediction']
            pred_price = p.get('predicted_price', 0)
            conf = p.get('confidence', 0)
            model_used = p.get('model', '?')
            source = determine_prediction_source(pred, {}, {}, 'lstm')
            print_row(symbol, price, model_used, status, source, pred_price, conf)
        else:
            print_row(symbol, price, 'lstm', status, '✗ FAILED')
    
    # Test predict.py with different models
    print_header("PHASE 2: Full ML Pipeline (predict.py)")
    
    for model_type in MODELS:
        print(f"\n  Model: {model_type.upper()}")
        print("  Symbol    Model        Current Price  → Predicted Price  Confidence  Status                Source")
        print("  " + "-"*76)
        
        for symbol, price in TEST_SYMBOLS.items():
            # Check what files exist
            model_files = check_model_files(symbol, model_type)
            data_files = check_data_files(symbol)
            
            pred, status = test_predict_full(symbol, price, model_type)
            
            if status == 'SUCCESS' and pred.get('success'):
                p = pred['prediction']
                pred_price = p.get('predicted_price', 0)
                conf = p.get('confidence', 0)
                model_used = p.get('model', '?')
                source = determine_prediction_source(pred, 
                                                     {model_type: model_files['all_exist']}, 
                                                     data_files,
                                                     model_type)
                print_row(symbol, price, model_used, status, source, pred_price, conf)
            else:
                print_row(symbol, price, model_type, status, '✗ FAILED')
    
    # Summary of available artifacts
    print_header("📊 ARTIFACT INVENTORY")
    
    print("\n  LSTM Models Available:")
    for symbol in TEST_SYMBOLS.keys():
        model_file = MODELS_DIR / 'lstm' / f'{symbol}_model.h5'
        exists = "✓" if model_file.exists() else "✗"
        print(f"    {exists} {symbol}")
    
    print("\n  XGBoost Models Available:")
    for symbol in TEST_SYMBOLS.keys():
        model_file = MODELS_DIR / 'xgboost' / f'{symbol}_model.json'
        exists = "✓" if model_file.exists() else "✗"
        print(f"    {exists} {symbol}")
    
    print("\n  Data Files Available (3-year CSV):")
    for symbol in TEST_SYMBOLS.keys():
        data_file = ML_DIR / 'data' / f'{symbol}_3years.csv'
        exists = "✓" if data_file.exists() else "✗"
        print(f"    {exists} {symbol}")
    
    print_header("✅ TEST COMPLETE")
    print()


if __name__ == '__main__':
    main()

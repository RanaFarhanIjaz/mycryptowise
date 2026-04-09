//+------------------------------------------------------------------+
//|                                                ScalperPro.mq5    |
//|                                    Copyright 2024, CryptoWise    |
//|                                      https://cryptowise.com      |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, CryptoWise"
#property link      "https://cryptowise.com"
#property version   "1.00"

input double   LotSize = 0.01;
input int      TakeProfit = 30;
input int      StopLoss = 20;
input int      MagicNumber = 20241001;
input string   LicenseKey = "";

int OnInit()
{
    if(StringLen(LicenseKey) < 10) { Print("Invalid License! Buy at cryptowise.com"); return INIT_FAILED; }
    Print("ScalperPro Activated - CryptoWise");
    return INIT_SUCCEEDED;
}

void OnTick()
{
    static datetime lastBar = 0;
    if(lastBar == Time[0]) return;
    lastBar = Time[0];
    
    double maFast = iMA(Symbol(), PERIOD_M5, 5, 0, MODE_SMA, PRICE_CLOSE, 1);
    double maSlow = iMA(Symbol(), PERIOD_M5, 20, 0, MODE_SMA, PRICE_CLOSE, 1);
    double rsi = iRSI(Symbol(), PERIOD_M5, 14, PRICE_CLOSE, 1);
    
    if(PositionSelect(Symbol())) return;
    
    if(maFast > maSlow && rsi > 30 && rsi < 60)
    {
        double ask = SymbolInfoDouble(Symbol(), SYMBOL_ASK);
        OrderSend(Symbol(), OP_BUY, LotSize, ask, 10, ask - StopLoss*Point*10, ask + TakeProfit*Point*10, "ScalperPro", MagicNumber);
    }
    else if(maFast < maSlow && rsi < 70 && rsi > 40)
    {
        double bid = SymbolInfoDouble(Symbol(), SYMBOL_BID);
        OrderSend(Symbol(), OP_SELL, LotSize, bid, 10, bid + StopLoss*Point*10, bid - TakeProfit*Point*10, "ScalperPro", MagicNumber);
    }
    
    Comment("ScalperPro Active\nCryptoWise.com");
}

//+------------------------------------------------------------------+
//|                                              AIPredictor.mq5     |
//|                                    Copyright 2024, CryptoWise    |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, CryptoWise"
#property version   "1.00"

input double   LotSize = 0.01;
input int      TakeProfit = 60;
input int      StopLoss = 35;
input int      MagicNumber = 20241004;
input string   LicenseKey = "";

int OnInit()
{
    if(StringLen(LicenseKey) < 10) { Print("Invalid License! Buy at cryptowise.com"); return INIT_FAILED; }
    Print("AIPredictor Activated - CryptoWise");
    return INIT_SUCCEEDED;
}

void OnTick()
{
    static datetime lastBar = 0;
    if(lastBar == Time[0]) return;
    lastBar = Time[0];
    
    double ma50 = iMA(Symbol(), PERIOD_H1, 50, 0, MODE_SMA, PRICE_CLOSE, 1);
    double ma200 = iMA(Symbol(), PERIOD_H1, 200, 0, MODE_SMA, PRICE_CLOSE, 1);
    double macd = iMACD(Symbol(), PERIOD_H1, 12, 26, 9, PRICE_CLOSE, MODE_MAIN, 1);
    
    if(PositionSelect(Symbol())) return;
    
    if(ma50 > ma200 && macd > 0)
    {
        double ask = SymbolInfoDouble(Symbol(), SYMBOL_ASK);
        OrderSend(Symbol(), OP_BUY, LotSize, ask, 10, ask - StopLoss*Point*10, ask + TakeProfit*Point*10, "AIPredictor", MagicNumber);
    }
    else if(ma50 < ma200 && macd < 0)
    {
        double bid = SymbolInfoDouble(Symbol(), SYMBOL_BID);
        OrderSend(Symbol(), OP_SELL, LotSize, bid, 10, bid + StopLoss*Point*10, bid - TakeProfit*Point*10, "AIPredictor", MagicNumber);
    }
    
    Comment("AIPredictor Active\nAI Trading\nCryptoWise.com");
}

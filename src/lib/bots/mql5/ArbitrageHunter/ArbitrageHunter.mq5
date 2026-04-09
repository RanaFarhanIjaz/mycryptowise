//+------------------------------------------------------------------+
//|                                            ArbitrageHunter.mq5   |
//|                                    Copyright 2024, CryptoWise    |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, CryptoWise"
#property version   "1.00"

input double   LotSize = 0.01;
input int      TakeProfit = 50;
input int      StopLoss = 30;
input int      MagicNumber = 20241002;
input string   LicenseKey = "";

int OnInit()
{
    if(StringLen(LicenseKey) < 10) { Print("Invalid License! Buy at cryptowise.com"); return INIT_FAILED; }
    Print("ArbitrageHunter Activated - CryptoWise");
    return INIT_SUCCEEDED;
}

void OnTick()
{
    static datetime lastBar = 0;
    if(lastBar == Time[0]) return;
    lastBar = Time[0];
    
    double bbUpper = iBands(Symbol(), PERIOD_M15, 20, 2, 0, PRICE_CLOSE, MODE_UPPER, 1);
    double bbLower = iBands(Symbol(), PERIOD_M15, 20, 2, 0, PRICE_CLOSE, MODE_LOWER, 1);
    double close = iClose(Symbol(), PERIOD_M15, 1);
    
    if(PositionSelect(Symbol())) return;
    
    if(close <= bbLower)
    {
        double ask = SymbolInfoDouble(Symbol(), SYMBOL_ASK);
        OrderSend(Symbol(), OP_BUY, LotSize, ask, 10, ask - StopLoss*Point*10, ask + TakeProfit*Point*10, "ArbitrageHunter", MagicNumber);
    }
    else if(close >= bbUpper)
    {
        double bid = SymbolInfoDouble(Symbol(), SYMBOL_BID);
        OrderSend(Symbol(), OP_SELL, LotSize, bid, 10, bid + StopLoss*Point*10, bid - TakeProfit*Point*10, "ArbitrageHunter", MagicNumber);
    }
    
    Comment("ArbitrageHunter Active\nCryptoWise.com");
}

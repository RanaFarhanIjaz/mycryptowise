//+------------------------------------------------------------------+
//|                                            GridTradingBot.mq5    |
//|                                    Copyright 2024, CryptoWise    |
//+------------------------------------------------------------------+
#property copyright "Copyright 2024, CryptoWise"
#property version   "1.00"

input double   LotSize = 0.01;
input int      GridLevels = 5;
input int      GridDistance = 50;
input int      TakeProfit = 40;
input int      StopLoss = 25;
input int      MagicNumber = 20241003;
input string   LicenseKey = "";

double gridPrices[];
int gridOrders[];

int OnInit()
{
    if(StringLen(LicenseKey) < 10) { Print("Invalid License! Buy at cryptowise.com"); return INIT_FAILED; }
    Print("GridTradingBot Activated - CryptoWise");
    ArrayResize(gridPrices, GridLevels);
    ArrayResize(gridOrders, GridLevels);
    CreateGrid();
    return INIT_SUCCEEDED;
}

void CreateGrid()
{
    double currentPrice = SymbolInfoDouble(Symbol(), SYMBOL_BID);
    for(int i = 0; i < GridLevels; i++)
    {
        gridPrices[i] = currentPrice - (GridDistance * (GridLevels/2 - i) * Point * 10);
        gridOrders[i] = -1;
    }
}

void OnTick()
{
    double bid = SymbolInfoDouble(Symbol(), SYMBOL_BID);
    double ask = SymbolInfoDouble(Symbol(), SYMBOL_ASK);
    
    for(int i = 0; i < GridLevels; i++)
    {
        if(gridOrders[i] == -1 && bid <= gridPrices[i])
        {
            gridOrders[i] = OrderSend(Symbol(), OP_BUY, LotSize, ask, 10, ask - StopLoss*Point*10, ask + TakeProfit*Point*10, "GridBot", MagicNumber);
        }
    }
    
    Comment("GridTradingBot Active\nLevels: ", GridLevels, "\nCryptoWise.com");
}

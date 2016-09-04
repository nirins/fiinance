using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System.Collections.Generic;

namespace fiinance.signalr
{
  [HubName("stockTickerMini")]
  public class StockTickerHub : Hub
  {
    private readonly StockTicker _stockTicker;

    public StockTickerHub() : this(StockTicker.Instance) { }

    public StockTickerHub(StockTicker stockTicker)
    {
      _stockTicker = stockTicker;
    }

    public IEnumerable<RealTimeStockPrice> GetAllStocks()
    {
      return _stockTicker.GetAllStocks();
    }

    public void SetSymbols(List<string> symbols)
    {
      _stockTicker.SetSymbols(symbols);
    }
  }
}
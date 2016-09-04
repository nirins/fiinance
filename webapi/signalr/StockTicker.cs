using fiinance.dataaccess;
using fiinance.model;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace fiinance.signalr
{
  public class StockTicker
  {
    // Singleton instance
    private readonly static Lazy<StockTicker> _instance = new Lazy<StockTicker>(() => new StockTicker(GlobalHost.ConnectionManager.GetHubContext<StockTickerHub>().Clients));

    private readonly ConcurrentDictionary<string, RealTimeStockPrice> _stocks = new ConcurrentDictionary<string, RealTimeStockPrice>();
    private List<string> watch_symbol = new List<string> { "AAPL", "YHOO", "AMZN", "MSFT", "GOOG" };

    private readonly object _updateStockPricesLock = new object();

    //stock can go up or down by a percentage of this factor on each change
    private readonly double _rangePercent = .02;

    private readonly TimeSpan _updateInterval = TimeSpan.FromMilliseconds(500);
    private readonly Random _updateOrNotRandom = new Random();

    private readonly Timer _timer;
    private volatile bool _updatingStockPrices = false;

    private StockTicker(IHubConnectionContext<dynamic> clients)
    {
      Clients = clients;
      _timer = new Timer(UpdateStockPrices, null, _updateInterval, _updateInterval);
      Refresh();
    }

    private void Refresh()
    {
      watch_symbol.Sort();
      var latest_stockprice = new StockModel().GetLatestStockPrices(watch_symbol).ToList();

      _stocks.Clear();
      var stocks = new List<RealTimeStockPrice>();

      foreach (StockPrice p in latest_stockprice)
      {
        stocks.Add(new RealTimeStockPrice { symbol = p.symbol, Price = p.close });
      }

      stocks.ForEach(stock => _stocks.TryAdd(stock.symbol, stock));
    }

    public static StockTicker Instance
    {
      get
      {
        return _instance.Value;
      }
    }

    private IHubConnectionContext<dynamic> Clients
    {
      get;
      set;
    }

    public IEnumerable<RealTimeStockPrice> GetAllStocks()
    {
      return _stocks.Values;
    }

    public void SetSymbols(List<string> symbols)
    {
      watch_symbol = symbols;
      Refresh();
    }

    private void UpdateStockPrices(object state)
    {
      lock (_updateStockPricesLock)
      {
        if (!_updatingStockPrices)
        {
          _updatingStockPrices = true;

          foreach (var stock in _stocks.Values)
          {
            if (TryUpdateStockPrice(stock))
            {
              BroadcastStockPrice(stock);
            }
          }

          _updatingStockPrices = false;
        }
      }
    }

    private bool TryUpdateStockPrice(RealTimeStockPrice stock)
    {
      // Randomly choose whether to update this stock or not
      var r = _updateOrNotRandom.NextDouble();
      if (r > .1)
      {
        return false;
      }

      // Update the stock price by a random factor of the range percent
      var random = new Random((int)Math.Floor(stock.Price));
      var percentChange = random.NextDouble() * _rangePercent;
      var pos = random.NextDouble() > .51;
      var change = Math.Round(stock.Price * (decimal)percentChange, 2);
      change = pos ? change : -change;

      stock.Price += change;
      return true;
    }

    private void BroadcastStockPrice(RealTimeStockPrice stock)
    {
      Clients.All.updateStockPrice(stock);
    }

  }
}
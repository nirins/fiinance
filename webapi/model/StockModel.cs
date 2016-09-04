using fiinance.dataaccess;
using fiinance.entity;
using System.Collections.Generic;
using System;
using System.Linq;

namespace fiinance.model
{
  public class StockModel
  {
    public List<Stock> GetSP500List()
    {
      return new StockRepository().GetSP500List();
    }

    public List<StockPrice> GetStockPrices(string symbol)
    {
      return new StockRepository().GetStockPrices(symbol);
    }

    public List<StockPrice> GetStockPrices(string symbol, int year)
    {
      return new StockRepository().GetStockPrices(symbol, year);
    }

    public string GetLatestDate()
    {
      return new StockRepository().GetLatestDate();
    }

    public List<RichStockPrice> GetLatestStockPrices()
    {
      return new StockRepository().GetLatestStockPrices();
    }

    public List<RichStockPrice> GetLatestStockPrices(List<string> symbols)
    {
      var stock_prices = new StockRepository().GetLatestStockPrices();
      return stock_prices.Where(t => symbols.Contains(t.symbol)).ToList();
    }
  }
}
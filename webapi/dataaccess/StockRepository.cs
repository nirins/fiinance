using fiinance.entity;
using fiinance.utility;
using System;
using System.Collections.Generic;
using System.Linq;

namespace fiinance.dataaccess
{
  public class StockRepository
  {
    public List<Stock> GetSP500List()
    {
      using (var context = new marketdbEntities())
      {
        return context.Stock.ToList();
      }
    }

    public List<StockPrice> GetStockPrices(string symbol)
    {
      using (var context = new marketdbEntities())
      {
        return context.StockPrice.Where(t => t.symbol == symbol).ToList();
      }
    }

    public List<StockPrice> GetStockPrices(string symbol, int year)
    {
      var first = new DateTime(year, 1, 1);
      var last = new DateTime(year, 12, 31);

      using (var context = new marketdbEntities())
      {
        return context.StockPrice.Where(t => t.symbol == symbol && t.date >= first && t.date <=last ).ToList();
      }
    }

    public string GetLatestDate()
    {
      using (var context = new marketdbEntities())
      {
        var date = context.StockPrice.Select(t => t.date).Max();
        return date.ToString("yyyy/MM/dd");
      }
    }

    public List<RichStockPrice> GetLatestStockPrices()
    {
      using (var context = new marketdbEntities())
      {
        DateTime d = context.StockPrice.Select(p => p.date).Max();
        DateTime d1 = context.StockPrice.Select(p => p.date).Where(t => t < d).Max();

        List<StockPrice> temp = context.StockPrice.Where(p => p.date == d || p.date == d1).ToList();

        List<StockPrice> prices = temp.Where(p => p.date == d).OrderBy(p => p.symbol).ToList();
        List<StockPrice> prices1 = temp.Where(p => p.date == d1).OrderBy(p => p.symbol).ToList();

        List<RichStockPrice> r_prices = new List<RichStockPrice>();
        foreach (StockPrice p in prices)
        {
          var r = new RichStockPrice();
          ReflectionCopier.Copy(p, r);

          r.diff = p.close - prices1.Where(p1 => p1.symbol == p.symbol).FirstOrDefault().close;
          r_prices.Add(r);
        }

        return r_prices;
      }
    }
  }
}
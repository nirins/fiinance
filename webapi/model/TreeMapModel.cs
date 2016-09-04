using fiinance.entity;
using System.Collections.Generic;
using System.Linq;

namespace fiinance.model
{
  public class TreeMapModel
  {
    public List<TreeMapElement> GetTreeMap()
    {
      var treemap = new List<TreeMapElement>();
      var stocks = new StockModel().GetSP500List();

      //level 0
      //add root
      treemap.Add(new TreeMapElement() { name = "S&P500", parent = null, volume = 0, change = 0 });

      //level 1
      //add sectors 
      var sectors = stocks.Select(s => s.sector).Distinct().ToList();
      sectors.ForEach(s =>
        treemap.Add(new TreeMapElement() { name = s, parent = "S&P500", volume = 0, change = 0 }));

      //level 2
      //add sub industries
      var sub_industries = stocks.Select(s => s.sub_industry).Distinct().ToList();
      foreach (string sub in sub_industries)
      {
        var temp = stocks.Where(s => s.sub_industry == sub).FirstOrDefault();
        treemap.Add(new TreeMapElement()
        {
          name = sub,
          parent = temp == null ? null : temp.sector,
          volume = 0,
          change = 0
        });
      }

      //level 3
      //add stocks
      var stock_prices = new StockModel().GetLatestStockPrices();
      var symbols = stock_prices.Select(s => s.symbol).Distinct();

      foreach (var s in symbols)
      {
        var stock_price = stock_prices.Where(p => p.symbol == s).First();
        var stock = stocks.Where(t => t.symbol == s).First();

        treemap.Add(new TreeMapElement()
        {
          name = stock.symbol,
          parent = stock.sub_industry,
          volume = (decimal)(stock_price.volume * stock_price.close),
          change = (decimal)stock_price.diff * 100 / stock_price.close,
          company_name = stock.company_name
        });
      }

      return treemap;
    }

  }
}
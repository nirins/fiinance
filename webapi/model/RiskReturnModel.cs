using fiinance.entity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace fiinance.model
{
  public class RiskReturnModel
  {
    public List<RiskReturn> GetRiskReturn(int year, string[] symbols)
    {
      var result = new List<RiskReturn>();
      var stocks = new StockModel().GetSP500List();

      foreach (string symbol in symbols)
      {
        var company_name = stocks.Where(t => t.symbol == symbol).First().company_name;
        var stock_prices = new StockModel().GetStockPrices(symbol, year);

        double last, first, ret = 0, risk = 0, nav = 0;

        if(stock_prices.Count() > 0)
        {
          last = (double)stock_prices.Where(p => p.symbol == symbol).OrderBy(p => p.date).Last().close;
          first = (double)stock_prices.Where(p => p.symbol == symbol).OrderBy(p => p.date).First().close;
          ret = (last - first) / first;
          risk = CalculateRisk(stock_prices.Where(p => p.symbol == symbol).Select(p => (double)p.close).ToList());
          nav = (double)stock_prices.Where(p => p.symbol == symbol).OrderBy(p => p.date).Last().volume;
        }

        result.Add(new RiskReturn() { symbol = symbol, company_name = company_name, ret = ret, risk = risk, nav = nav });
      }

      return result;
    }

    private static double CalculateRisk(List<double> l)
    {
      //Use Standard Deviation as the representation of Risk
      double average = l.Average();
      double sumOfSquaresOfDifferences = l.Select(val => (val - average) * (val - average)).Sum();
      double sd = Math.Sqrt(sumOfSquaresOfDifferences / l.Count());
      return sd;
    }
  }
}
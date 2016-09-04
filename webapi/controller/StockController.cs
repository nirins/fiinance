using fiinance.dataaccess;
using fiinance.model;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace fiinance.controllers
{
  public class StockController : ApiController
  {
    [Route("api/stocks/sp500")]
    [HttpGet]
    public List<Stock> GetSP500List()
    {
      return new StockModel().GetSP500List();
    }

    [Route("api/stockprices/{symbol}")]
    [HttpGet]
    public List<StockPrice> GetStockPrices(string symbol)
    {
      return new StockModel().GetStockPrices(symbol);
    }

    [Route("api/stockprices/latestdate")]
    [HttpGet]
    public string GetLatestDate()
    {
      return new StockModel().GetLatestDate();
    }

  }
}
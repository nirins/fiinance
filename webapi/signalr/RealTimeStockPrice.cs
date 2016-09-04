using fiinance.dataaccess;
using System;

namespace fiinance.signalr
{
  public class RealTimeStockPrice : StockPrice
  {
    private decimal _price;

    public decimal Price
    {
      get
      {
        return _price;
      }
      set
      {
        if (_price == value)
        {
          return;
        }

        _price = value;

        if (open == 0)
        {
          open = _price;
        }
      }
    }

    public decimal Change
    {
      get
      {
        return Price - open;
      }
    }

    public double PercentChange
    {
      get
      {
        return (double)Math.Round(Change / Price, 4);
      }
    }
  }
}
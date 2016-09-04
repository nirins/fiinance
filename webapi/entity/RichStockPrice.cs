using fiinance.dataaccess;

namespace fiinance.entity
{
  public class RichStockPrice : StockPrice
  {
    public decimal? diff { get; set; }
  }
}
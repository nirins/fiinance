using fiinance.entity;
using fiinance.model;
using System.Collections.Generic;
using System.Web.Http;

namespace fiinance.controllers
{
  public class RiskReturnController : ApiController
  {
    [Route("api/riskreturn/{year}")]
    [HttpGet]
    public List<RiskReturn> GetTreeMap(int year, [FromUri]string[] selected)
    {
      return new RiskReturnModel().GetRiskReturn(year, selected);
    }
  }
}
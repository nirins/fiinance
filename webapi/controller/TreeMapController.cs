using fiinance.dataaccess;
using fiinance.entity;
using fiinance.model;
using System.Collections.Generic;
using System.Web.Http;

namespace fiinance.controllers
{
  public class TreeMapController : ApiController
  {
    [Route("api/treemap")]
    [HttpGet]
    public List<TreeMapElement> GetTreeMap()
    {
      return new TreeMapModel().GetTreeMap();
    }
  }
}
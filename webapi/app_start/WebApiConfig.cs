using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;

namespace fiinance
{
  public static class WebApiConfig
  {
    public static void Register(HttpConfiguration config)
    {
      var cors_allow_origins = ConfigurationManager.AppSettings.Get("cors_allow_origins");
      var cors = new EnableCorsAttribute(cors_allow_origins, "*", "*");
      config.EnableCors(cors);

      // Web API configuration and services

      // Web API routes
      config.MapHttpAttributeRoutes();

      // Route to index.html
      config.Routes.MapHttpRoute(
          name: "Index",
          routeTemplate: "{id}.html",
          defaults: new { id = "index" });

      config.Routes.MapHttpRoute(
          name: "DefaultApi",
          routeTemplate: "api/{controller}/{id}",
          defaults: new { id = RouteParameter.Optional }
      );
    }
  }
}

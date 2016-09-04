var App = angular.module('myApp', ['ngRoute', 'ngCookies', 'ngSanitize', 'ngGrid', 'ui.bootstrap', 'localytics.directives'])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    redirectTo: '/stockprice'
  })
  .when('/stockprice', {
    templateUrl: 'view/stockprice.html',
    controller: 'stockpriceController'
  })
  .when('/treemap', {
    templateUrl: 'view/treemap.html',
    controller: 'treemapController'
  })
  .when('/riskreturn', {
    templateUrl: 'view/riskreturn.html',
    controller: 'riskreturnController'
  })
  .when('/realtime', {
    templateUrl: 'view/realtime.html',
    controller: 'realtimeController'
  });
})
.controller('mainController', function ($scope, $http, $location, $rootScope, $cookieStore) {
  $scope.getClass = function (path) {
    if ($location.path().substr(0, path.length) == path) {
      return 'active';
    } else {
      return '';
    }
  };
});
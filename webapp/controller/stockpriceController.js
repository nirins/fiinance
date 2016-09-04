angular.module('myApp').controller('stockpriceController', function ($scope, $http, $filter) {
  $scope.GetStocks = function () {
    $http({ method: 'GET', url: WEBAPI + '/api/stocks/sp500' })
    .success(function (data, status) {
      $scope.stocks = data;
    });
  };

  $scope.GetStockPrices = function () {
    $http({ method: 'GET', url: WEBAPI + '/api/stockprices/' + $scope.selected.symbol })
    .success(function (data, status) {
      $scope.stockprices = data;
    });
  };

  $scope.selected = { symbol: 'AAPL' };
  $scope.stocks = [];
  $scope.GetStocks();
  $scope.GetStockPrices();

  $scope.gridOptions = {
    data: 'stockprices',
    columnDefs: [
    {
      field: 'date', displayName: 'Date',
      cellTemplate: '<div style="text-align:center; padding:5px;">{{row.getProperty(col.field) | date:"yyyy/MM/dd"}}</div>'
    },
    {
      field: 'open', displayName: 'Open',
      cellClass: 'text-right'
    },
    {
      field: 'high', displayName: 'High',
      cellClass: 'text-right'
    },
    {
      field: 'low', displayName: 'Low',
      cellClass: 'text-right'
    },
    {
      field: 'close', displayName: 'Close',
      cellClass: 'text-right'
    },
    {
      field: 'volume', displayName: 'Volume',
      cellTemplate: '<div style="text-align:right; padding:5px;">{{row.getProperty(col.field) | number:0}}</div>'
    },
    {
      field: 'adjust_close', displayName: 'Adjust Close',
      cellClass: 'text-right'
    },
    ]
  };

  $scope.$watch('selected', function () {
    var found = false;
    for (var i = 0; i < $scope.stocks.length; i++) {
      if ($scope.stocks[i].symbol == $scope.selected.symbol) {
        found = true;
        break;
      }
    }

    if (found) {
      $scope.GetStockPrices();
    }
  });


});
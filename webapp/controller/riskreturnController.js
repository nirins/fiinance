angular.module('myApp').controller('riskreturnController', function ($scope, $http) {
  $scope.ChangeYear = function (year){
    $scope.year = year;
    $scope.Refresh();
  };

  $scope.$watch('selected_stocks', function () {
    $scope.Refresh();
  });

  $http({ method: 'GET', url: WEBAPI + '/api/stocks/sp500' })
  .success(function (data, status) {
    $scope.stock_list = [];
    data.forEach(function (t) {
      $scope.stock_list.push(t.symbol);
    });
  });

  $scope.Refresh = function () {
    var canvas = document.getElementById('riskreturn');
    while (canvas.hasChildNodes()) {
      canvas.removeChild(canvas.lastChild);
    }
    $scope.loading = true;

    var temp = [];
    $scope.selected_stocks.forEach(function (s) { temp.push('selected=' + s); });
    var selected_str = temp.join('&');

    $http({
      method: 'GET',
      url: WEBAPI + '/api/riskreturn/' + $scope.year + '?' + selected_str
    })
    .success(function (data, status) {
      $scope.riskData = [];
      $scope.riskData.push(['Stock', 'Risk', 'Return', 'Company Name']);
      data.forEach(function (t) {
        $scope.riskData.push([t.symbol, t.risk, t.ret * 100, t.company_name]);
      });
      $scope.loading = false;

      var chart = new google.visualization.BubbleChart(document.getElementById('riskreturn'));
      var dataTable = google.visualization.arrayToDataTable($scope.riskData);
      var options = {
        bubble: { textStyle: { fontSize: 11 } },
        chartArea: { width: "90%", height: "90%" },
        legend: { position: "none" },
      };

      chart.draw(dataTable, options);
    });
  };

  $scope.year = 2012;
  $scope.selected_stocks = ['AAPL', 'YHOO', 'AMZN', 'MSFT', 'GOOG'];
  $scope.Refresh();

});
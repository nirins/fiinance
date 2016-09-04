angular.module('myApp').controller('realtimeController', function ($scope, $http, stockTickerData) {
  $http({ method: 'GET', url: WEBAPI + '/api/stockprices/latestdate' })
  .success(function (data, status) {
    $scope.latestdate = new Date(data);
  });

  $http({ method: 'GET', url: WEBAPI + '/api/stocks/sp500' })
  .success(function (data, status) {
    $scope.stock_list = [];
    data.forEach(function (t) {
      $scope.stock_list.push(t.symbol);
    });
  });

  $scope.selected_stocks = ['AAPL', 'YHOO', 'AMZN', 'MSFT', 'GOOG'];
  $scope.stocks = [];
  $scope.series = [];
  $scope.marketIsOpen = false;

  $scope.assignStocks = function (stocks) {
    $scope.stocks = stocks;
  };
  $scope.replaceStock = function (stock) {
    for (var count = 0; count < $scope.stocks.length; count++) {
      if ($scope.stocks[count].symbol == stock.symbol) {
        $scope.stocks[count] = stock;

        if ($scope.series[count] === undefined) {
          $scope.series[count] = [];
          for (var i = 0; i < 7; i++) {
            $scope.series[count].push(0);
          }
        }

        $scope.series[count].push(stock.PercentChange * 100 * 2);

        if ($scope.series[count].length > 7)
          $scope.series[count].shift();

        $scope.stocks[count].serie = $scope.series[count];
      }
    }
  }
  $scope.setMarketState = function (isOpen) {
    $scope.marketIsOpen = isOpen;
    if (!$scope.marketIsOpen)
      return;
    ops.setSymbols($scope.selected_stocks);
  };

  var ops = stockTickerData();
  ops.initializeClient();
  ops.setCallbacks($scope.setMarketState, $scope.assignStocks, $scope.replaceStock);

  $scope.$watch('selected_stocks', function () {
    if (!$scope.marketIsOpen)
      return;
    ops.setSymbols($scope.selected_stocks);
  });
});

angular.module('myApp').filter('percentage', function () {
  return function (changeFraction) {
    return (changeFraction * 100).toFixed(2) + "%";
  };
});

angular.module('myApp').filter('change', function () {
  return function (changeAmount) {
    if (changeAmount > 0) {
      return "▲ " + changeAmount.toFixed(2);
    }
    else if (changeAmount < 0) {
      return "▼ " + changeAmount.toFixed(2);
    }
    else {
      return changeAmount.toFixed(2);
    }
  };
});

angular.module('myApp').directive('flash', function ($) {
  return function (scope, elem, attrs) {
    var flag = elem.attr('data-flash');
    var $elem = $(elem);

    function flashRow() {
      var value = scope.stock.Change;
      var changeStatus = scope.$eval(flag);
      if (true) {
        var bg = value === 0
//                    ? '255,216,0' // yellow
                    ? '255,255,255' // white
                    :
                    value > 0
                    ? '154,240,117' // green
                    : '255,148,148'; // red

        $elem.flash(bg, 1000);
      }
    }
    scope.$watch(flag, function (value) {
      flashRow();
    });
  };
});

jQuery.fn.flash = function (color, duration) {
  var current = this.css('backgroundColor');
  this.animate({ backgroundColor: 'rgb(' + color + ')' }, duration / 2)
  .animate({ backgroundColor: current }, duration / 2);
};

angular.module('myApp').directive('myRepeatDone', function () {
  var drawLittleChart = function (div, data) {
    var canvas = document.getElementById(div.substring(1, div.length));
    if (canvas !== null) {
      while (canvas.hasChildNodes()) {
        canvas.removeChild(canvas.lastChild);
      }
    }

    var margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = 80 - margin.left - margin.right,
    height = 20 - margin.top - margin.bottom;

    half = (height + margin.left + margin.right) / 2;

    var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.2);

    var y = d3.scale.linear()
    .range([0, height]);

    var svg = d3.select(div).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var temp = d3.entries(data);
    x.domain(temp.map(function (d) { return d.key; }));
    y.domain(d3.extent(temp, function (d) { return d.value; })).nice();

    svg.selectAll(".bar")
    .data(temp)
    .enter().append("rect")
    .attr("class", function (d) { return d.value < 0 ? "bar negative" : "bar positive"; })
    .attr("x", function (d) { return x(d.key); })
    .attr("y", function (d) { return d.value < 0 ? half : half - d.value; })
    .attr("width", 8)
    .attr("height", function (d) { return Math.abs(d.value); });
  };

  return function ($scope, element, attrs) {
    setTimeout(function () {
      var temp = JSON.parse(attrs.serie || "null");
      drawLittleChart("#littlechart_" + attrs.symbol, temp);
    }, 1);
  };
})
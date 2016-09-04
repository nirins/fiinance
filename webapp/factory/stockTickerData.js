angular.module('myApp').value('$', $);

angular.module('myApp').factory('stockTickerData', ['$', '$rootScope', function ($, $rootScope) {
  function stockTickerOperations() {
    //Objects needed for SignalR
    var connection;
    var proxy;

    //To set values to fields in the controller
    var setMarketState;
    var setValues;
    var updateStocks;

    //This function will be called by controller to set callback functions
    var setCallbacks = function (setMarketStateCallback, setValuesCallback, updateStocksCallback) {
      setMarketState = setMarketStateCallback;
      setValues = setValuesCallback;
      updateStocks = updateStocksCallback;
    };

    var initializeClient = function () {
      //Creating connection and proxy objects
      connection = $.hubConnection(WEBAPI);
      proxy = connection.createHubProxy('stockTickerMini');
      configureProxyClientFunctions();
      start();
    };

    var configureProxyClientFunctions = function () {
      proxy.on('marketOpened', function () {
        //set market state as open
        $rootScope.$apply(setMarketState(true));
      });

      proxy.on('marketClosed', function () {
        //set market state as closed
        $rootScope.$apply(setMarketState(false));
      });

      proxy.on('marketReset', function () {
        //Reset stock values
        initializeStockMarket();
      });

      proxy.on('updateStockPrice', function (stock) {
        $rootScope.$apply(updateStocks(stock));
      });
    };

    var initializeStockMarket = function () {
      //Getting values of stocks from the hub and setting it to controllers field
      proxy.invoke('getAllStocks').done(function (data) {
        $rootScope.$apply(setValues(data));
      }).pipe(function () {
        openMarket();
        //Setting market state to field in controller based on the current state
        proxy.invoke('getMarketState').done(function (state) {
          if (state == 'Open')
            $rootScope.$apply(setMarketState(true));
          else
            $rootScope.$apply(setMarketState(false));
        }).fail(function ($error) {
          $rootScope.$apply(setMarketState(true));
        });
      });
    };

    var start = function () {
      //Starting the connection and initializing market
      connection.start().pipe(function () {
        initializeStockMarket();
      });
    };

    var stop = function () {
      connection.stop();
    };

    var openMarket = function () {
      proxy.invoke('openMarket');
    };

    var closeMarket = function () {
      //proxy.invoke('closeMarket');
      connection.stop();
    };

    var reset = function () {
      proxy.invoke('reset');
    };

    var setSymbols = function (symbols) {
      proxy.invoke('setSymbols', symbols).done(function (data) {
        $rootScope.$apply(setValues(data));
      });

      start();
    };

    return {
      initializeClient: initializeClient,
      openMarket: openMarket,
      closeMarket: closeMarket,
      reset: reset,
      setSymbols: setSymbols,
      setCallbacks: setCallbacks
    };
  };

  return stockTickerOperations;
}]);
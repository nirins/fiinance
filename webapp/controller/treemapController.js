angular.module('myApp').controller('treemapController', function ($scope, $http, $filter) {
  $http({ method: 'GET', url: WEBAPI + '/api/stockprices/latestdate' })
  .success(function (data, status) {
    $scope.latestdate = new Date(data);
  });

  $http({ method: 'GET', url: WEBAPI + '/api/treemap' })
  .success(function (data, status) {
    $scope.loading = true;
    $scope.myData = [];
    $scope.myData.push(['Stock', 'Section', 'Volume', 'Change', 'CompanyName']);
    data.forEach(function (t) {
      $scope.myData.push([t.name, t.parent, t.volume, t.change, t.company_name]);
    });
    $scope.loading = false;

    var treemap = new google.visualization.TreeMap(document.getElementById('treemap'));
    var dataTable = google.visualization.arrayToDataTable($scope.myData);
    var options = {
      minColor: 'red',
      midColor: '#ddd',
      maxColor: '#0d0',
      headerHeight: 15,
      fontColor: 'black',
      showScale: true,
      generateTooltip: showFullTooltip
    };

    function showFullTooltip(row, size, value) {
      if (dataTable.getValue(row, 4) === null)
        return '<div style="background:#fd9; padding:10px; border-style:solid">' +
        '<span style="font-family:Courier"><b>' + dataTable.getValue(row, 0) +
        '</b></br>' +
        dataTable.getColumnLabel(2) + ' : ' + size + ' </br>' +
        dataTable.getColumnLabel(3) + ' : ' + value + ' </div>';

      else
        return '<div style="background:#fd9; padding:10px; border-style:solid">' +
        '<span style="font-family:Courier"><b>' + dataTable.getValue(row, 0) +
        '</b> - ' + dataTable.getValue(row, 4) + ' </br>' +
        dataTable.getColumnLabel(2) + ' : ' + size + ' </br>' +
        dataTable.getColumnLabel(3) + ' : ' + value + ' </div>';
    }

    treemap.draw(dataTable, options);
  });
});
app.factory('units', ['$resource', function($resource) {
  return $resource(
      '/resources/units', {}, {
      get: {
          method: 'GET',
          isArray: true,
          transformResponse: function(data, headers){
              data = JSON.parse(data);
              var returnData = [];
              for(i = 0; i < data.length; i++) {
                var tempUnit = data[i];
                tempUnit.unitState = tempUnit.unitState == 1 ? true : false;
                returnData.push(tempUnit);
              }
              console.log(returnData);
              return returnData;
          }
      }
  }
);
}]);

app.factory('unit', ['$resource', function($resource) {
  return $resource('/resources/units/:id', null, {
        'update': { method:'PUT' }
    });
}]);

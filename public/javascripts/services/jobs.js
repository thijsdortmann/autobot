app.factory('jobs', ['$resource', function($resource) {
  return $resource(
      '/resources/jobs', {}, {
      get: {
          method: 'GET',
          isArray: true,
          transformResponse: function(data, headers){

            function doubleDigit(n){
              return n > 9 ? "" + n: "0" + n;
            }

            var weekdayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

              data = JSON.parse(data);
              var returnData = [];
              for(var i=0; i<data.length; i++) {
                var tempData = data[i];
                tempData.description = "";
                tempData.icon = 'fa fa-clock-o';
                tempData.jobName = (tempData.newState == 1 ? 'Turn on ' : 'Turn off ')+tempData.unitName;
                if(tempData.useSunset == 1) {
                  tempData.description += "using sunset as time, ";
                  tempData.icon = 'fa fa-moon-o';
                }
                if(tempData.useSunrise == 1) {
                  tempData.description += "using sunrise as time, ";
                  tempData.icon = 'fa fa-sun-o';
                }
                if(tempData.isDaily == 1) {
                  if(tempData.useSunset == 1 || tempData.useSunrise == 1) tempData.description += "repeating daily, ";
                  else tempData.description += "repeating daily at "+doubleDigit(tempData.hour)+":"+doubleDigit(tempData.min)+":"+doubleDigit(tempData.sec)+", ";
                }
                if(tempData.isWeekly == 1) {
                  if(tempData.useSunset == 1 || tempData.useSunrise == 1) tempData.description += "repeating weekly on "+weekdayNames[tempData.weekday]+", ";
                  else tempData.description += "repeating weekly on "+doubleDigit(tempData.weekday)+"th day at "+doubleDigit(tempData.hour)+":"+doubleDigit(tempData.min)+":"+doubleDigit(tempData.sec)+", ";
                }
                tempData.description = tempData.description.substring(0, tempData.description.length - 2);

                console.log(tempData);
                returnData.push(tempData);
              }
              return returnData;
          }
      }
  }
);
}]);

app.factory('job', ['$resource', function($resource) {
  return $resource('/resources/jobs/:id', null, {
        'update': { method:'PUT' }
    });
}]);

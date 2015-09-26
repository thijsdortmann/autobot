app.controller("JobEditController", ["$scope", "$location", "$routeParams", "job", "units", function($scope, $location, $routeParams, job, units) {
  units.get(function(data) {
    $scope.units = data;
  });
  var newJob = true;
  var job;

  if ($routeParams.jobId) {
    newJob = false;
    var jobId = $routeParams.jobId;
    job.get({
      id: jobId
    }, function(data) {
      data.hour = parseInt(data.hour);
      data.min = parseInt(data.min);
      data.sec = parseInt(data.sec);
      data.useSunrise = data.useSunrise ? true : false;
      data.useSunset = data.useSunset ? true : false;
      if (data.isWeekly) data.repeat = 'weekly';
      if (data.isDaily) data.repeat = 'daily';
      $scope.job = data;
    });
  } else {
    // Set default values
    $scope.job = {
      repeat: 'daily',
      newState: '1'
    };
  }

  $scope.saveJob = function() {
    $scope.job.isWeekly = $scope.job.repeat == 'weekly' ? true : false;
    $scope.job.isDaily = $scope.job.repeat == 'daily' ? true : false;
    if (newJob) {
      console.log("okay")
      job.save({
        hour: $scope.job.hour,
        min: $scope.job.min,
        sec: $scope.job.sec,
        weekday: $scope.job.weekday,
        useSunset: $scope.job.useSunset,
        useSunrise: $scope.job.useSunrise,
        isDaily: $scope.job.isDaily,
        isWeekly: $scope.job.isWeekly,
        newState: $scope.job.newState,
        unitId: $scope.job.unitId
      }, function(data) {
        $location.path('settings');
      });
    } else {
      job.update({
        id: jobId
      }, {
        hour: $scope.job.hour,
        min: $scope.job.min,
        sec: $scope.job.sec,
        weekday: $scope.job.weekday,
        useSunset: $scope.job.useSunset,
        useSunrise: $scope.job.useSunrise,
        isDaily: $scope.job.isDaily,
        isWeekly: $scope.job.isWeekly,
        newState: $scope.job.newState,
        unitId: $scope.job.unitId
      }, function(data) {
        $location.path('settings');
      });
    }
  }

  $scope.changeView = function(view) {
    $location.path(view);
  }
}]);

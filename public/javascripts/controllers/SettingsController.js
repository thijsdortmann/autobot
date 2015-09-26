app.controller("SettingsController", ["$scope", "$http", "$mdDialog", "$location", "jobs", "job", function($scope, $http, $mdDialog, $location, jobs, job) {
  // Convert 0 or 1 from database to false or true for Angular. Yup...
  jobs.get(function(data) {
    $scope.jobs = data;
  });
  $http.get('/resources/sunrise_sunset')
    .then(function(res) {
      $scope.sunrise = res.data.sunrise;
      $scope.sunset = res.data.sunset;
      $scope.map = {
        center: {
          latitude: res.data.latitude,
          longitude: res.data.longitude
        },
        zoom: 8
      };
      $scope.marker = {
        id: 0,
        coords: {
          latitude: res.data.latitude,
          longitude: res.data.longitude
        },
        options: {}
      }
    });
  $scope.changeLocation = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.body))
      .title('Change location')
      .content('The location for sunrise and sunset times cannot be changed from the settings. To change the location, change the corresponding values in config/config.json and restart the server.')
      .ariaLabel('Change location')
      .ok('Got it!')
      .targetEvent(ev)
    );
  };
  $scope.customAlert = function(title,text,ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
      .parent(angular.element(document.body))
      .title(title)
      .content(text)
      .ariaLabel(title)
      .ok('Got it!')
      .targetEvent(ev)
    );
  };
  $scope.changeView = function(view) {
    $location.path(view);
  };
  $scope.editJob = function(job) {
    $location.path('settings/jobEdit/'+job.scheduleId);
  };
  $scope.deleteJob = function(job) {
    $http.delete('/resources/jobs/'+job.scheduleId);
    jobs.get(function(data) {
      $scope.jobs = data;
    });
  }
  $scope.rebuildSchedule = function() {
    $http.get('/actions/reload_schedule');
  }
}]);

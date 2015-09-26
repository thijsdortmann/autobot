app.controller("MainController", ["$scope", "$http", "units", "unit", function($scope, $http, units, unit) {
    // Convert 0 or 1 from database to false or true for Angular. Yup...
    units.get(function(data) {
      $scope.units = data;
      $scope.changeState = function() {
        unit.update({ id:this.unit.unitId }, this.unit);
      }
    });
    $http.get("/actions/show_schedule")
      .then(function(res) {

        function doubleDigit(n){
          return n > 9 ? "" + n: "0" + n;
        }

        $scope.jobCurr = res.data;

        for(var i=0; i<$scope.jobCurr.length; i++) {
          $scope.jobCurr[i].jobName = ($scope.jobCurr[i].newState == 1 ? 'Turn on ' : 'Turn off ')+$scope.jobCurr[i].unitName;
          $scope.jobCurr[i].timeHr = doubleDigit($scope.jobCurr[i].hour)+":"+doubleDigit($scope.jobCurr[i].min)+":"+doubleDigit($scope.jobCurr[i].sec);
        }

        console.log($scope.jobCurr);
      });
}]);

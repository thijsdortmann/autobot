app.controller("MenuController", ["$scope", "$location", function($scope, $location) {
    // Convert 0 or 1 from database to false or true for Angular. Yup...
    $scope.changeView = function(view) {
      $location.path(view);
    }
}]);

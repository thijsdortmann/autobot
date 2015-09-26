var app = angular.module('autobot', ['ngRoute', 'ngMaterial', 'ngResource', 'ngMessages', 'uiGmapgoogle-maps']);

app.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      controller: 'MainController',
      templateUrl: 'views/home.html'
    })
    .when('/settings', {
      controller: 'SettingsController',
      templateUrl: 'views/settings.html'
    })
    .when('/settings/jobAdd', {
      controller: 'JobEditController',
      templateUrl: 'views/settings.jobEdit.html'
    })
    .when('/settings/jobEdit/:jobId', {
      controller: 'JobEditController',
      templateUrl: 'views/settings.jobEdit.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});

(function(){
  'use strict';
  angular
    .module('app')
    .config(configureRoutes);
  
  function configureRoutes($httpProvider, $routeProvider){

    $routeProvider
      .when('/', {
        templateUrl: '/partials/home.html'
      })
      .when('/users', {
          templateUrl: '/partials/users.html'
      })
  }
})();
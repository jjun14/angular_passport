(function(){
  'use strict';
  angular
    .module('app')
    .controller('UsersController', UsersController);

  function UsersController($location, $scope, UserFactory){

    init();
    function init(){
      UserFactory.getUser().then(function success(response){
        console.log('Got user in the homeController');
        console.log(response);
        $scope.user = response.data;
      });
    }

    $scope.logout = function(){
      console.log('logging out');
      UserFactory.logout();
      $location.path('/');
    }

  }
})();
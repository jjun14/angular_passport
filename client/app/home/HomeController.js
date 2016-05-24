(function(){
  'use strict';
  angular
    .module('app')
    .controller('HomeController', HomeController);

  function HomeController($location, $scope, UserFactory){
    $scope.login = login;
    $scope.register = register;

    // UserFactory.getUser().then(function success(response){
    //   console.log('Got user in the homeController');
    //   console.log(response);
    //   $scope.user = response.data;
    //   $location.path('/users/'+$scope.user._id);
    // });


    function login(user){
      UserFactory.login(user).then(function success(response){
        console.log(response.data)
        $scope.user = response.data.user;
        $location.path('/users/');
        alert(response.data.token);
      }, handleError);
    }

    function register(user){
      console.log(user);
      UserFactory.register(user).then(function success(response){
        console.log('in the user factory');
        console.log(response.data.user);
        $scope.user = response.data.user;
        console.log($scope.user);
        $location.path('/users');
        // alert(response.data.token);
      }, handleError);
    }

    function handleError(response){
      alert('Error: ' + response.data);
    }
  }
})();
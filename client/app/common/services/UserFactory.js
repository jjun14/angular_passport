(function(){
  'use strict';
  angular
    .module('app')
    .factory('UserFactory', UserFactory);

  UserFactory.$inject = ['$http', 'API_URL', 'AuthTokenFactory', '$q'];
  function UserFactory($http, API_URL, AuthTokenFactory, $q){
    var user = null;

    return {
      register: register,
      login: login,
      logout: logout,
      loggedIn, loggedIn,
      getUser: getUser
    };

    function login(user){
      console.log('user factory');
      console.log(user);

      return $http.post(API_URL + '/login', {
        email: user.email,
        password: user.password
      }).then(function success(response){
        user = response.data.user;
        AuthTokenFactory.setToken(response.data.token);
        return response;
      });
    }
    
    function register(user){
      console.log('calling the factory function');
      console.log(user);
      return $http.post(API_URL + '/register', {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: user.password
      }).then(function success(response){
        user = response.data.user;
        console.log(response.data.token)
        AuthTokenFactory.setToken(response.data.token);
        return response;
      })
    }

    function logout(){
      user = null;
      AuthTokenFactory.setToken();
    }

    function loggedIn(){
      if(user){
        return true;
      } else {
        return false;
      }
    }

    function getUser(){
      console.log('getting the user');
      var token = AuthTokenFactory.getToken();
      if(token){
        var config = {
          headers: {}
        }
        config.headers.Authorization = 'Bearer ' + token;
        console.log(token);
        console.log('getting user');
        console.log(config);
        return $http.get(API_URL + '/authenticated', config);
      } else {
        user = null;
        return $q.reject({ data: 'client has no auth token' });
      }
    }
  }
})();
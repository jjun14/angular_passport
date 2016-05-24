(function(){
  'use strict'
  angular
    .module('app')
    .factory('AuthTokenFactory', AuthTokenFactory);
  
  AuthTokenFactory.$inject = ['$cookies'];
  function AuthTokenFactory($cookies){
    // var store = $window.localStorage;
    var key = 'auth-token';

    return {
      getToken: getToken,
      setToken: setToken 
    };

    function getToken(){
      return $cookies.get(key);
    }

    function setToken(token){
      if(token){
        $cookies.put(key, token);
      } else {
        $cookies.remove(key);
      }
    }
  }
})();
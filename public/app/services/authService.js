angular.module('journey')
  .service('authService', function($http, $state) {

    this.login = function(userData) {
      console.log('userData = ', userData);
      return $http({
        method: 'POST',
        url: '/api/login',
        data: userData
      });
    };

    this.logout = function() {
      return $http({
        method: 'GET',
        url: '/api/logout'
      });
    };

    this.signup = function(userData) {
      console.log('userData = ', userData);
      return $http({
        method: 'POST',
        url: '/api/signup',
        data: userData
      });
    };

    this.checkForAuth = function() {
      return $http({
        method: 'GET',
        url: '/api/current_user'
      })
      .then(function(response) {
          console.log(response);
          return response;
      }, function(err) {
          console.error(err);
          $state.go('login');
      })
    };
    



  });

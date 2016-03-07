angular.module('journey')
  .controller('loginCtrl', function(authService, $scope, $state, $stateParams, errService, userService) {
      

    $scope.login = function() {
      
      authService.login($scope.user)
        .then(function(response) {
           
          if (response.status === 200) {
            if ($stateParams.successRedirect) {
              $state.go($stateParams.successRedirect);
             
            } else { // default redirect to student
              $state.go('timeline');
            }
          }
        })
        .catch(function(error) {
          errService.error(error);
        });
    };

    $scope.signup = function() {
      authService.signup($scope.userSignup)
        .then(function(response) {
          if (response.status === 200) {
            $state.go('timeline');
          }
        })
        .catch(function(error) {
          errService.error(error);
        });
    };
   
    $scope.devMtnLogin = function() {
      
      authService.devMtnLogin()
        .then(function(response) {
           
          if (response.status === 200) {
            if ($stateParams.successRedirect) {
              $state.go($stateParams.successRedirect);
             
            } else { // default redirect to student
              $state.go('timeline');
            }
          }
        })
        .catch(function(error) {
          errService.error(error);
        });
    };
   
  });

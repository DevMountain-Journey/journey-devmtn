angular.module('journey')
  .controller('loginCtrl', function(authService, $scope, $state, $stateParams, errService) {

    $scope.login = function() {
      authService.login($scope.user)
        .then(function(response) {
          console.log('in loginCtrl -- in processForm -- Login Response: ', response);
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
          console.log('in signupCtrl -- in processForm -- Signup Response: ', response);
          if (response.status === 200) {
            $state.go('feed', {
              toastMessage: 'Signup Successful'
            });
          }
        })
        .catch(function(error) {
          errService.error(error);
        });
    };
  });

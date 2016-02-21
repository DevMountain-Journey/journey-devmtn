angular.module('journey')
  .controller('loginCtrl', function(authService, $scope, $state, $stateParams, errService) {
    
   $scope.login = function() {
      authService.login($scope.user)
        .then(function(response) {
            console.log('in loginCtrl');
            console.log('in processForm');
            console.log('response', response);
            if (response.status === 200) {
              if ($stateParams.successRedirect) {
                $state.go($stateParams.successRedirect);
              } else { // default redirect to student
                $state.go('feed');
              }
            }
          })
          .catch(function(error) {
              errService.error(error);
          });

      // .catch(function(err) {
      //   // For any error, send them back to admin login screen.
      //   console.error('err = ', err);
      //   if (err.data)
      //     $scope.errorMsg = err.data;
      // });
    };

    $scope.signup = function() {
        authService.signup($scope.userSignup)
        .then(function( response ) {
            console.log('in signupCtrl');
            console.log('in processForm');
            console.log('response', response);
            if (response.status === 200) {
                $state.go('feed', {
                    toastMessage: 'Signup Successful'
                });
            }
        })
        .catch(function(error) {
             errService.error(error);
        });

        // .catch(function(err) {
        //      // For any error, send them back to admin login screen.
        //      console.error('err = ', err);
        //      if (err.data.message)
        //         $scope.errorMsg = err.data.message;
        // });

    };

  });

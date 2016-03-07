angular.module('journey')
  .controller('mainCtrl', function($scope, authService, $state, $stateParams, userService, auth) {

  $scope.logout = function() {
         authService.logout()
         .then(function( response ) {
            console.log('in mainCtrl');
            console.log('in logout');
            console.log('response', response);
            if (response.status === 200) {
                $state.go('login');
            }
        });
    };

    $scope.currentUser = auth.data;

});

angular.module('journey')
  .controller('mainCtrl', function($rootScope, $scope, authService, $state, $stateParams, userService, auth) {

  $scope.logout = function() {
         authService.logout()
         .then(function( response ) {
            if (response.status === 200) {
                $state.go('login');
            }
        });
    };

    $scope.currentUser = auth.data;

});

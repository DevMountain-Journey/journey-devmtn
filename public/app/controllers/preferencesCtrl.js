angular.module('journey')
.controller('prefrencesCtrl', function($rootScope, $scope, $state, errService, userService) {
  $scope.response = '';

  $scope.updatePreferences = function(){
    userService.updateUser($scope.currentUser, $scope.currentUser._id).then(
      function(response){
        $scope.response = 'success';
        $state.go($scope.currentUser.preferences.viewPreferences);
      },
      function(error){
        $scope.response = 'error';
        console.info('UPDATE ERROR', error);
      }
    );
  };
});

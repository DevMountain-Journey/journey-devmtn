angular.module('journey')
.controller('prefrencesCtrl', function($rootScope, $scope, errService, userService) {
  $scope.response = '';

  $scope.updatePreferences = function(){
    userService.updateUser($scope.currentUser, $scope.currentUser._id).then(
      function(response){
        $scope.response = 'success';
        console.log('USER UPDATED ', response);
      },
      function(error){
        $scope.response = 'error';
        console.info('UPDATE ERROR', error);
      }
    );
  };
});

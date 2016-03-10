angular.module('journey')
.controller('prefrencesCtrl', function($rootScope, $scope, $state, errService, userService) {
  $scope.response = '';

  if (!$scope.currentUser.startDate)  
    $scope.currentUser.startDate = moment().format('L');

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
    
  $(document).ready(function() {
    $('#startdate-input').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        startDate: $scope.currentUser.startDate,
    });
  });    
});

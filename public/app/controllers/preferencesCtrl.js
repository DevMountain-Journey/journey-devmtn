angular.module('journey')
.controller('prefrencesCtrl', function($rootScope, $scope, $state, errService, userService) {
  $scope.response = '';

  if (!$scope.currentUser.startDate)  
    $scope.currentUser.startDate = new Date();
  else // startDate exists
    $scope.currentUser.startDate = new Date($scope.currentUser.startDate);
 

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
      
   function cb(dt) {
        //$('#startdate-input').html(dt.format('MMMM D, YYYY'));
        $scope.currentUser.startDate = dt; 
    }
      
    $('#startdate-input').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        startDate: $scope.currentUser.startDate,
    }, cb);
  });    
});

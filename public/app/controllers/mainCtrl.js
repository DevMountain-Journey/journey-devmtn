angular.module('journey')
  .controller('mainCtrl', function($scope, authService, $state, $stateParams, userService) {
$scope.idk = function() {
       authService.checkForAuth($stateParams.id)
         .then(function(response){
            console.log(response, "loking");
            return response.data[0]; 
               if (response.status === 200) {
                $state.go('login');
            }
        });
    };
console.log()

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
    
    $scope.userInfo =  function() {
      userService.getUser($stateParams.id)
        .then(function(response) {
            return response.data[0],
            console.log(response, "thisishappening");
         
        });
   };
  
 $scope.user =$scope.userInfo(); 
  
    console.log($scope.userInfo, "userInfo"); 
    
    
    
    
    
    
});




angular.module('journey', [
'ui.router'
 ])
 
 
.run(function($rootScope){
      $rootScope.$on('$stateChangeError' ,function(event, toState, toParams, fromState, fromParams, error){
      console.error(error);
  })
  
 });
 
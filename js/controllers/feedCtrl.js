angular.module('journey')
.controller(
 'feedCtrl',
 'posts',
 'postService', 
function($scope, posts, postService){
   
 $scope.posts = postService.posts  
    
    
})

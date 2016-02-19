angular.module('journey')
.controller('postCtrl', [
 'posts',
 'postService', 
function($scope, posts, postService){
   
 $scope.posts = postService.posts  
    
    
}])

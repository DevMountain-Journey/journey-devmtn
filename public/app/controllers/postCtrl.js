angular.module('journey')
.controller('postCtrl', function($scope, posts, postService){
   
 $scope.posts = postService.posts  
    
    
})

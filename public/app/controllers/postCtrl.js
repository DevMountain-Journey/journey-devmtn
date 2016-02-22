angular.module('journey')
.controller('postCtrl', function($scope, errService, postPromise, postService, auth){

 $scope.posts = postPromise.data;


 $scope.createPost = function() {
    postService.createPost($scope.postContent)
     .then(function(response){
            $scope.postContent = {};
            console.log(response);
    },function(err) {
       errService.error(err);
    });
 };

//  $scope.getAllPost = function() {
//      postService.getAllPost()
//      .then(function(response) {
//             console.log(response);
//             $scope.posts = response.data;
//      }, function(err) {
//          errService.error(err);
//         });
//  };

 $scope.getOnePost = function() {
     postService.getOnePost()
     .then(function(response){
         console.log(response);
         $scope.post = response.data;
     }, function(err){
         errService.error(err);
     });
 };

  $scope.updatePost = function() {
     postService.updatePost($scope.postContent)
     .then(function(response){
         console.log(response);
          $scope.postContent = {};
     }, function(err){
         errService.error(err);
     });
 };


   $scope.deletePost = function() {
     console.log('delete triggered');
    //  postService.deletePost(id)
    //  .then(function(respnose){
    //      $scope.posts = $scope.posts.splice(index, 1);
    //  });
 };

});

angular.module('journey')
  .controller('feedCtrl',

    function($scope, errService, postPromise, pageSize, postService, postCount, auth) {
        
       $scope.totalPosts = postCount.data; 
       console.log("COUNT", $scope.totalPosts);
        
      $scope.posts = postPromise.data;
      //Token Field Setup
      //Docs here: http://sliptree.github.io/bootstrap-tokenfield/
      // TODO: Token field needs fine tuned setup and some additional CSS help to fix issues.
      // $('#tags').tokenfield();

       $scope.createPost = function() {
         $scope.postContent.user = auth.data._id;
         $scope.postContent.tags = ['herpderp', 'jquery', 'awesome'];
          postService.createPost($scope.postContent)
           .then(function(response){
                  $scope.postContent = {};
                  console.log('In createPost')
                  console.log(response);
                  $scope.currentPage = 1;
                  $scope.totalPosts++;
                  postService.getAllPost(pageSize.POSTS, $scope.currentPage)
                  .then(function(response){
                      console.log('in getAllPosts')
                      console.log(response);
                      $scope.posts = response.data;
                  });
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


         $scope.deletePost = function(id, index) {
           postService.deletePost(id)
           .then(function(response){
              $scope.posts.splice(index, 1);
              $scope.totalPosts--;
           });
       };


 $scope.currentPage = 1; 
     
$scope.nextPage = function() {
    $scope.currentPage++;
    if (pageSize.POSTS)
        $scope.maxPages = Math.ceil($scope.totalPosts / pageSize.POSTS);
    if($scope.currentPage > $scope.maxPages){
        $scope.currentPage = $scope.maxPages;
    }
    else {
        postService.getAllPost(pageSize.POSTS, $scope.currentPage)
        .then(function(response){
            console.log(response);
            $scope.posts = response.data;
        });
    }
};

$scope.previousPage = function() {
    $scope.currentPage--;
    if ($scope.currentPage <= 0){
        $scope.currentPage = 1 ;
    }
    else {
        postService.getAllPost(pageSize.POSTS, $scope.currentPage)
        .then(function(response){
            console.log(response);
            $scope.posts = response.data;
        });
    }
};




});

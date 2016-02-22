angular.module('journey')
  .controller('feedCtrl',
    function($scope, errService, postPromise, pageSize, postService) {
      $scope.posts = postPromise.data;

      //Token Field Setup
      //Docs here: http://sliptree.github.io/bootstrap-tokenfield/
      // TODO: Token field needs fine tuned setup and some additional CSS help to fix issues.
      $('#tags').tokenfield();

 $scope.currentPage = 1; 
     
$scope.nextPage = function() {
    $scope.currentPage++;
    postService.getAllPost(pageSize.SIZE, $scope.currentPage)
    .then(function(response){
        console.log(response);
        $scope.posts = response.data;
    });
};

$scope.previousPage = function() {
    $scope.currentPage--;
    if ($scope.currentPage <= 0){
        $scope.currentPage = 1 ;
    }
    postService.getAllPost(pageSize.SIZE, $scope.currentPage)
    .then(function(response){
        console.log(response);
        $scope.posts = response.data;
    });
};


});

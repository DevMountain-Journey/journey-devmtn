angular.module('journey')
  .controller('feedCtrl',
    function($scope, errService, postPromise) {
      $scope.posts = postPromise.data;

      //Token Field Setup
      //Docs here: http://sliptree.github.io/bootstrap-tokenfield/
      // TODO: Token field needs fine tuned setup and some additional CSS help to fix issues.
      $('#tags').tokenfield();

});

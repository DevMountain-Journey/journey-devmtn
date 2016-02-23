angular.module('journey')
  .controller('feedCtrl',
    function($scope, $http, errService, postPromise, postService, auth) {
      $scope.posts = postPromise.data;

      $scope.loadTags = function($query) {
        return $http.get('tags.json', {
          cache: true
        }).then(function(response) {
          var data = response.data;
          return data.filter(function(tag) {
            return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
          });
        });
      };

      // $scope.sortPostByDate = function(post) {
      //     var postDate = new Date(post.datePosted);
      //     console.log(postDate);
      //     return postDate;
      // };

      $scope.createPost = function() {
        $scope.postContent.user = auth.data._id;
        postService.createPost($scope.postContent)
          .then(function(response) {
            //console.log('POST CREATION SUCCESS RESPONSE', response);
            $scope.posts.push(response.data);
            $scope.postContent = {};
            console.log(response);
          }, function(err) {
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
          .then(function(response) {
            console.log(response);
            $scope.post = response.data;
          }, function(err) {
            errService.error(err);
          });
      };

      $scope.updatePost = function() {
        postService.updatePost($scope.postContent)
          .then(function(response) {
            console.log(response);
            $scope.postContent = {};
          }, function(err) {
            errService.error(err);
          });
      };


      $scope.deletePost = function(id, index) {
        postService.deletePost(id)
          .then(function(response) {
            $scope.posts.splice(index, 1);
          });
      };


    });

angular.module('journey')
  .controller('feedCtrl',
    function($scope, $http, errService, postPromise, postService, auth) {

      $scope.posts = postPromise.data;
      $scope.totalPosts = postCount.data;
      $scope.currentPage = 1;

      console.log("COUNT", $scope.totalPosts);

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
        $scope.postContent.tags = ['herpderp', 'jquery', 'awesome'];
        postService.createPost($scope.postContent)
          .then(function(response) {
            $scope.postContent = {};
            console.log('In createPost');
            console.log(response);
            $scope.currentPage = 1;
            $scope.totalPosts++;
            postService.getAllPost(pageSize.POSTS, $scope.currentPage)
              .then(function(response) {
                console.log('in getAllPosts');
                console.log(response);
                $scope.posts = response.data;
              });
          }, function(err) {
            errService.error(err);
          });
      };

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
            $scope.totalPosts--;
          });
      };

      $scope.nextPage = function() {
        $scope.currentPage++;
        if (pageSize.POSTS)
          $scope.maxPages = Math.ceil($scope.totalPosts / pageSize.POSTS);
        if ($scope.currentPage > $scope.maxPages) {
          $scope.currentPage = $scope.maxPages;
        } else {
          postService.getAllPost(pageSize.POSTS, $scope.currentPage)
            .then(function(response) {
              console.log(response);
              $scope.posts = response.data;
            });
        }
      };

      $scope.previousPage = function() {
        $scope.currentPage--;
        if ($scope.currentPage <= 0) {
          $scope.currentPage = 1;
        } else {
          postService.getAllPost(pageSize.POSTS, $scope.currentPage)
            .then(function(response) {
              console.log(response);
              $scope.posts = response.data;
            });
        }
      };



    });

angular.module('journey')

.controller('feedCtrl',
  function($scope, $http, errService, postPromise, postService, auth, postCount, pageSize) {

    $scope.posts = postPromise.data;
    $scope.totalPosts = postCount.data;
    $scope.currentPage = 1;

    var groupedPosts = _.groupBy($scope.posts, function(post) {
      return post.datePosted.substring(0, 10);
    });

    $scope.fixedPosts = [];

    for (var date in groupedPosts) {
      var obj = {};
      obj.date = date;
      obj.posts = groupedPosts[date];
      $scope.fixedPosts.push(obj);
    }


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

    $scope.createPost = function() {
      $scope.postContent.user = auth.data._id;
      $scope.postContent.tags = _.map($scope.postContent.tags, 'name');
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

    $scope.filters = function(type, value) {
      $scope.filters = query;
      postService.getAllPost(pageSize.POSTS, $scope.currentPage, $scope.filterType, $scope.filterValue)
        .then(function(response) {
          console.log('in $scope.filters');
          console.log(response);
          $scope.posts = response.data;
        }, function(err) {
          errService.error(err);

        });
    };
    
    $scope.setScale = function(num) {
        $scope.postContent.positiveScale = num; 
    };    
    
    
    
    
    
  });

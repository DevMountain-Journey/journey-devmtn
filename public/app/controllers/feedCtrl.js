angular.module('journey')

.controller('feedCtrl',
  function($scope, $http, errService, postPromise, postService, auth, postCount, pageSize) {
    $scope.postContent = {};
    $scope.posts = postPromise.data;
    $scope.totalPosts = postCount.data;

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
          if(response.status === 200){
            $scope.postContent = {};
            $scope.totalPosts++;
            var newPost = response.data;
            newPost.user = {
              _id : auth.data._id,
              firstName : auth.data.firstName,
              lastName : auth.data.lastName,
              email : auth.data.email
            };
            //TODO: Below doesnt work always because if there are no posts for that day then it adds it to the previous day (whatever is on top of the array).
            $scope.fixedPosts[0].posts.unshift(newPost);
          }
          // postService.getAllPost(pageSize.POSTS, $scope.currentPage)
          //   .then(function(response) {
          //     console.log('in getAllPosts');
          //     console.log(response);
          //     $scope.posts = response.data;
          //   });
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
        if ($scope.postContent.positiveScale === num + 1){
            $scope.postContent.positiveScale = null;
        }
        else {
            $scope.postContent.positiveScale = num + 1;

        }
    };


    $scope.repeatEmotions = function() {
        return new Array(10);
    };




  });

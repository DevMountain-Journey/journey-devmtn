angular.module('journey')

.controller('feedCtrl',
  function($scope, $http, errService, postPromise, postService, auth, postCount, pageSize) {
    $scope.postContent = {};
    $scope.totalPosts = postCount.data;

    function formatPosts(data) { //This function formats the provided post data so that we can use it effectively.
      $scope.fixedPosts = []; //Init array to accept final posts object manipulation.

      //Take the resolve post data and use lodash to group by and convert dates to local time (from UTC).
      var groupedPosts = _.groupBy(data, function(post) {
        post.datePosted = moment(post.datePosted).local().format("YYYY-MM-DDTHH:mm:ss");
        return post.datePosted.substring(0, 10);
      });
      for (var date in groupedPosts) {
        $scope.fixedPosts.push({
          date: date,
          posts: groupedPosts[date]
        });
      }
    }//end function formatPosts

    formatPosts(postPromise.data);

    //TODO: Move the get request to the service.
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
          if (response.status === 200) {
            $scope.postContent = {};
            $scope.totalPosts++;
            var post = response.data;
            var postDate = moment(post.datePosted).local().format('YYYY-MM-DD');
            var today = moment().local().format('YYYY-MM-DD');
            if(postDate == today){ //If the postdate is the same as today
              $scope.fixedPosts[0].posts.unshift(post); //then just unshift (push to top) the post to the top of the first item in the fixedPost array
            } else {
              $scope.fixedPosts.unshift({ //Otherwise unshift a new item into fixedPosts with todays date and an array with the new post in it.
                date: today,
                posts: [post]
              });
            }
          } else {
            errService.error(response);
          }
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
      if ($scope.postContent.positiveScale === num + 1) {
        $scope.postContent.positiveScale = null;
      } else {
        $scope.postContent.positiveScale = num + 1;

      }
    };

    $scope.repeatEmotions = function() {
      return new Array(10);
    };

    $scope.isToday = function(date) {
      return moment(moment(date).format('YYYY-MM-DD')).isSame(moment().local().format('YYYY-MM-DD'));
    };

  });

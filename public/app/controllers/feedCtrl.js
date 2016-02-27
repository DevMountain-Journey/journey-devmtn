angular.module('journey')

.controller('feedCtrl',
  function($scope, $http, errService, postPromise, postService, userService, auth, pageSize, $location, $anchorScroll) {
    $scope.postContent = {};
    $scope.totalPosts = 0;
    $scope.query = {};
    $scope.today = new Date();

    function formatPosts(data) { //This function formats the provided post data so that we can use it effectively.
      $scope.totalPosts = data.length;
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
            if(postDate === $scope.fixedPosts[0].date){ //If the postdate is the same as the first date in the fixedPosts array.
              $scope.fixedPosts[0].posts.unshift(post); //then just unshift (push to top) the post to the top of the first item in the fixedPost array
            } else {
              $scope.fixedPosts.unshift({ //Otherwise unshift a new item into fixedPosts with todays date and an array with the new post in it.
                date: postDate,
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

    $scope.createQuery = function() {

        var filters = {};

        if ($scope.query.name) {
            userService.getSearchUsers($scope.query.name)
            .then(function(response) {
                console.log('getSearchUsers response = ', response);
                if (response.data.length)
                    filters.user = response.data;
                else // No users fit criteria
                    filters.user = ['999999999999999999999999']; // Create empty search
                completeQuery();
            }, function(err) {
                console.error(err);
            });
        }
        else {
            completeQuery();
        }



        function completeQuery() {

            if ($scope.query.tag) {
                filters.tags = [];
                filters.tags[0] = $scope.query.tag;
            }

            if ($scope.query.lowEmotion && $scope.query.highEmotion) {
                if ($scope.query.lowEmotion <= $scope.query.highEmotion) {
                    filters.positiveScale = [];
                    for (var i = $scope.query.lowEmotion; i <= $scope.query.highEmotion; i++) {
                                filters.positiveScale.push(i);
                    }
                }
                else {
                     var err = {data: 'Low Emotion Level cannot be greater than High Emotion Level'};
                     errService.error(err);
                }
            }
            console.log('in createQuery before calling getAllPosts');
            console.log('filters = ', filters);

            postService.getAllPosts(filters)
            .then(function(response) {
                console.log('getAllPosts response = ', response);
                formatPosts(response.data);
            }, function(err) {
                errService.error(err);
            });

        }

    };

    //Init - Format the postPromise on the route.
    formatPosts(postPromise.data);

  });

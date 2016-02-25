angular.module('journey')

.controller('feedCtrl',
  function($scope, $http, errService, postPromise, postService, userService, auth, pageSize, $location, $anchorScroll) {
    $scope.postContent = {};
    console.log('in feedCtrl');
    console.log('postPromise = ', postPromise);
    $scope.posts = postPromise.data;
    // $scope.totalPosts = postCount.data;
    $scope.currentPage = 1;
    $scope.query = {};
    
    $scope.gotoTop = function() {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('top');  // top of body

        // call $anchorScroll()
        $anchorScroll();
    };
       
    
    $scope.loadPage = function() {

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
        
        $scope.gotoTop();
        
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
          var filter = postService.pageOneDateFilter();
          console.log('filter = ' + filter);
          postService.getAllPosts(filter)
          .then(function(response) {
              console.log('in getAllPosts');
              console.log(response);
              $scope.posts = response.data;
              $scope.loadPage();
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
    
    $scope.createQuery = function() {
          
        var filters = {};
                   
        if ($scope.query.name) {
            filters.user = [];
            userService.getSearchUsers($scope.query.name)
            .then(function(response) {
                console.log('getSearchUsers response = ', response);
                filters.user = response.data;
                completeQuery();
            }, function(err) {
                console.error(err);
            })
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
                     var err = {data: 'Low Emotion Level cannot be greater than High Emotion Level'}
                     errService.error(err);
                }
            }
            console.log('in createQuery before calling getAllPosts')
            console.log('filters = ', filters);

            postService.getAllPosts(filters)
            .then(function(response) {
                console.log('getAllPosts response = ', response);
                $scope.posts = response.data;
                $scope.loadPage();
            }, function(err) {
                errService.error(err);
            })
            
        }
        
    };
    
    $scope.loadPage();
    
  });

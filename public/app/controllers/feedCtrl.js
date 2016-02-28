angular.module('journey')

.controller('feedCtrl',
  function($scope, $http, errService, postCount, postPromise, postService, userService, auth, pageSize, $location, $anchorScroll) {
    $scope.postContent = {};
    $scope.totalPosts = postCount.data;
    $scope.query = {};
    $scope.processingQuery = false;
    $scope.queryErrorMsg = '';
    
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
      // $scope.gotoTop();
    }//end function formatPosts

    // $scope.gotoTop = function() {
    //     // set the location.hash to the id of
    //     // the element you wish to scroll to.
    //     $location.hash('top');  // top of body
    //     // call $anchorScroll()
    //     $anchorScroll();
    // };

    //TODO: Move the get request to the service.
//    $scope.loadTags = function($query) {
//      return $http.get('tags.json', {
//        cache: true
//      }).then(function(response) {
//        var data = response.data;
//        return data.filter(function(tag) {
//          return tag.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
//        });
//      });
//    };
    
//    $scope.loadTags = function($query) {
//        return postService.autoCompleteQuery('tags', $query.toLowerCase())
//        .then(function(response) {
//            console.log('in loadTags');
//            console.log('response.data = ', response.data);
//            var data = response.data;
//            var tags = [];
//            for (var i = 0; i < response.data.length; i++) {
//                for (var j = 0; j < response.data[i].tags.length, j++) {
//                    tags.push(response.data[i].tags[j]);
//                }
//            }
//            return tags;
//        });
//    };

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
            // FIXME: This IF statement logic is retarded and doesn't work. fix it.
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
    
    $scope.clearQuery = function() {
        $scope.query = {};
        $('#daterange span').html('') // clear out contents */
    }

    $scope.createQuery = function() {
        
        $scope.queryErrorMsg = '';
        var filters = {};
        $scope.processingQuery = true;
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
                filters.tags[0] = $scope.query.tag.toLowerCase();
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
            
            console.log('query.dateRange = ', $scope.query.dateRange);
            
            if ($scope.query.dateRange) {
               filters.datePosted = [];
               for (var i = 0; i < $scope.query.dateRange.length; i++) {
                    filters.datePosted.push($scope.query.dateRange[i]);
               }
            }
                       
            console.log('in createQuery before calling getAllPosts');
            console.log('filters = ', filters);
            if (jQuery.isEmptyObject(filters)) {
                $scope.queryErrorMsg = 'Please enter search criteria';
                $scope.processingQuery = false;
                return;
            }
                
            postService.getAllPosts(filters)
            .then(function(response) {
                console.log('getAllPosts response = ', response);
                formatPosts(response.data);
                $scope.processingQuery = false;
            }, function(err) {
                errService.error(err);
            });

        }

    };
    
    $(document).ready(function() {
        
        function cb(start, end) {
            $('#daterange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            $scope.query.dateRange = [];
            $scope.query.dateRange[0] = start;
            $scope.query.dateRange[1] = end;
        }
        // cb(moment().subtract(6, 'days'), moment());
        
        $('#daterange').on('cancel.daterangepicker', function(ev, picker) {
            $('#daterange span').html('');
            delete $scope.query.dateRange;
        });
        
        $('#daterange').daterangepicker({
            startDate: moment().subtract(2, 'days'),
            endDate: moment().subtract(2, 'days'),
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            },
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

    }); 
    
    


    //Init - Format the postPromise on the route.
    formatPosts(postPromise.data);

  });

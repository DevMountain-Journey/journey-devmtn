angular.module('journey')

.controller('feedCtrl',
  function($scope, $http, errService, postPromise, postService, userService, auth, pageSize, $location, $anchorScroll) {
    $scope.postContent = {};
    $scope.totalPosts = 0;
    $scope.query = {};
    $scope.query.positiveScale = [];
    $scope.today = new Date();
    $scope.processingQuery = false;
    $scope.queryErrorMsg = '';

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

    $scope.loadAutoCompleteTags = function(fieldname, $query) {
        if (fieldname === 'tags') {
            return postService.autoCompleteQuery(fieldname, $query.toLowerCase())
            .then(function(response) {
                console.log('in loadTags');
                console.log('response.data = ', response.data);
                var autoCompleteTags = [];
                for (var i = 0; i < response.data.length; i++) {
                    for (var j = 0; j < response.data[i].tags.length; j++) {
                      autoCompleteTags.push(response.data[i].tags[j]);
                    }
                }

                autoCompleteTags = removeDuplicates(autoCompleteTags);
                return autoCompleteTags.filter(function(item) {
                     return item.indexOf($query.toLowerCase()) !== -1;
                });
            });
        }
        else { // first or last name
            return userService.autoCompleteQuery(fieldname, $query.toLowerCase())
            .then(function(response) {
                console.log('in loadTags');
                console.log('response.data = ', response.data);
                var autoCompleteTags = [];
                for (var i = 0; i < response.data.length; i++) {
                    autoCompleteTags.push(response.data[i][fieldname]);
                }

                autoCompleteTags = removeDuplicates(autoCompleteTags);
                return autoCompleteTags.filter(function(item) {
                     return item.indexOf($query.toLowerCase()) !== -1;
                });
            });
        }

        function removeDuplicates(arr) {
            var uniqueArr = [];
            $.each(arr, function(i, el){
                if($.inArray(el, uniqueArr) === -1)
                  uniqueArr.push(el);
            });
            return uniqueArr;
        }
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

    $scope.setScaleQuery = function(num) {
        var alreadySelected = false;
        for (var i = 0; i < $scope.query.positiveScale.length; i++) {
            if ($scope.query.positiveScale[i] === num + 1)  { // if already selected
                $scope.query.positiveScale.splice(i, 1);  // remove from array
                alreadySelected = true;
            }
        }
        if (!alreadySelected)
            $scope.query.positiveScale.push(num + 1);
    };

    $scope.repeatEmotions = function() {
      return new Array(10);
    };

    $scope.isToday = function(date) {
      return moment(moment(date).format('YYYY-MM-DD')).isSame(moment().local().format('YYYY-MM-DD'));
    };

    $scope.clearQuery = function() {
        $scope.query = {};
        $scope.query.positiveScale = [];
        $('#daterange span').html(''); // clear out contents */
    };

    $scope.createQuery = function() {

        $scope.queryErrorMsg = '';
        var filters = {};
        $scope.processingQuery = true;
        if (($scope.query.firstName && $scope.query.firstName.length) || ($scope.query.lastName && $scope.query.lastName.length)) {
            userService.getSearchUsers($scope.query.firstName, $scope.query.lastName)
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

            if ($scope.query.tags && $scope.query.tags.length) {
                filters.tags = [];
                for (var i = 0; i < $scope.query.tags.length; i++) {
                    filters.tags[i] = $scope.query.tags[i].name.toLowerCase();
                }
            }

            /* if ($scope.query.lowEmotion && $scope.query.highEmotion) {
                if ($scope.query.lowEmotion <= $scope.query.highEmotion) {
                    filters.positiveScale = [];
                    for (var x = $scope.query.lowEmotion; x <= $scope.query.highEmotion; x++) {
                                filters.positiveScale.push(x);
                    }
                }
                else {
                     var err = {data: 'Low Emotion Level cannot be greater than High Emotion Level'};
                     errService.error(err);
                }
            } */

            if ($scope.query.positiveScale && $scope.query.positiveScale.length) {
                 filters.positiveScale = [];
                 for (var x = 0; x < $scope.query.positiveScale.length; x++) {
                     filters.positiveScale.push($scope.query.positiveScale[x]);
                 }
            }

            console.log('query.dateRange = ', $scope.query.dateRange);

            if ($scope.query.dateRange) {
               filters.datePosted = [];
               for (var y = 0; y < $scope.query.dateRange.length; y++) {
                    filters.datePosted.push($scope.query.dateRange[y]);
               }
            }

            console.log('in createQuery before calling getAllPosts');
            console.log('filters = ', filters);
            if (jQuery.isEmptyObject(filters)) {
              $scope.processingQuery = true;
              filters = postService.pageOneDateFilter();
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
            drops: 'up',
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        //Init Tooltips
        $('[data-toggle="tooltip"]').tooltip('show');

    });


    //Init - Format the postPromise on the route.
    formatPosts(postPromise.data);

  });

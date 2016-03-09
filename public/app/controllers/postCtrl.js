angular.module('journey')
  .controller('postCtrl', function($stateParams, $scope, postService, $interval, postData, userService, errService) {

    $scope.scrollTo = function(id) {
      $('.page-content .scroll-body').slimScroll({ scrollTo: $(id).offset().top - 150 + 'px' });
    };

    $scope.postData = postData.data;
    if (!$scope.postData.numComments) {
      $scope.postData.numComments = 0;
    }

    if (postData.data.user.preferences) {
        $scope.privacy = {
          pref: postData.data.user.preferences.privacyPreferences,
          posts: true,
          stats: true
        };
    }
    else {
        $scope.privacy = {
          pref: 'public',
          posts: true,
          stats: true
        };
    }

    if(postData.data.user._id !== $scope.currentUser._id){
      if($scope.privacy.pref === 'private' || $scope.privacy.pref === 'postsprivate') $scope.privacy.posts = false;
      if($scope.privacy.pref === 'private' || $scope.privacy.pref === 'statsprivate') $scope.privacy.stats = false;
    }

    // FOLLOW
    $scope.following = false;
    $scope.postUserSignedOn = false;
    if ($scope.currentUser._id === $scope.postData.user._id) { // if current user is post user
        $scope.postUserSignedOn = true;
    }
    else if (
      $scope.currentUser.usersFollowing && $scope.currentUser.usersFollowing.indexOf($scope.postData.user._id) != -1) {
        $scope.following = true;
    }

    $scope.follow = function() {
      $scope.usersFollowing = $scope.currentUser.usersFollowing;
      $scope.usersFollowing.push($scope.postData.user._id);
      userService.updateUser({
            usersFollowing: $scope.usersFollowing
          },
          $scope.currentUser._id)
        .then(function(response) {
        //   console.log(response);
          $scope.following = true;
        }, function(err) {
          console.error('Following Error', err);
        });
    };

    $scope.unfollow = function() {
      $scope.usersFollowing = $scope.currentUser.usersFollowing;
      var index = $scope.usersFollowing.indexOf($scope.postData.user._id);
      $scope.usersFollowing.splice(index, 1);
      userService.updateUser({
            usersFollowing: $scope.usersFollowing
          },
          $scope.currentUser._id)
        .then(function(response) {
          console.log(response);
          $scope.following = false;
        }, function(err) {
          console.error('Following Error', err);
        });
    };

    // COMMENTS
    postService.getComments($scope.postData._id)
      .then(function(response) {
        $scope.comments = response.data;
      }, function(err) {
        errService.error(err);
      });


    $scope.addComment = function() {
      var post = {
        body: $scope.commentBody,
        user: $scope.currentUser._id,
        postParent: $scope.postData._id
      };
      postService.postComments(post)
        .then(function(response) {
          $scope.postData.numComments++;
          $scope.commentBody = '';
          response.data.user = {
            firstName: $scope.currentUser.firstName,
            lastName : $scope.currentUser.lastName,
            email : $scope.currentUser.email
          };
          $scope.comments.unshift(response.data);
        }, function(err){ errService.error(err); });
    };


    // DAYS USER HAS BEEN IN PROGRAM
    var a = moment(new Date());
    var b = moment($scope.postData.user.startDate);
    $scope.daysInProgram = a.diff(b, 'days');
    console.log($scope.postData.user.startDate, "date");
    // console.log($scope.daysInProgram, "days in program");

    // USER AVERAGE
    postService.averageQuery('user', $scope.postData.user._id, 'allTime')
      .then(function(response) {
        // console.log('checkuserAverage', response);
        $scope.userAverage = Math.round(response.data[0].avg);
        // console.log($scope.userAverage, "userAverage");
        $scope.userCount = response.data[0].count;
      }, function(err) {
        console.error('checkForUserAverage', err);
      });
    // COHORT AVERAGE
    postService.averageQuery('cohort', $scope.postData.user._id, 'allTime')
      .then(function(response) {
        // console.log('checkcohortAverage', response);
        $scope.cohortAverage = Math.round(response.data[0].avg);
        // console.log($scope.cohortAverage, "cohortAverage");
        $scope.cohortCount = response.data[0].count;
      }, function(err) {
        console.error('checkForCohortAverage', err);
      });

    //    USER LAST WEEK
    postService.averageQuery('user', $scope.postData.user._id, 'week')
      .then(function(response) {
        // console.log('checkuserLastWeek', response);
        $scope.userAverageLastWeek = Math.round(response.data[0].avg);
        // console.log($scope.userAverageWeekly, "userAverageWeekly");
        $scope.userCountLastWeek = response.data[0].count;
      }, function(err) {
        console.error('checkForUserAverageWeekly', err);
      });


    // COHORT LAST WEEK
    postService.averageQuery('cohort', $scope.postData.user._id, 'week')
      .then(function(response) {
        // console.log('checkCohortAverageWeekly', response);
        $scope.cohortAverageLastWeek = Math.round(response.data[0].avg);
        // console.log($scope.userAverage, "cohortlastWeek");
        $scope.cohortLastWeekCount = response.data[0].count;
      }, function(err) {
        console.error('checkForcohortLastWeek', err);
      });


  });

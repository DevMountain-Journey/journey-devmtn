angular.module('journey')
.controller('statsCtrl', function($scope, postService) {
  var lineChartOptions = {
      onAnimationComplete: function(){
          this.showTooltip(this.datasets[0].points, true);
      }
    };

  $scope.averages = {
    data: [[]],
    labels: [],
    options: {
        onAnimationComplete: function(){
            this.showTooltip(this.datasets[0].bars, true);
        }
      }
  };

  $scope.postDataUser = {
    data: [[]],
    labels: [],
    options: lineChartOptions
  };

  String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
  };


$scope.getStats = function(date){
  $scope.getAverages(date);
  $scope.getPosts(date);
};

  $scope.getAverages = function(date){
    postService.getAverages(date, $scope.currentUser)
    .then(
      function(response){
        $scope.range = date;

        $scope.averages.data = [[]];
        $scope.averages.labels = [];

        $scope.avgs = response;
        if($scope.avgs.dataUser.length > 0) {
          $scope.averages.data[0].push(_.round($scope.avgs.dataUser[0].avg));
          $scope.averages.labels.push($scope.currentUser.firstName.capitalize() + ' ' + $scope.currentUser.lastName.capitalize());
        }
        if($scope.avgs.dataCohort.length > 0) {
          $scope.averages.data[0].push(_.round($scope.avgs.dataCohort[0].avg));
          $scope.averages.labels.push('Cohort');
        }
        if($scope.avgs.dataFollowing.length > 0) {
          $scope.averages.data[0].push(_.round($scope.avgs.dataFollowing[0].avg));
          $scope.averages.labels.push('Following');
        }
        if($scope.avgs.dataMentor.length > 0) {
          $scope.averages.data[0].push(_.round($scope.avgs.dataMentor[0].avg));
          $scope.averages.labels.push('Mentor Group');
        }
      },
      function(error){
        errService.error(error);
      });
  };

  $scope.getPosts = function(date){
    postService.getPosts(date, $scope.currentUser)
    .then(
      function(response){
        $scope.postDataUser.data = [[]];
        $scope.postDataUser.labels = [];

        $scope.posts = response;

        for (var prop in $scope.posts) {
          if ($scope.posts.hasOwnProperty(prop)) {
            $scope.posts[prop] = formatPostData($scope.posts[prop]);
          }
        }

        if($scope.posts.dataUser.length > 0) {
          if(date === 'day'){
            $scope.posts.dataUser[0].posts.forEach(function(post, index){
              // console.log(post);
              $scope.postDataUser.labels.unshift(moment(post.datePosted, 'MM-DD-YYYYThh:mm:ss').format('h:mm a'));
              $scope.postDataUser.data[0].unshift(post.positiveScale);
            });
          } else {
          for (var i = 0; i < $scope.posts.dataUser.length; i++) {
            //Loop through User Posts and add each date as a chart label
            $scope.postDataUser.labels.unshift(moment($scope.posts.dataUser[i].date, 'MM-DD-YYYYThh:mm:ss').format('M-D-YYYY'));
            var scorearr = [];
            for (var x = 0; x < $scope.posts.dataUser[i].posts.length; x++) {
              //Loop through the posts array for each date data point and average the scores and push to data array.
              scorearr.push($scope.posts.dataUser[i].posts[x].positiveScale);
            }
            $scope.postDataUser.data[0].unshift(_.round(_.mean(scorearr)));
          }
        }
        }
        // if($scope.posts.dataCohort.length > 0) {
        //   $scope.averages.data[0].push(_.round($scope.avgs.dataCohort[0].avg, 1));
        //   $scope.averages.labels.push('Cohort');
        // }
        // if($scope.avgs.dataFollowing.length > 0) {
        //   $scope.averages.data[0].push(_.round($scope.avgs.dataFollowing[0].avg, 1));
        //   $scope.averages.labels.push('Following');
        // }
        // if($scope.avgs.dataMentor.length > 0) {
        //   $scope.averages.data[0].push(_.round($scope.avgs.dataMentor[0].avg, 1));
        //   $scope.averages.labels.push('Mentor Group');
        // }
      },
      function(error){
        errService.error(error);
      });
  };


$scope.getStats('week');

  function formatPostData(data){
    var groupedPosts = _.groupBy(data, function(post){
      post.datePosted = moment(post.datePosted).local().format("MM-DD-YYYYTHH:mm:ss");
      return post.datePosted.substring(0, 10);
    });
    var postarr = [];
    for(var date in groupedPosts){
      postarr.push({
        date: date,
        posts: groupedPosts[date]
      });
    }
    return postarr;
  }

});

angular.module('journey')
.controller('statsCtrl', function($scope, postService) {
  $scope.averages = {
    data: [[]],
    labels: [],
    options: {
        responsive: true,
        tooltipTemplate: '<%= value %>',
        tooltipFillColor: 'rgba(0,0,0,0)',
        tooltipFontColor: '#444',
        tooltipFontStyle: 'bold',
        tooltipFontSize: 16,
        tooltipEvents: [],
        tooltipCaretSize: 0,
        onAnimationComplete: function(){
            this.showTooltip(this.datasets[0].bars, true);
        }
    }
  };

  $scope.postData = {
    data: [],
    labels: [],
    series: []
  };


  // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  // $scope.series = ['Series A', 'Series B'];
  // $scope.data = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];


  String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
  };

  $scope.getAverages = function(date){
    postService.getAverages(date, $scope.currentUser)
    .then(
      function(response){
        $scope.averages.data = [[]];
        $scope.averages.labels = [];

        $scope.avgs = response;
        if($scope.avgs.dataUser.length > 0) {
          $scope.averages.data[0].push(_.round($scope.avgs.dataUser[0].avg, 1));
          $scope.averages.labels.push($scope.currentUser.firstName.capitalize() + ' ' + $scope.currentUser.lastName.capitalize());
        }
        if($scope.avgs.dataCohort.length > 0) {
          $scope.averages.data[0].push(_.round($scope.avgs.dataCohort[0].avg, 1));
          $scope.averages.labels.push('Cohort');
        }
        if($scope.avgs.dataFollowing.length > 0) {
          $scope.averages.data[0].push(_.round($scope.avgs.dataFollowing[0].avg, 1));
          $scope.averages.labels.push('Following');
        }
        if($scope.avgs.dataMentor.length > 0) {
          $scope.averages.data[0].push(_.round($scope.avgs.dataMentor[0].avg, 1));
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
        // $scope.averages.data = [[]];
        // $scope.averages.labels = [];

        $scope.posts = response;

        for (var prop in $scope.posts) {
          if ($scope.posts.hasOwnProperty(prop)) {
            $scope.posts[prop] = formatPostData($scope.posts[prop]);
          }
        }

        if($scope.posts.dataUser.length > 0) {
          $scope.postData.data.push();
          $scope.postData.labels.push();
          $scope.postData.series.push();
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

  $scope.getAverages('week');
  $scope.getPosts('week');


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

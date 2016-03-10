angular.module('journey')
.controller('statsCtrl', function($scope, postService) {
  var lineChartOptions = {
      onAnimationComplete: function(){
          this.showTooltip(this.datasets[0].points, true);
      }
    };

  $scope.averageLabel = 'Average';

  $scope.averages = {
    data: [[]],
    labels: [],
    options: {
      // // tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
      // tooltipTemplate: function(valuesObject){
      //   console.log(valuesObject);
      //   return valuesObject.value;
      // },
        onAnimationComplete: function(){
            this.showTooltip(this.datasets[0].bars, true);
        }
      }
  };


  $scope.postData = {
    user: {
      data: [[]],
      labels: [],
      options: lineChartOptions
    },
    cohort: {
      data: [[]],
      labels: [],
      options: lineChartOptions
    },
    following:{
      data: [[]],
      labels: [],
      options: lineChartOptions
    },
    mentor:{
      data: [[]],
      labels: [],
      options: lineChartOptions
    }
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
        $scope.postData.user.data = [[]];
        $scope.postData.user.labels = [];
        $scope.postData.cohort.data = [[]];
        $scope.postData.cohort.labels = [];
        $scope.postData.following.data = [[]];
        $scope.postData.following.labels = [];
        $scope.postData.mentor.data = [[]];
        $scope.postData.mentor.labels = [];

        $scope.posts = response;

        for (var prop in $scope.posts) {
          if ($scope.posts.hasOwnProperty(prop)) {
            $scope.posts[prop] = formatPostData($scope.posts[prop]);
          }
        }

        if($scope.posts.dataUser.length > 0) {
          if(date === 'day'){
            $scope.averageLabel = null;
            $scope.posts.dataUser[0].posts.forEach(function(post, index){
              $scope.postData.user.labels.unshift(moment(post.datePosted, 'MM-DD-YYYYThh:mm:ss').format('h:mm a'));
              $scope.postData.user.data[0].unshift(post.positiveScale);
            });
          } else {
            $scope.posts.dataUser.forEach(function(postSet){
              $scope.postData.user.labels.unshift(moment(postSet.date, 'MM-DD-YYYYThh:mm:ss').format('M-D-YYYY')); //Loop through User Posts and add each date as a chart label
              var scorearr = [];
              postSet.posts.forEach(function(post){
                scorearr.push(post.positiveScale); //Loop through the posts array for each date data point and average the scores and push to data array.
              });
              $scope.postData.user.data[0].unshift(_.round(_.mean(scorearr)));
            });
          }
        }

        if($scope.posts.dataCohort.length > 0) {
          if(date === 'day'){
            $scope.averageLabel = null;
            $scope.posts.dataCohort[0].posts.forEach(function(post, index){
              $scope.postData.cohort.labels.unshift(moment(post.datePosted, 'MM-DD-YYYYThh:mm:ss').format('h:mm a'));
              $scope.postData.cohort.data[0].unshift(post.positiveScale);
            });
          } else {
            $scope.posts.dataCohort.forEach(function(postSet){
              $scope.postData.cohort.labels.unshift(moment(postSet.date, 'MM-DD-YYYYThh:mm:ss').format('M-D-YYYY')); //Loop through User Posts and add each date as a chart label
              var scorearr = [];
              postSet.posts.forEach(function(post){
                scorearr.push(post.positiveScale); //Loop through the posts array for each date data point and average the scores and push to data array.
              });
              $scope.postData.cohort.data[0].unshift(_.round(_.mean(scorearr)));
            });
          }
        }

        if($scope.posts.dataFollowing.length > 0) {
          if(date === 'day'){
            $scope.averageLabel = null;
            $scope.posts.dataFollowing[0].posts.forEach(function(post, index){
              $scope.postData.following.labels.unshift(moment(post.datePosted, 'MM-DD-YYYYThh:mm:ss').format('h:mm a'));
              $scope.postData.following.data[0].unshift(post.positiveScale);
            });
          } else {
            $scope.posts.dataFollowing.forEach(function(postSet){
              $scope.postData.following.labels.unshift(moment(postSet.date, 'MM-DD-YYYYThh:mm:ss').format('M-D-YYYY')); //Loop through User Posts and add each date as a chart label
              var scorearr = [];
              postSet.posts.forEach(function(post){
                scorearr.push(post.positiveScale); //Loop through the posts array for each date data point and average the scores and push to data array.
              });
              $scope.postData.following.data[0].unshift(_.round(_.mean(scorearr)));
            });
          }
        }

        if($scope.posts.dataMentor.length > 0) {
          if(date === 'day'){
            $scope.averageLabel = null;
            $scope.posts.dataMentor[0].posts.forEach(function(post, index){
              $scope.postData.mentor.labels.unshift(moment(post.datePosted, 'MM-DD-YYYYThh:mm:ss').format('h:mm a'));
              $scope.postData.mentor.data[0].unshift(post.positiveScale);
            });
          } else {
            $scope.posts.dataMentor.forEach(function(postSet){
              $scope.postData.mentor.labels.unshift(moment(postSet.date, 'MM-DD-YYYYThh:mm:ss').format('M-D-YYYY')); //Loop through User Posts and add each date as a chart label
              var scorearr = [];
              postSet.posts.forEach(function(post){
                scorearr.push(post.positiveScale); //Loop through the posts array for each date data point and average the scores and push to data array.
              });
              $scope.postData.mentor.data[0].unshift(_.round(_.mean(scorearr)));
            });
          }
        }

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

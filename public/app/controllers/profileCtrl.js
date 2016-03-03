angular.module('journey')
.controller('profileCtrl', function($stateParams, $scope, postService, auth, $interval, userService) {
   console.log($stateParams, "STATEPARAMS");


//  console.log($scope.postData, "POSTDATA");
$scope.userInfo = auth.data;
console.log(auth, "AUTH");

           // DAYS USER HAS BEEN IN PROGRAM
var a = moment(new Date());
var b = moment($scope.userInfo.startDate);
$scope.daysInProgram = a.diff(b, 'days');
console.log($scope.daysInProgram, "days in program");


userService.profileQuery('user', $scope.userInfo._id)
    .then(function(response) {
      console.log('checking profile Average', response);
           $scope.profileAverage = Math.round(response.data[0].avg);
           console.log($scope.profileAverage, "userAverage");
            $scope.profileCount = response.data[0].count;
                }, function(err) {
                   console.error('check for profile average', err);
  });


//         // FOLLOW
//  $scope.following = false;
//  if(
//  auth.data.usersFollowing && auth.data.usersFollowing.indexOf($scope.postData.user._id) != -1 ){
//      $scope.following = true;
//  }

// $scope.follow = function(){
//     $scope.usersFollowing = auth.data.usersFollowing;
//     $scope.usersFollowing.push($scope.postData.user._id);
//     userService.updateUser(              {usersFollowing:$scope.usersFollowing},
//                  auth.data._id)
//                  .then(function(response){
//                      console.log(response);
//                      $scope.following= true;
//                  }, function(err) {
//                      console.error('Following Error', err);
//   });
// };

// $scope.unfollow = function(){
//     $scope.usersFollowing = auth.data.usersFollowing;
//     var index = $scope.usersFollowing.indexOf($scope.postData.user._id);
//     $scope.usersFollowing.splice(index, 1);
//     userService.updateUser(              {usersFollowing:$scope.usersFollowing},
//                  auth.data._id)
//                  .then(function(response){
//                      console.log(response);
//                      $scope.following= false;
//                  }, function(err) {
//                      console.error('Following Error', err);
//   });
// };







 
//             // USER AVERAGE
// postService.averageQuery('user', $scope.postData.user._id)
//     .then(function(response) {
//       console.log('checkuserAverage', response);
//            $scope.userAverage = Math.round(response.data[0].avg);
//            console.log($scope.userAverage, "userAverage");
//             $scope.userCount = response.data[0].count;
//                 }, function(err) {
//                    console.error('checkForUserAverage', err);
//   });
//                 // COHORT AVERAGE
//  postService.averageQuery('cohort', $scope.postData.user.cohort)
//     .then(function(response) {
//       console.log('checkcohortAverage', response);
//            $scope.cohortAverage = Math.round(response.data[0].avg);
//            console.log($scope.cohortAverage, "cohortAverage");
//             $scope.cohortCount = response.data[0].count;
//                 }, function(err) {
//                    console.error('checkForCohortAverage', err);
//   });

                //    USER LAST WEEK
// postService.averageQuery('userPerWeek', $scope.postData.user._id)
//     .then(function(response) {
//       console.log('checkuserLastWeek', response);
//            $scope.userAverageLastWeek = Math.round(response.data[0].avg);
//            console.log($scope.userAverageWeekly, "userAverageWeekly");
//             $scope.userCountLastWeek = response.data[0].count;
//                 }, function(err) {
//                    console.error('checkForUserAverageWeekly', err);
//   });


                // COHORT LAST WEEK
// postService.averageQuery('cohortPerWeek', $scope.postData.user.cohort)
//     .then(function(response) {
//       console.log('checkCohortAverageWeekly', response);
//            $scope.cohortLastWeek= Math.round(response.data[0].avg);
//            console.log($scope.userAverage, "cohortlastWeek");
//             $scope.cohortLastWeekCount = response.data[0].count;
//                 }, function(err) {
//                    console.error('checkForcohortLastWeek', err);
//   });



 $scope.options = {
           chart: {
                type: 'lineChart',
                height: 500,
                width:700,
                 lines2: { //options for basic line model; focus chart
        forceX: 100
    },

                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Days',
                    tickPadding: 10,
                    axisLabelDistance: 20,
                },
                yAxis: {
                    axisLabel: 'Emtional Level',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 10,
                    tickPadding:20,
                },
                callback: function(chart){
                    console.log("Chart Should be working");
                }
            },
            title: {
                enable: true,
                text: 'Glass Case of Emotion'
            },

        };

        $scope.data =  [
                {
                    values: [{x: 1, y: 5}, {x: 2, y:6}, {x: 3, y: 7}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 7}, {x: 7, y: 7}, {x:8, y: 3}, {x: 9, y: 4}, {x: 10, y: 7}, {}],
                    key: $scope.userInfo.firstName,
                    area:false,
                    color: '#353535' ,
                    dashed: 'dahsed',
                    // key: 'Feature One', //key  - the name of the series.
                    // color: '#6699ff'  //color - optional: choose your own line color.
                },
                {
                    values:  [{x: 1, y: 8}, {x: 2, y:3}, {x: 3, y: 6}, {x: 4, y: 8}, {x: 5, y: 7}, {x: 6, y: 4}, {x: 7, y: 8}, {x:8, y: 5}, {x: 9, y: 8}, {x: 10, y: 2}, {}],
                    key: 'Cohort',
                    classed: 'dashed',
                    color: '#25aae1' ,
                    area:false,

                },
                 {
                    values:  [{x: 1, y: 5}, {x: 2, y:8}, {x: 3, y: 3}, {x: 4, y: 8}, {x: 5, y: 10}, {x: 6, y: 7}, {x: 7, y: 3}, {x:8, y: 6}, {x: 9, y: 5}, {x: 10, y: 2}, {}],
                    key: 'Average',
                    strokeWidth: 5,
                    classed: 'dashed',
                    color: '#E07C0F' ,
                    area:false,

                },
            ];





});

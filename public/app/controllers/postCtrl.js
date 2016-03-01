angular.module('journey')
.controller('postCtrl', function($stateParams, $scope, postService, auth, $interval, postData) {
   console.log($stateParams, "STATEPARAMS");

 $scope.postData = postData.data;
 console.log($scope.postData, "POSTDATA");

console.log(auth, "AUTH");

            // COMMENTS 
postService.getComments($scope.postData._id)
 .then(function(response){
     $scope.comments = response.data; 
     console.log(response, " GET Comment Response");
 }, function(err) {
    console.error('checking for Comment Error', err);       
  });
  
  
$scope.addComment = function() {
    var post = {
        body: $scope.commentBody, 
        user: auth.data._id,
        postParent: $scope.postData._id
    };
        postService.postComments(post)
            .then(function(response){
             $scope.comments = response.data; 
             console.log(response, " POST Comment Response");
             $scope.commentBody = '';
             postService.getComments($scope.postData._id)
             .then(function(response){
                 $scope.comments = response.data; 
     console.log(response, "Newest comments");
             }, function(err) {
                console.error('checking for Comment Error', err);      
            }); 
         });
};
 

            // DAYS USER HAS BEEN IN PROGRAM
var a = moment(new Date());
var b = moment($scope.postData.user.startDate);
$scope.daysInProgram = a.diff(b, 'days');
console.log($scope.daysInProgram, "days in program");

            // USER AVERAGE
postService.averageQuery('user', $scope.postData.user._id)
    .then(function(response) {
      console.log('checkuserAverage', response);
           $scope.userAverage = Math.round(response.data[0].avg);
           console.log($scope.userAverage, "userAverage");
            $scope.userCount = response.data[0].count;
                }, function(err) {
                   console.error('checkForUserAverage', err);       
  });
                // COHORT AVERAGE
 postService.averageQuery('cohort', $scope.postData.user.cohort)
    .then(function(response) {
      console.log('checkcohortAverage', response);
           $scope.cohortAverage = Math.round(response.data[0].avg);
           console.log($scope.cohortAverage, "cohortAverage");
            $scope.cohortCount = response.data[0].count;
                }, function(err) {
                   console.error('checkForCohortAverage', err);       
  });
  
                //    USER LAST WEEK 
postService.averageQuery('userPerWeek', $scope.postData.user._id)
    .then(function(response) {
      console.log('checkuserLastWeek', response);
           $scope.userAverageLastWeek = Math.round(response.data[0].avg);
           console.log($scope.userAverageWeekly, "userAverageWeekly");
            $scope.userCountLastWeek = response.data[0].count;
                }, function(err) {
                   console.error('checkForUserAverageWeekly', err);       
  });
  
  
                // COHORT LAST WEEK
postService.averageQuery('cohortPerWeek', $scope.postData.user.cohort)
    .then(function(response) {
      console.log('checkCohortAverageWeekly', response);
           $scope.cohortLastWeek= Math.round(response.data[0].avg);
           console.log($scope.userAverage, "cohortlastWeek");
            $scope.cohortLastWeekCount = response.data[0].count;
                }, function(err) {
                   console.error('checkForcohortLastWeek', err);       
  });    
  
  
          
//  $scope.options = {
//            chart: {
//                 type: 'lineChart',
//                 height: 400,
//                 width:350,
//                  lines2: { //options for basic line model; focus chart
//         forceX: 100
//     },
               
//                 x: function(d){ return d.x; },
//                 y: function(d){ return d.y; },
//                 useInteractiveGuideline: true,
//                 dispatch: {
//                     stateChange: function(e){ console.log("stateChange"); },
//                     changeState: function(e){ console.log("changeState"); },
//                     tooltipShow: function(e){ console.log("tooltipShow"); },
//                     tooltipHide: function(e){ console.log("tooltipHide"); }
//                 },
//                 xAxis: {
//                     axisLabel: 'Days',
//                     tickPadding: 10,
//                     axisLabelDistance: 20,
//                 },
//                 yAxis: {
//                     axisLabel: 'Emtional Level',
//                     tickFormat: function(d){
//                         return d3.format('.02f')(d);
//                     },
//                     axisLabelDistance: 10,
//                     tickPadding:20,
//                 },
//                 callback: function(chart){
//                     console.log("Chart Should be working");
//                 }
//             },
//             title: {
//                 enable: true,
//                 text: 'Glass Case of Emotion'
//             },
           
//         };

//         $scope.data =  [
//                 {
//                     values: [{x: 1, y: 5}, {x: 2, y:6}, {x: 3, y: 7}, {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 7}, {x: 7, y: 7}, {x:8, y: 3}, {x: 9, y: 4}, {x: 10, y: 7}, {}], 
//                     key: $scope.postData.user.firstName,
//                     area:false,
//                     color: '#353535' ,
//                     // key: 'Feature One', //key  - the name of the series.
//                     // color: '#6699ff'  //color - optional: choose your own line color.
//                 },
//                 {
//                     values:  [{x: 1, y: 8}, {x: 2, y:3}, {x: 3, y: 6}, {x: 4, y: 8}, {x: 5, y: 7}, {x: 6, y: 4}, {x: 7, y: 8}, {x:8, y: 5}, {x: 9, y: 8}, {x: 10, y: 2}, {}],
//                     key: 'Average',
//                     classed: 'dashed',
//                     color: '#25aae1' ,  
//                     area:false,
                   
//                 },
//             ];
        
        
           
       
    
});
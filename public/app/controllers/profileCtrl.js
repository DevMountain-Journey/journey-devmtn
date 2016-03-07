angular.module('journey')
.controller('profileCtrl', function($stateParams, $scope, postService, auth, user, $interval,userAverage, mentorAverage, cohortAverage, followersAverage, userService) {




$scope.userInfo = user;
$scope.userId = auth.data._id;

$scope.average = [];
$scope.count = [];
if (userAverage) {
    $scope.average[0]= Math.round(userAverage.avg);
    $scope.count[0] = userAverage.count;
 }
else {
        $scope.average[0] = 0;
        $scope.count[0] = 0;
    }
    if (cohortAverage) {
    $scope.average[1]= Math.round(cohortAverage.avg);
    $scope.count[1] = cohortAverage.count;
 }
else {
        $scope.average[1] = 0;
        $scope.count[1] = 0;
    }

if (followersAverage) {
    $scope.average[2]= Math.round(followersAverage.avg);
    $scope.count[2] = followersAverage.count;
 }
else {
        $scope.average[2] = 0;
        $scope.count[2] = 0;
    }
if (mentorAverage) {
    $scope.average[3]= Math.round(mentorAverage.avg);
    $scope.count[3] = mentorAverage.count;
 }
else {
        $scope.average[3] = 0;
        $scope.count[3] = 0;
    }
// $scope.average[1]= Math.round(cohortAverage.avg);
// $scope.average[2]= Math.round(followersAverage.avg);
// $scope.average[3]= Math.round(mentorAverage.avg);

$scope.durationTitle = ["Past 24 Hours", "Past Week", "Past Month", "All Time"];
$scope.switchTitle = 0;

$scope.findEmotionLevel = function(duration){
   $scope.switchTitle = duration;
   $scope.options.title.text = $scope.durationTitle[$scope.switchTitle] + ' Avg Emotion Level';
   switch (duration) {
       case 0:
            $scope.textDuration = 'day';
            break;
        case 1:
            $scope.textDuration = 'week';
            break;
         case 2:
            $scope.textDuration = 'month';
            break;
         case 3:
            $scope.textDuration = 'allTime';
            break;
   }

   postService.getEmotions($scope.textDuration, user)
        .then(function(response){
            console.log($scope.data, "data values");
            if (response.dataUser.length) {
            $scope.average[0] = Math.round(response.dataUser[0].avg);
            $scope.count[0] = response.dataUser[0].count;
            }
            else {
                $scope.average[0] = 0;
                $scope.count[0] = 0;
            }
            if (response.dataCohort.length) {
            $scope.average[1] = Math.round(response.dataCohort[0].avg);
            $scope.count[1] = response.dataCohort[0].count;
            }
            else {
                $scope.average[1] = 0;
                $scope.count[1] = 0;
            }
            if (response.dataFollowing.length) {
            $scope.average[2] = Math.round(response.dataFollowing[0].avg);
            $scope.count[2] = response.dataFollowing[0].count;
            }
            else {
                $scope.average[2] = 0;
                $scope.count[2] = 0;
            }
            if (response.dataMentor.length) {
            $scope.average[3] = Math.round(response.dataMentor[0].avg);
            $scope.count[3] = response.dataMentor[0].count;
            }
            else {
                $scope.average[3] = 0;
                $scope.count[3] = 0;
            }
            // $scope.average[1] = response.dataCohort;
            // $scope.average[2] = response.dataFollowing;
            // $scope.average[3] = response.dataMentor;
            $scope.data[0].values[0].value = $scope.average[0];
            $scope.data[0].values[1].value = $scope.average[1];
            $scope.data[0].values[2].value = $scope.average[2];
            $scope.data[0].values[3].value = $scope.average[3];
            $scope.data[0].values[0].label = $scope.userInfo.firstName +' (' + $scope.count[0] + ' posts)' ;
            $scope.data[0].values[1].label = 'cohort' +' (' + $scope.count[1] + ' posts)' ;
            $scope.data[0].values[2].label = 'followers' +' (' + $scope.count[2] + ' posts)' ;
            $scope.data[0].values[3].label = 'mentor' +' (' + $scope.count[3] + ' posts)' ;

          $scope.api.refresh();

   });
   console.log($scope.switchTitle, "after function");
};



           // DAYS USER HAS BEEN IN PROGRAM
var a = moment(new Date());
var b = moment($scope.userInfo.startDate);
$scope.daysInProgram = a.diff(b, 'days');
console.log($scope.daysInProgram, "days in program");
$scope.first = $scope.userInfo.firstName;
$scope.last = $scope.userInfo.lastName;


 $scope.optionsObject = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                width: 700,
                showLegend: true,
               
                yDomain: [1,10],
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value; },
                showValues: true,
                showLabels: true,

                valueFormat: function(d){
                    return d3.format('.0f')(d);
                },
                duration: 500,
                xAxis: {


                },
                yAxis: {
                    axisLabel:'Emotion Level',
                    axisLabelDistance: -15,
                    tickFormat:d3.format('.0f'),
                    tickValues:([1,2,3,4,5,6,7,8,9,10]),
                    showMax: true,
                    rotateYLabel: true,

                },


            },
            title: {
                    enable:true,
                    text: $scope.durationTitle[$scope.switchTitle] + ' Avg Emotion Level'
                }
        };



$scope.dataObject = [
    {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : $scope.userInfo.firstName +' (' + $scope.count[0] + ' posts)' ,
                        "value" : $scope.average[0],

                    } ,
                    {
                        "label" : "cohort" +' (' + $scope.count[1] + ' posts)',
                        "value" : $scope.average[1],

                    } ,
                    {
                        "label" : "followers" +' (' + $scope.count[2] + ' posts)' ,
                        "value" : $scope.average[2],

                    } ,
                    {
                        "label" : "mentor" +' (' + $scope.count[3] + ' posts)' ,
                        "value" :$scope.average[3],

                    }

                ]
            }
        ];

    $scope.options = $scope.optionsObject;

    $scope.data = $scope.dataObject;

});

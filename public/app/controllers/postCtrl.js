angular.module('journey')
.controller('postCtrl', function($stateParams, $scope, postService, auth) {
   console.log($stateParams, "STATEPARAMS");

 
 $scope.postData = postService.getOnePost($stateParams.id)
.then(function(response) {
            $scope.postData = response.data;   
            $scope.config = {
    title: 'Average Emotion',
    tooltips: true,
    labels: true,
    responsive:true,
    // legend: {
    //   display: false,
    //   //could be 'left, right'
    //   position: 'right',
    // },       
  };

$scope.data = {

  series: [$scope.postData.user.firstName, 'Average'],
  data: [{
      x: $scope.postData.user.lastName,
      y: [$scope.postData.positiveScale],
      tooltip: $scope.postData.user.firstName
        }, {
      x: "average",
      y: [3],
      tooltip: "Average"
    }],
  };    
           
          },
          function(error) {
            return error;
          });
   console.log($scope.postData, "postData"); 
       
       
         
    
});
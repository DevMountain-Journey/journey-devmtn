angular.module('journey')
.controller('postCtrl', function($stateParams, $scope, postService, auth, $interval) {
   console.log($stateParams, "STATEPARAMS");

 
 $scope.postData = postService.getOnePost($stateParams.id)
.then(function(response) {
            $scope.postData = response.data;   
  function ChartJSBarController($interval) {
        var vm = this;
        vm.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        vm.series = ['Series A', 'Series B'];

        /////////

        function randomData() {
            vm.data = [];
            for(var series = 0; series < vm.series.length; series++) {
                var row = [];
                for(var label = 0; label < vm.labels.length; label++) {
                    row.push(Math.floor((Math.random() * 100) + 1));
                }
                vm.data.push(row);
            }
        }

        // init

        randomData();

        // Simulate async data update
        $interval(randomData, 5000);
    }
    
           
          },
          function(error) {
            return error;
          });
   console.log($scope.postData, "postData"); 
       
       
         
    
});
angular.module('journey')
.controller('statsCtrl', function($scope, postService) {
  $scope.averages = {
    data: [[]],
    labels: []
  };

  $scope.addtochart = function(){
    $scope.averages.data[0].push(Math.floor(Math.random() * 100));
    $scope.averages.labels.push(Math.floor(Math.random() * 100));
  };

  String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
  };

  $scope.getAverages = function(date){
    postService.getAverages(date, $scope.currentUser)
    .then(
      function(response){
        $scope.averages = {
          data: [[]],
          labels: []
        };
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

  $scope.getAverages('week');


});

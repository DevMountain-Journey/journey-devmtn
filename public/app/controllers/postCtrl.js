angular.module('journey')
.controller('postCtrl', function($stateParams, $scope, postService, auth, $interval) {
   console.log($stateParams, "STATEPARAMS");

 
postService.getOnePost($stateParams.id)
.then(function(response) {
            $scope.postData = response.data; 
            console.log($scope.postData, "checking");  
 $scope.options = {
           chart: {
                type: 'lineChart',
                height: 400,
                width:350,
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
                    console.log("!!! lineChart callback !!!");
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
                    key: $scope.postData.user.firstName,
                    area:false,
                    color: '#353535' ,
                    // key: 'Feature One', //key  - the name of the series.
                    // color: '#6699ff'  //color - optional: choose your own line color.
                },
                {
                    values:  [{x: 1, y: 8}, {x: 2, y:3}, {x: 3, y: 6}, {x: 4, y: 8}, {x: 5, y: 7}, {x: 6, y: 4}, {x: 7, y: 8}, {x:8, y: 5}, {x: 9, y: 8}, {x: 10, y: 2}, {}],
                    key: 'Average',
                    classed: 'dashed',
                    color: '#25aae1' ,  
                    area:false,
                    fill: 'none',
                },
            ];
        
        console.log($scope.data);
           
          },
          function(error) {
            return error;
          });

       
       
         
    
});
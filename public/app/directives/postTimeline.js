angular.module('journey')
  .directive('postTimeline', function() {

    return {
      restrict: 'E',
      replace: true,
      templateUrl: '/app/templates/timelineTmpl.html',
      scope: {
        days: '@'
      },
      controller: function(postService, errService, postPromise) {
        var date = Date.now();
        var posts = [];
        for (var i = 1; i <= days; i++) {

        }

        } //END CONTROLLER FUNCTION
    }; //END DIRECTIVE RETURN OBJECT

  })
  .directive('timeline-block',function(){

  });

angular.module('journey')

.constant("pageSize", {
  DAYS: 7
})

.config(function($stateProvider, $urlRouterProvider, pageSize, ChartJsProvider) {
    //Config for Stats Charts via ChartJs directive
    ChartJsProvider.setOptions({
      responsive: true,
      maintainAspectRatio: true,
      scaleBeginAtZero: true,
      // scaleOverride: true,
      // scaleSteps: 10,
      // scaleStepWidth: 1,
      // scaleStartValue: 0,
      scaleFontFamily: "'Roboto', sans-serif",
      tooltipTitleFontFamily: "'Roboto', sans-serif",
      tooltipFontFamily: "'Roboto', sans-serif",
      tooltipTemplate: '<%= value %>',
      tooltipFillColor: 'rgba(0,0,0,0)',
      tooltipFontColor: '#888',
      tooltipFontStyle: 'bold',
      tooltipFontSize: 15,
      tooltipEvents: [],
      tooltipCaretSize: 0,
    });

    //Route configurations
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: './app/templates/loginTmpl.html',
        controller: 'loginCtrl'
      })
      .state('journey', {
        abstract: true,
        url: '/',
        controller: 'mainCtrl',
        template: '<ui-view></ui-view>',
        resolve: {
          auth: function(authService, $state) {
            return authService.checkForAuth()
              .then(function(response) {
                return response;
              }, function(err) {
                $state.go('login');
              });
          }
        }
      })
      .state('feed', {
        parent: 'journey',
        url: 'feed',
        templateUrl: './app/templates/feedTmpl.html',
        controller: 'feedCtrl',
        resolve: {
            postPromise: function(postService, errService) { // sends back posts
                var filter = postService.pageOneDateFilter();
                return postService.getAllPosts(filter)
                .then(function( response ) {
                   return response;
                }, function(err) {
                   console.error(err);
                });
            }
         }
      })
      .state('timeline', {
        parent: 'feed',
        url: '/timeline',
        templateUrl: './app/templates/timelineTmpl.html'
      })
      .state('standard', {
        parent: 'feed',
        url: '/standard',
        templateUrl: './app/templates/standardFeedTmpl.html'
      })
      .state('post', {
        parent: 'journey',
        url: 'post/:id',
        controller: 'postCtrl',
        templateUrl: './app/templates/postDetailTmpl.html',
        resolve: {
          postData: function(postService, errService, $stateParams) {
            return postService.getOnePost($stateParams.id)
              .then(function(response) {
                return response;
              }, function(err) {
                console.error('checkForSinglePost', err);
              });
          }
        }
      })
      .state('preferences', {
        parent: 'journey',
        url: 'preferences',
        templateUrl: './app/templates/preferencesTmpl.html',
        controller: 'prefrencesCtrl'
      })
      .state('profile', {
        parent: 'journey',
        url: 'profile/:id',
        templateUrl: './app/templates/profileTmpl.html',
        controller: 'profileCtrl',
        resolve: {
          userAverage: function(user, postService) {
            return postService.averageQuery('user',
                user._id, 'week', 'false')
              .then(function(response) {
                return response.data[0];
              }, function(err) {
                console.error('check for profile average', err);
              });
          },
          cohortAverage: function(user, postService) {
            return postService.averageQuery('cohort',
                user._id, 'week', 'false')
              .then(function(response) {
                return response.data[0];
              }, function(err) {
                console.error('check for profile average', err);
              });
          },
          followersAverage: function(user, postService) {
            return postService.averageQuery('following',
                user._id, 'week', 'false')
              .then(function(response) {
                return response.data[0];
              }, function(err) {
                console.error('check for profile average', err);
              });
          },
          mentorAverage: function(user, postService) {
            return postService.averageQuery('mentor',
                user._id, 'week', 'false')
              .then(function(response) {
                return response.data[0];
              }, function(err) {
                console.error('check for profile average', err);
              });
          }
        }
      })
      .state('stats', {
        parent: 'journey',
        url: 'stats',
        templateUrl: './app/templates/statsTmpl.html',
        controller: 'statsCtrl'
        // resolve: {
        //   averages: function(postService, errService) {
        //     return postService.getAverages('week', $scope.currentUser)
        //       .then(function(response) {
        //         return response;
        //       }, function(err) {
        //         errService.error(err);
        //       });
        //   }
        // }
      });


    $urlRouterProvider.otherwise('feed');
  }
);

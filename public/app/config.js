angular.module('journey' )

  .constant("pageSize", {POSTS: 4, DAYS: 7})

  .config([
    '$stateProvider',
    '$urlRouterProvider',
    'pageSize',
    function($stateProvider, $urlRouterProvider, pageSize) {

      $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: './app/templates/loginTmpl.html',
        controller: 'loginCtrl'
      })

      .state('feed', {
        url: '/',
        templateUrl: './app/templates/feedTmpl.html',
        controller: 'feedCtrl',
        resolve: {
           postPromise: function(postService) { // sends back posts
             var today = moment(new Date());
             var fromDate = moment(today).subtract(pageSize.DAYS, 'days');
             var filter = {datePosted: [fromDate, today]};
             console.log('in PostPromise');
             console.log('filter = ' + filter);
             return postService.getAllPost(filter);
           },
           postCount: function(postService) {
               return postService.getCount();
           },
           auth: function(authService) {  // sends back who's logged in
             return authService.checkForAuth();
           }
        }
      })

      .state('feed.post', {
        url: '/post/:id',
        templateUrl: './app/templates/postDetailTmpl.html'
         
      })

      .state('post.add', {
        url: '/add',
        templateUrl: './templates/addTmpl.html'
      })

      .state('post.edit', {
        url: '/edit',
        templateUrl: './templates/editTmpl.html'
      });

      $urlRouterProvider.otherwise('/');
    }
  ]);

angular.module('journey' )

  .constant("pageSize", {DAYS: 7})

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
            postPromise: function(postService, errService) { // sends back posts
                var filter = postService.pageOneDateFilter();
                console.log('in PostPromise');
                console.log('filter = ', filter);
                return postService.getAllPosts(filter)
                .then(function( response ) {
                    console.log('in PostPromise response');
                    console.log('response = ', response);
                    return response;
                }, function(err) {
                    console.error(err);
                });
            },
           /* postCount: function(postService) {
               return postService.getCount()
               .then(function( response ) {
                  return response.data;
                }, function(err) {
                  errService.error(err);
              })
           }, */
            auth: function(authService, $state) {  // sends back who's logged in
                return authService.checkForAuth()
                .then(function(response) {
                    console.log('checkForAuth', response);
                    return response;
                }, function(err) {
                    console.error('checkForAuth', err);
                    $state.go('login');
                });
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

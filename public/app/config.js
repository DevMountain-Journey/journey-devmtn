
/////////////////////////////////////////
// ADDED A FAKE USER TO THE $ROOTSCOPE. AVAILABLE TO ALL STATES. SEE APP.JS
/////////////////////////////////////////


angular.module('journey')
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: './app/templates/loginTmpl.html',
        controller: 'loginCtrl'
      })

      .state('feed', {
        url: '/',
        templateUrl: './app/views/feedView.html',
        controller: 'feedCtrl',
        resolve: {
           postPromise: function(postService) {
             return postService.getAllPost();
           }
        }
      })

      .state('post', {
        url: '/post/:id',
        templateUrl: './templates/postsTmpl.html'
          //  controller: 'postCtrl',
          //  resolve: {
          //    postPromise: ['posts', function(postService){
          //       return postService.getAllPost(); }]
          //  }
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

angular.module('journey')
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
$stateProvider

    .state('feed', {
      url: '/',
      templateUrl: './app/views/feedView.html',
      controller: 'feedCtrl',
      resolve: {
       postPromise: function(postService){
          return postService.getAllPost(); }
       }
       })

     .state('posts', {
           url: '/post/:id',
           templateUrl: './templates/postsTmpl.html ',
        //    controller: 'postCtrl',
    //    resolve: {
    //    postPromise: ['posts', function(postService){
    //       return postService.getAllPost(); }]
    //    }
       })
         .state('posts.add', {
            url: '/add',
             templateUrl: './templates/addTmpl.html',

            })

          .state('posts.edit', {
            url: '/edit',
            templateUrl: './templates/editTmpl.html ',

          })


    .state('login', {
        url: '/login',
        templateUrl: './app/templates/loginTmpl.html',
        controller: 'loginCtrl',
        })
        
        .state('signup', {
        url: '/signup',
        templateUrl: './app/templates/signupTmpl.html',
        controller: 'signupCtrl',
        })

  $urlRouterProvider.otherwise('/');
}]);

angular.module('journey')
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
$stateProvider
    .state('login', {
      url: '/login',
      templateUrl: ' ',
      controller: 'loginCtrl',
    })


    .state('feed', {
      url: '/',
      templateUrl: ' ',
      controller: 'feedCtrl',
      resolve: {
       postPromise: ['posts', function(postService){
          return postService.getAllPost(); }]
       }      
       })
       
     .state('posts', {
           url: '/post/{id}',
           templateUrl: '',
           controller: 'feedCtrl',
       })
       
         .state('posts.add', {
            url: '/post/{id}/add',
            templateUrl: ' ',
            controller: 'feedCtrl',
            })
            
          .state('posts.edit', {
            url: '/post/{id}/edit',
            templateUrl: ' ',
            controller: 'feedCtrl',
            })


    .state('login', {
        url: '/login',
        templateUrl: '  ',
        controller: 'feedCtrl',
        resolve: {
        userPromise: ['users', function(userService){
            return userService.getCurrentUser(); }]
        }      
        })
    
  $urlRouterProvider.otherwise('/login');
}]);
angular.module('journey')
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
$stateProvider
    // .state('login', {
    //   url: '/login',
    //   templateUrl: ' ',
    //   controller: 'loginCtrl',
    // })


    .state('feed', {
      url: '/',
      templateUrl: './feedTmpl.html ',
      controller: 'feedCtrl',
      resolve: {
       postPromise: ['posts', function(postService){
          return postService.getAllPost(); }]
       }      
       })
       
     .state('posts', {
           url: '/post/:id',
           templateUrl: './postsTmpl.html ',
           controller: 'postCtrl',
       })
       
         .state('posts.add', {
            url: '/add',
             templateUrl: './addTmpl.html',
            
            })
            
          .state('posts.edit', {
            url: '/edit',
            templateUrl: './editTmpl.html ',
          
            })


    // .state('login', {
    //     url: '/login',
    //     templateUrl: '  ',
    //     controller: 'feedCtrl',
    //     resolve: {
    //     userPromise: ['users', function(userService){
    //         return userService.getCurrentUser(); }]
    //     }      
    //     })
    
  $urlRouterProvider.otherwise('/login');
}]);
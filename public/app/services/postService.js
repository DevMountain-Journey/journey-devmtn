angular.module('journey')
  .service('postService', function($http, $state) {

    // GET ALL POSTS
    this.getAllPost = function(filters) {
    /* Example filters
      filters = {
          tags: ['jquery', 'angular'] // any one of these tags. Always lowercase.
          user: ['56cb4697eed2e7e03c406a18','56c9ed011471537425e5a3c2'],  // any of these users
          positiveScale: [2,5,7,8,10], // any of these numbers
          datePosted: ['2016-2-22', '2016-2-23']  // all dates falling on 2016-2-22 or 2016-2-23.
      }; */
      if (filters) {
          var urlQuery = '';
          for (var type in filters){
              urlQuery += '&' + type + '=['+ filters[type]+']';
          }
          console.log('urlQuery', urlQuery);
          return $http({
              method: 'GET',
              url: '/api/posts/filterBy?' + urlQuery
          })
          .then(function(res){
              console.log('in getAllPosts');
              console.log(res);
              return res;
          });
      }
      else {
          return $http.get('/api/posts')
          .then(function(res){
              console.log(res);
              return res;
          });
      }
    };

    // GET ONE POST
    this.getOnePost = function(id) {
      return $http.get('/api/posts/' + id)
        .then(function(response) {
            return response.data;
          },
          function(error) {
            return error;
          });
    };


      // CREATE POST
      this.createPost = function(post) {
          return $http({
            method: 'POST',
            url:  '/api/posts/',
            data: post
          })
          .then(function(response){
              return response;
          });
      };


    // UPDATE POST
    this.updatePost = function(post) {
      return $http.put('/api/posts/' + post._id)
        .then(function(response) {
            return response;
          },
          function(error) {
            return error;
          });
    };

    this.deletePost = function(id) {
      return $http.delete('/api/posts/' + id);
    };

    this.getCount = function() {
        return $http.get('/api/count/posts')
        .then(function(res){
          console.log(res);
          return res;
      });

    };



  });

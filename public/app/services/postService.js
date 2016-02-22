angular.module('journey')
  .service('postService', function($http, $state) {

    // GET ALL POSTS
    this.getAllPost = function(pageSize, pageNumber) {
      return $http.get('/api/posts?pagesize=' + pageSize + '&pagenumber=' + pageNumber);

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
    

  });

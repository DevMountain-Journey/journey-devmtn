angular.module('journey')
  .service('postService', function($http, $state) {

    // GET ALL POSTS
    this.getAllPost = function() {
      return $http.get('/api/posts')
        .then(
          function(response) {
            console.log(response);
            return response;
            //   angular.copy(data, o.posts);
          },
          function(error) {
            return error;
          });
      // TODO: CLEANUP
      // ).catch(function(err) {
      //     console.error(err);
      //     $state.go('login');
      //   });
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

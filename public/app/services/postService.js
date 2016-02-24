angular.module('journey')
  .service('postService', function($http, $state) {

    // GET ALL POSTS
    this.getAllPost = function(pageSize, pageNumber, filters) {
      if (filters) {
          var urlQuery = ''
          for (var type in filters){
              urlQuery += '&'type +'=['+ filters[type]+']'
          }
          console.log(urlQuery)
          return $http({
              method: 'GET',
              url: '/api/posts/filterBy?' + urlQuery
          })
          .then(function(res){
              console.log(res);
              return res;        
          });
      }
      else {
          return $http.get('/api/posts?pagesize=' + pageSize + '&pagenumber=' + pageNumber)
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

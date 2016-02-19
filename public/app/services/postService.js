angular.module('journey')
.service('postService',
    function($http){

    var o = {
    posts: []
  };
            // GET ALL POSTS
  o.getAllPost = function() {
    return $http.get('/api/posts')
     .then(function(data){
         console.log(data); 
       return data;
        //   angular.copy(data, o.posts);
   });
};
           // GET ONE POST
   o.getOnePost = function(id) {
     return $http.get('/api/posts/' + id)
      .then(function(res) {
        return res.data;
    });
};
          // UPDATE POST
   o.updatePost = function(post){
     return $http.put('/api/posts/' + post._id)
      .then(function(response){
          return response;
    });
};

    o.deletePost = function(id) {
        return $http.delete('/api/posts/' + id);
    }



});

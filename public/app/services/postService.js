angular.module('journey')
.service('postService',
    function($http, $state){


             // GET ALL POSTS
  this.getAllPost = function() {
    return $http.get('/api/posts')
     .then(function(data){
         console.log(data); 
       return data;
        //   angular.copy(data, o.posts);
   }).catch(function(err){
       console.error(err)
       $state.go('login');
   })
};
           // GET ONE POST
   this.getOnePost = function(id) {
     return $http.get('/api/posts/' + id)
      .then(function(res) {
        return res.data;
    });
};
          // UPDATE POST
   this.updatePost = function(post){
     return $http.put('/api/posts/' + post._id)
      .then(function(response){
          return response;
    });
};

    this.deletePost = function(id) {
        return $http.delete('/api/posts/' + id);
    }



});

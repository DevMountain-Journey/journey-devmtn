angular.module('journey')
.service('postService', 
    function($http){
        
    var o = {
    posts: []
  };
            // GET ALL POSTS
  o.getAllPost = function() {
    return $http.get('/posts')
     .then(function(data){
       return data;
        //   angular.copy(data, o.posts);
   });
}
           // GET ONE POST
   o.getOnePost = function(id) {
     return $http.get('/posts/' + id)
      .then(function(res) {
        return res.data;
    });
}
          // UPDATE POST
   o.updatePost = function(post){
     return $http.put('/posts/' + post._id)
      .then(function(response){
          return response;          
    }); 
};
 
 
    
})
angular.module('journey')
  .service('postService', function($http, pageSize) {

    // GET ALL POSTS
    this.getAllPosts = function(filters) {
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
          console.log('urlQuery = ', urlQuery);
          return $http({
              method: 'GET',
              url: '/api/posts/filterBy?' + urlQuery
          });
      }
      else {
          return $http.get('/api/posts');
      }
    };

    // GET ONE POST
    this.getOnePost = function(id) {
      return $http.get('/api/posts/' + id);
    };


      // CREATE POST
      this.createPost = function(post) {
          return $http({
            method: 'POST',
            url:  '/api/posts/',
            data: post
          });
      };


    // UPDATE POST
    this.updatePost = function(post, id) {
      return $http ({
          method: 'PUT',
          url: '/api/posts/' + id,
          data: post
      });
    };

    this.deletePost = function(id) {
      return $http.delete('/api/posts/' + id);
    };

    this.getCount = function() {
        return $http.get('/api/count/posts');

    };

    this.pageOneDateFilter = function() {
        var today = new Date();
        var fromDate = moment(today).subtract(pageSize.DAYS, 'days');
        return {datePosted: [fromDate, today]};
    };
    
    this.autoCompleteQuery = function(fieldName, query) {
        return $http({
              method: 'GET',
              url: '/api/posts/autocomplete?' + 'fieldname=' + fieldName + '&ac_query=' + query
          });
    };
    
     this.averageQuery = function(type, num) {
         var query = '';
         switch(type){
             case 'user':
             case 'userPerWeek':
                query = 'type=' + type + '&user=' + num;
                break;
             case 'cohort':
             case 'cohortPerWeek':
                query = 'type=' + type + '&cohort=' + num;
                break;   
          }       
        return $http({
              method: 'GET',
              url: '/api/posts/getAvg?' + query
          });
    };
    
    this.getComments = function(id) {
      return $http ({
          method:'GET',
          url: '/api/comments?postParent=' + id
      });
    };
  
   this.postComments = function(post) {
      return $http ({
          method:'POST',
          url: '/api/comments/',
          data: post
      });
    };
  
  
  
  });

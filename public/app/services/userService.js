angular.module('journey')
  .service('userService', function($http, $q) {


    this.getUser = function(id) {
      return $http({
        method: 'GET',
        url: '/api/users?_id=' + id
      });
    };


    // GET USERS
    this.getSearchUsers = function(firstName, lastName) {

      var defer = $q.defer();
      var users = [];
      var resp = {};
      var userQuery = '';
      // Name may be space separated
      //  var name = inputName.split(' ');

      // Need to first translate to ID by doing user lookup.

      if (firstName && firstName.length) { // at least one first name entered
        userQuery += 'firstName=[';
        for (var i = 0; i < firstName.length; i++) {
          if (i === 0)
            userQuery += firstName[i].name.toLowerCase();
          else
            userQuery += ',' + firstName[i].name.toLowerCase();
        }
        userQuery += ']';
      }
      if (lastName && lastName.length) { // at least one last name enterred
        userQuery += '&lastName=[';
        for (var x = 0; x < lastName.length; x++) {
          if (x === 0)
            userQuery += lastName[x].name.toLowerCase();
          else
            userQuery += ',' + lastName[x].name.toLowerCase();
        }
        userQuery += ']';
      }
      console.log('userQuery = ', userQuery);
      $http({
          method: 'GET',
          url: '/api/users/filterBy?' + userQuery
        })
        .then(function(response) {
          console.log('response = ', response);
          addUserIds(response.data);
          resp.data = users;
          defer.resolve(resp);
        });

      function addUserIds(usrs) {
        for (var i = 0; i < usrs.length; i++) {
          users.push(usrs[i]._id);
        }
      }

      return defer.promise;

    };

    this.autoCompleteQuery = function(fieldName, query) {
      return $http({
        method: 'GET',
        url: '/api/users/autocomplete?' + 'fieldname=' + fieldName + '&ac_query=' + query
      });
    };

    this.updateUser = function(user, id) {
      return $http({
        method: 'PUT',
        url: '/api/users/' + id,
        data: user
      });
    };




  });

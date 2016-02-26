angular.module('journey')
  .service('userService', function($http, $q) {

    // GET USERS
    this.getSearchUsers = function(inputName) {
        
           var defer = $q.defer();
           var users = [];
           var resp = {};
           var actualResponses = 0;
         // Name may be space separated
           var name = inputName.split(' ');
        
        // Need to first translate to ID by doing user lookup.
     
            if (name.length === 1) {
        // If just one name entered, need to check if it matches a firstName or lastName in user record.
                expectedResponses = 2;
                
                var userQuery = 'firstName=' + name[0].toLowerCase();
                console.log('userQuery = ', userQuery);
                $http({
                    method: 'GET',
                    url: '/api/users?' + userQuery
                })
                .then(function(response) {
                    console.log('firstName response = ', response);
                    addUserIds(response.data);
                    actualResponses++;
                    checkIfAllDataDone();
                });
                
                var userQuery = 'lastName=' + name[0].toLowerCase();
                console.log('userQuery = ', userQuery);
                $http({
                    method: 'GET',
                    url: '/api/users?' + userQuery
                })
                .then(function(response) {
                    console.log('lastName response = ', response);
                    addUserIds(response.data);
                    actualResponses++;
                    checkIfAllDataDone();
                });
                
            }
            else  { // first and last name
            // If two or more names, need to check if first 2 names match 'firstName lastName' in user record.
                expectedResponses = 1;
        
                var userQuery = 'firstName=' + name[0].toLowerCase() + '&lastName=' + name[1].toLowerCase();
                console.log('userQuery = ', userQuery);
                $http({
                    method: 'GET',
                    url: '/api/users?' + userQuery
                })
                .then(function(response) {
                    console.log('firstName & lastName response = ', response);
                    addUserIds(response.data);
                    actualResponses++;
                    checkIfAllDataDone();
                });
        
            }
                     
            function addUserIds(usrs) {
                for (var i = 0; i < usrs.length; i++) {
                    users.push(usrs[i]._id);
                }
            }

            function checkIfAllDataDone() {
                if (expectedResponses === actualResponses) {
                    resp.data = users;
                    defer.resolve(resp);
                }
            }
        
            return defer.promise;

    }
                
 
  });

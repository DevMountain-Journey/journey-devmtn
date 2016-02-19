angular.module('surveys')
.service('authService', function( $http ) {
    this.login = function(userData) {
        console.log('userData = ', userData);
        
       /* var body = {
            email: userData.email,
            password: userData.password
        } */
        
        return $http({
            method: 'POST',
            url: '/api/login',
            data: userData
        });
    };
    
     this.logout = function() {
        return $http({
            method: 'GET',
            url: '/api/logout'
        });
    };
    
    this.signup = function(userData) {
        console.log('userData = ', userData);
        return $http({
            method: 'POST',
            url: '/api/signup',
            data: userData
        });
    };
    
    this.checkForAuth = function() {
        return $http({
            method: 'GET',
            url: '/api/current_user'
        });
    };
    
           
});
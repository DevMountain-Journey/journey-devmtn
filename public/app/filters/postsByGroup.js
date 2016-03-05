angular.module('journey')
  .filter('postsByGroup', function() {

    return function(input, group, auth) {
        switch(group) {
            case 'user' :
                 if (input.user._id === auth._id)
            case 'cohort' :
            case 'mentor'
            case 'following'
            case 'everyone'
        }
    }
      
      
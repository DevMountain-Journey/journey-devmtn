angular.module('journey')
  .filter('postsByGroup', function() {

    return function(input, group, current_user) {
        
        var output = [];
        
        switch(group) {
            case 'user' :
                for (var i = 0; i < input.length; i++) {
                    output[i] = {};
                    output[i].date = input[i].date;
                    output[i].posts = [];
                    for (var j = 0; j < input[i].posts.length; j++) {
                        if (input[i].posts[j].user._id === current_user._id)
                            output[i].posts.push(input[i].posts[j]);
                    }
                }
                break;
            case 'cohort' :
                for (var i = 0; i < input.length; i++) {
                    output[i] = {};
                    output[i].date = input[i].date;
                    output[i].posts = [];
                    for (var j = 0; j < input[i].posts.length; j++) {
                        if (input[i].posts[j].user.cohort === current_user.cohort)
                            output[i].posts.push(input[i].posts[j]);
                    }
                }
                break;
            case 'mentor' :
                for (var i = 0; i < input.length; i++) {
                    output[i] = {};
                    output[i].date = input[i].date;
                    output[i].posts = [];
                    for (var j = 0; j < input[i].posts.length; j++) {
                        if (input[i].posts[j].user.assignedMentor === current_user.assignedMentor)
                            output[i].posts.push(input[i].posts[j]);
                    }
                }
                break;
            case 'following' :
                for (var i = 0; i < input.length; i++) {
                    output[i] = {};
                    output[i].date = input[i].date;
                    output[i].posts = [];
                    for (var j = 0; j < input[i].posts.length; j++) {
                        if (current_user.usersFollowing.indexOf(input[i].posts[j].user._id) !== -1) 
                                output[i].posts.push(input[i].posts[j]);
                        
                    }
                }
                break;
            case 'everyone' :
            default: 
                 for (var i = 0; i < input.length; i++) {
                     output.push(input[i]);
                 }
                 break;
        }
        return output;
    }
});
      
      
# DEVMOUNTAIN JOURNEY
## Your Path at DevMountain

[Link to hosted site](http://159.203.187.71:8004)

The purpose of this project was to create a system to allow students to blog and communicate their feelings to other students. A difference from a typical blog is that students choose an emotion level from 1 through 10, with 10 being highest, and their emotion is tracked along with what they were working on at the time. This project utilized the full MEAN stack. 

Features include a feed view that is either a timeline view, with images of blog posters separated by date, or a standard view, which lists basic information about the posts in reverse date order. Filters can be applied to the data. A new blog post can easily be made from the feed view. A click into a post brings up a detail view that allows the user to see the full text of the post, some basic information and statistics about the poster, and provides the ability to comment on the post. There's also a stats view that has a number of graphs of post data. A settings page allows for the ability to specify notification and privacy options, along with the ability to provide mentor name and start date.

## Getting Started
### Prerequisites
 - Mongo database.
 -  Server with Node.js installed

### Installation
1. git clone https://github.com/DevMountain-Journey/journey-devmtn.git
2. npm install
3. bower install
4. Create a .env configuration file in the root director with the following format:
 ```
DMJ_SECRET= [put secret here]
DMJ_PORT= [put port number here]
DMJ_MONGO_URI= [put Mongolab path here]
SPARKPOST_API_KEY= [put Sparkpost API key here]
```
5. node server/index.js
6. Signup a new user.
7. Begin posting and commenting on posts.  

## Design Goals
This site was intended to be eventually integrated into the DevMountain system. A separate Passport local auth system was created to allow for testing and demonstration independent of DevMountain. Due to DevMountain already having a user admin system, a separate user admin system was not created for this project.

The site was intended to be used by DevMountain students who are technically saavy and who will usually be using a laptop computer. Responsiveness was not a primary consideration but was built into the system. 

## Detailed Usage

### Models
Here are the Mongoose collections:

```javascript
/* Comments */
    body: {type: 'String', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    postParent: {type: Schema.Types.ObjectId, ref: 'Posts'},
    commentParent: {type: Schema.Types.ObjectId, ref: 'Comments'},
    datePosted: {type: 'Date', default: Date.now}

/* Posts */
    body: {type: 'String'},
    private: {type: 'Boolean', default: false},
    positiveScale: {type: 'Number', min: 1, max: 10, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    tags: [{type: 'String', lowercase: true}],
    datePosted: {type: 'Date', default: Date.now},
    numComments: {type: 'Number', default: 0}
   
/* Users */
    firstName: {type: 'String', required: true, lowercase: true},
    lastName:{type: 'String', required: true, lowercase: true},
    email: {type: 'String', required: true, lowercase: true},
    password: {type: 'String'},
    cohort: {type: 'Number', required: true, default: 0},
    devmtnId: {type: 'Number'},
    startDate: {type: 'Date'},
    assignedMentor: {type: 'String', lowercase: true},
    usersFollowing: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    preferences: preferencesSchemabody: {type: 'String'}, 
```
Here is the preferences schema:

```javascript
/* Preferences Schema */
   viewPreferences: {type: 'String', lowercase: true, required: true, default: 'timeline', enum: ['timeline', 'standard', 'graph']},
   communicationPreferences: {type: 'String', lowercase: true, required: true, default: 'none', enum: ['none', 'newcomment', 'weeklysummary', 'all']},
   privacyPreferences: {type: 'String', lowercase: true, required: true, default: 'public', enum: ['private', 'postsprivate', 'statsprivate', 'public']},
```
### Detailed Description of System

#### Feed View
Upon login, the user encounters the feed view. This will display most recent posts on top. Based on preferences, this view is either timeline:

![Timeline Feed View](https://github.com/DevMountain-Journey/journey-devmtn/blob/master/readme_images/Journey_Timeline_Feed.jpg)

or standard feed:

![Standard Feed View](https://github.com/DevMountain-Journey/journey-devmtn/blob/master/readme_images/Journey_Standard_Feed.jpg)

Both 'timeline' and 'standard' are child states in the UI-Router config, under the parent state 'feed'. feedCtrl.js is the controller for state 'feed'.

In the feed state resolve, postService.js sends an http request to the controller to get all posts between today and pageSize.DAYS constant from today, which is currently set to 7 days. 

```javascript
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
        for (var type in filters) {
          urlQuery += '&' + type + '=[' + filters[type] + ']';
        }
        console.log('urlQuery = ', urlQuery);
        return $http({
          method: 'GET',
          url: '/api/posts/filterBy?' + urlQuery
        });
      } else {
        return $http.get('/api/posts');
      }
    };
```


This hits an endpoint in the controller which calls the following filter middleware function in postsCtrl.js (used also in advanced search queries on the feed page):

```javascript
filter: function(req, res) {
       for (var item in req.query) {
            req.query[item] = req.query[item].slice(1, req.query[item].length -1);
            req.query[item] = req.query[item].split(',');
            if (item !== 'datePosted') {
                req.query[item] = {$in: req.query[item]};
            }
            else // datePosted
                req.query[item] = {"$gte": moment(new Date(req.query[item][0])), "$lt": moment(new Date(req.query[item][1]))};
       }
       console.log('req.query after processing', req.query);
       postsModel
       .find(req.query)
       .populate('user', 'firstName lastName email cohort assignedMentor usersFollowing preferences')
       .sort({datePosted: 'desc'})
       .exec(function(err, result) {
```

The server returns all posts within the last 7 days. feedCtrl.js uses lodash _.groupBy() function to group posts by date and to arrange into a date-sorted array:

```javascript
function formatPosts(data) { //This function formats the provided post data so that we can use it effectively.
      $scope.totalPosts = data.length;
      $scope.fixedPosts = []; //Init array to accept final posts object manipulation.

      //Take the resolve post data and use lodash to group by and convert dates to local time (from UTC).
      var groupedPosts = _.groupBy(data, function(post) {
        post.datePosted = moment(post.datePosted).local().format("YYYY-MM-DDTHH:mm:ss");
        return post.datePosted.substring(0, 10);
      });
      for (var date in groupedPosts) {
        $scope.fixedPosts.push({
          date: date,
          posts: groupedPosts[date]
        });
      }
      $scope.filteredFixedPosts = postsByGroupFilter($scope.fixedPosts, 'everyone', $scope.currentUser);
    }//end function formatPosts
```

In both timeline and feed templates, posts are displayed via an ng-repeat over filteredFixedPosts (see below for timeline):

```html
<div class="posts-timeline animate" ng-repeat="posts in filteredFixedPosts track by $index | orderBy : '-date'">
```
Gravatars are used to display faces in the timeline view. Upon hovering over a gravatar, a modal pops up with basic information such as name of poster, tag, emotion image, date, and number of comments:

![Timeline Feed View Hover](https://github.com/DevMountain-Journey/journey-devmtn/blob/master/readme_images/Journey_Timeline_Hover.jpg)

Standard view shows the name of the poster, tag, emotion image, date, time, number of comments, mentor and cohort of poster, and the beginning part of the post body. There is no action upon hovering over a post.

An Angular Slimscroll directive on top of JQuery Slimscroll is used on the main body and the right sidebar to create a nice looking scrollbar that is invisible until the user mouses over the div.

```html
<div class="scroll-body" slimscroll="{ height: '100%', width: '100%', color: '#333', railVisible: true, railOpacity: '0.7', railColor: '#DDDDDD'}">
    <ui-view></ui-view>
</div><!--/.scroll-body-->
```

Creating a post is done from right sidebar of the feed page. The user clicks an emotion face corresponding to how they feel, enters a tag, then writes the body of the post, followed by hitting the "Submit" button. 

![New Post](https://github.com/DevMountain-Journey/journey-devmtn/blob/master/readme_images/Journey_New_Post.jpg)

Hovering over a face causes its size to increase, and clicking into it does the same thing, but the effect persists after the cursor moves. Clicking a face also causes the number below the face to light up yellow, and sets the $scope.postContent.positiveScale variable to be the array index + 1. Clicking on an already selected face deslects its. This is done via a parent div ng-repeating over an array of 10 elements, and an ng-include child with ng-click set to setScale($index), and src set to the appropriate small or large emoticon:

```html
<div class="emotionWrapper" ng-repeat="i in repeatEmotions() track by $index" ng-class="{'toggled':postContent.positiveScale == $index + 1}">
    <ng-include ng-click="setScale($index)" class="emotionSvg" src="'assets/img/faces/face-'+$index+'.svg'"></ng-include>
    {{$index + 1}}
</div>
```

```css
.emotions .emotionWrapper {
 width: 9%;
 color: #555;
 font-size: .7em;
 margin-bottom: 5px;
}

.emotions .emotionWrapper .emotionSvg {
 display: block;
 transition: all 200ms cubic-bezier(.87,-.41,.19,1.44);
 margin-bottom: 5px;
}

.emotions .emotionWrapper .emotionSvg svg g path:first-child {
  /*fill: #EEEEEE!important;
  fill-opacity: 0.9!important;*/
}
.emotions .emotionWrapper .emotionSvg:hover {
  cursor: pointer;
}
.emotions .emotionWrapper .emotionSvg:hover,
.emotions .emotionWrapper.toggled .emotionSvg {
  transform: scale(1.5,1.5);
}
.emotions .emotionWrapper .emotionSvg:hover svg g path:first-child {
  /*fill: #ddd468!important;*/
}
.emotions .emotionWrapper.toggled .emotionSvg svg g path:first-child {
   -webkit-animation: colorPulse 8s infinite alternate;
}

.emotions .emotionWrapper.toggled {
  color: yellow;
}
```

```javascript
$scope.setScale = function(num) {
  if ($scope.postContent.positiveScale === num + 1) {
    $scope.postContent.positiveScale = null;
  } else {
    $scope.postContent.positiveScale = num + 1;
  }
};

$scope.repeatEmotions = function() {
  return new Array(10);
};
```

The "What are you working on?" input field uses the Angular ngTagsInput directive to allow the user to tag what they're currently working on, and also provide autocomplete capability for the tags. 

```html
<tags-input class="input__field" ng-model="postContent.tags" display-property="name" placeholder="..." replace-spaces-with-dashes="false" maxLength="20" minTags="1" maxTags="5" allowLeftoverText="false" addOnEnter="false" spellcheck="false">
     <auto-complete source="loadAutoCompleteTags('tags', $query)" min-length="2" maxResultsToShow="5"></auto-complete>
</tags-input>
```

The loadAutoCompleteTags() function calls postService.autoCompleteQuery() to query the database for tags matching the characters typed in by the user:

```javascript
 $scope.loadAutoCompleteTags = function(fieldname, $query) {
        if (fieldname === 'tags') {
            return postService.autoCompleteQuery(fieldname, $query.toLowerCase())
            .then(function(response) {
                var autoCompleteTags = [];
                for (var i = 0; i < response.data.length; i++) {
                    for (var j = 0; j < response.data[i].tags.length; j++) {
                      autoCompleteTags.push(response.data[i].tags[j]);
                    }
                }

                autoCompleteTags = removeDuplicates(autoCompleteTags);
                return autoCompleteTags.filter(function(item) {
                     return item.indexOf($query.toLowerCase()) !== -1;
                });
            });
        }
        else { // first or last name
            return userService.autoCompleteQuery(fieldname, $query.toLowerCase())
            .then(function(response) {
                var autoCompleteTags = [];
                for (var i = 0; i < response.data.length; i++) {
                    autoCompleteTags.push(response.data[i][fieldname]);
                }

                autoCompleteTags = removeDuplicates(autoCompleteTags);
                return autoCompleteTags.filter(function(item) {
                     return item.indexOf($query.toLowerCase()) !== -1;
                });
            });
        }
        
        function removeDuplicates(arr) {
            var uniqueArr = [];
            $.each(arr, function(i, el){
                if($.inArray(el, uniqueArr) === -1)
                  uniqueArr.push(el);
            });
            return uniqueArr;
        }
    };

 ```
 
 The endpoint calls an autocomplete middleware function that does the regex query:
 
 ```javascript
   autocomplete: function(req, res) {
       console.log('in postsCtrl');
       console.log('in autocomplete');
       console.log('req.query before processing', req.query);
       var fieldname = req.query.fieldname;
       var ac_regex = new RegExp(req.query.ac_query);
       req.query = {};
       req.query[fieldname] = {$regex: ac_regex};
       // req.query[fieldname] = {$regex: /jq/};
       /* req.query[fieldname] = 'jquery'; */
       console.log('req.query after processing', req.query);
       postsModel
       .find(req.query, fieldname)
       .sort({datePosted: 'desc'})
       .exec(function(err, result) {
 ```
 
The "Thoughts?" input field expands upon the user clicking into it. This is accomplished by a transition from 45px to 200px height when focus is applied to the field:
 
```html
<fieldset class="form-group fancy-input" ng-class="{'input--filled': postContent.body}">
    <textarea class="form-control input__field" id="thoughts" rows="1" ng-model="postContent.body"></textarea>
    <label class="input__label" for="thoughts">
      <span class="input__label-content" data-content="Thoughts?">Thoughts?</span>
    </label>
</fieldset>
```

```css
#thoughts{
  resize: none;
  min-height:45px;
  height: 45px;
  transition: height 500ms ease-in-out;
}

#thoughts:focus,
.input--filled #thoughts{
  height:200px;
}
```
Markdown input is allowed in the "Thoughts?" input field via the Angular Marked directive. 

After submitting the new post, it displays on the top of the post feed. This is done via an unshift method on the $scope.fixedPosts array:

```javascript
postService.createPost($scope.postContent)
   .then(function(response) {
       if (response.status === 200) {
           $scope.postContent = {};
           $scope.totalPosts++;
           var post = response.data;
           var postDate = moment(post.datePosted).local().format('YYYY-MM-DD');
           if($scope.fixedPosts.length && postDate === $scope.fixedPosts[0].date){ //If the postdate is the same as the first date in the fixedPosts array.
               $scope.fixedPosts[0].posts.unshift(post); //then just unshift (push to top) the post to the top of the first item in the fixedPost array
           } else {
               $scope.fixedPosts.unshift({ //Otherwise unshift a new item into fixedPosts with todays date and an array with the new post in it.
                  date: postDate,
                  posts: [post]
               });
           }
```      

The Advanced Search feature allows the user to search for posts by first name, last name, what was the person working on, date posted, and emotion level. The input fields for first and last name, and working on, all have the autocomplete capability described above, and text input (2 or more characters) in these fields calls the loadAutoCompleteTags() function. The date selection field utilizes the Bootstrap Date Range Picker:

![Date Range Picker](https://github.com/DevMountain-Journey/journey-devmtn/blob/master/readme_images/Journey_Date_Range_Picker.jpg)

This relies on the following JQuery code:

```javascript
function cb(start, end) {
            $('#daterange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            $scope.query.dateRange = [];
            $scope.query.dateRange[0] = start;
            $scope.query.dateRange[1] = end;
        }
        // cb(moment().subtract(6, 'days'), moment());

        $('#daterange').on('cancel.daterangepicker', function(ev, picker) {
            $('#daterange span').html('');
            delete $scope.query.dateRange;
        });

        $('#daterange').daterangepicker({
            startDate: moment().subtract(2, 'days'),
            endDate: moment().subtract(2, 'days'),
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear'
            },
            drops: 'up',
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
```

Selecting an emotion face is similar to that when creating a new post, except that in the Advanced Search you can select multiple emotions to query. After filling in all the search fields, the user hits the "Search" button, which calls the createQuery function:

```javascript
$scope.createQuery = function() {

    $scope.queryErrorMsg = '';
    var filters = {};
    $scope.processingQuery = true;
    if (($scope.query.firstName && $scope.query.firstName.length) || ($scope.query.lastName && $scope.query.lastName.length)) {
        userService.getSearchUsers($scope.query.firstName, $scope.query.lastName)
        .then(function(response) {
            if (response.data.length)
                filters.user = response.data;
            else // No users fit criteria
                filters.user = ['999999999999999999999999']; // Create empty search
            completeQuery();
        }, function(err) {
            console.error(err);
        });
    }
    else {
        completeQuery();
    }

    function completeQuery() {

        if ($scope.query.tags && $scope.query.tags.length) {
            filters.tags = [];
            for (var i = 0; i < $scope.query.tags.length; i++) {
                filters.tags[i] = $scope.query.tags[i].name.toLowerCase();
            }
        }

        if ($scope.query.positiveScale && $scope.query.positiveScale.length) {
             filters.positiveScale = [];
             for (var x = 0; x < $scope.query.positiveScale.length; x++) {
                 filters.positiveScale.push($scope.query.positiveScale[x]);
             }
        }

        if ($scope.query.dateRange) {
           filters.datePosted = [];
           for (var y = 0; y < $scope.query.dateRange.length; y++) {
                filters.datePosted.push($scope.query.dateRange[y]);
           }
        }

        console.log('in createQuery before calling getAllPosts');
        console.log('filters = ', filters);
        if (jQuery.isEmptyObject(filters)) {
          $scope.processingQuery = true;
          filters = postService.pageOneDateFilter();
        }

        postService.getAllPosts(filters)
        .then(function(response) {
            formatPosts(response.data);
            if($scope.sidebarToggle === true) $scope.sidebarToggle = false;
            $scope.processingQuery = false;
        }, function(err) {
            errService.error(err);
        });

    }

};
```

This calls postService.getAllPosts function described above, passing in the filters variable containing the search criteria entered by the user. This hits an endpoint calling the filter middleware function described above.

The filter feature near the top of the page provides a way to filter the data that has already been retrieved from the database. A menu allows the user to filter by "My Posts", "My Cohort", "My Mentor Group", "Following", or "Everyone" (i.e. cancel the filter).

```html
<div class="hidden-md-down" style="display:inline;">
    <strong class="hidden-lg-down">FILTER:</strong>
    <span ng-click="filterByGroup('user')" ng-class="{toggled: group == 'user'}">My Posts</span>
    <span ng-click="filterByGroup('cohort')" ng-class="{toggled: group == 'cohort'}">My Cohort</span>
    <span ng-click="filterByGroup('mentor')" ng-class="{toggled: group == 'mentor'}">My Mentor Group</span>
    <span ng-click="filterByGroup('following')" ng-class="{toggled: group == 'following'}">Following</span>
    <span ng-click="filterByGroup('everyone')" ng-class="{toggled: group == 'everyone'}">Everyone</span>
</div>
```

The filterByGroup() function in feedCtrl.js calls postsByGroupFilter(), an Angular filter, which filters the data based on the selection:

```javascript
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
```      

#### Post Detail View
Clicking into the modal on the feed view, or the post div on the standard view, brings up the post detail screen. From the post detail screen, the user can see the full post, comment on the post, see previous comments, follow the poster, and also view some basic stats about the poster's average emotion level compared to his cohort's level:

![Post Detail Page](https://github.com/DevMountain-Journey/journey-devmtn/blob/master/readme_images/Journey_Post_Detail_Page.jpg)

Comments are retrieved from the Comments collection via a postService.getComments() call, and new comments are added via a postService.postComments() call. After adding a new comment, the new comment shows at the top of the list of comments via an array unshift() call:

```javascript
$scope.addComment = function() {
      var post = {
        body: $scope.commentBody,
        user: $scope.currentUser._id,
        postParent: $scope.postData._id
      };
      postService.postComments(post)
        .then(function(response) {
          $scope.postData.numComments++;
          $scope.commentBody = '';
          response.data.user = {
            firstName: $scope.currentUser.firstName,
            lastName : $scope.currentUser.lastName,
            email : $scope.currentUser.email
          };
          $scope.comments.unshift(response.data);
        }, function(err){ errService.error(err); });
    };
```

The appearance of the comment list, with the gravatar image of the commentor to the left, and speech balloon to the right, is achieved by the following html and css. Note the use of the am-time-ago directive to format the comment date. Note also the 45 degree rotation in the comment-body:before class to achieve the speech balloon effect:

```html
<div class="comment clearfix" ng-repeat="comment in comments">
     <div class="comment-meta">
       <img gravatar-src="comment.user.email" gravatar-size="50" gravatar-default="mm">
       <div class="comment-author">{{comment.user.firstName}} {{comment.user.lastName}}</div>
       <div class="comment-time" am-time-ago="comment.datePosted"></div>
     </div>
     <div class="comment-body" marked="comment.body"></div>
 </div>
```

```css
.comment{
  margin-bottom: 30px;
  position: relative;
}
.comment .comment-meta{
  font-size: .8em;
  color: #555;
  float: left;
  width: 110px;
  text-align: center;
  left: -20px;
  position: relative;
  padding-right: 5px;
}
.comment .comment-meta img{
  border-radius: 50%;
  border: 3px solid #a3d39c;
}
.comment .comment-meta .comment-author{
  text-transform: capitalize;
  font-weight: bold;
}
.comment .comment-meta .comment-time{
  font-size: .9em;
  color: #666;
  font-style: italic;
}
.comment .comment-body{
  max-width: 700px;
  float: left;
  background: #a3d39c;
  padding: 1em 1em .25em 1em;
  position: relative;
  border-radius: 20px;
  left: -20px;
}
.comment .comment-body:before{
  content: "";
  width: 20px;
  height: 20px;
  display: block;
  position: absolute;
  background: #a3d39c;
  transform: rotate(45deg);
  left: -7px;
  top: 18px;
  z-index: -1;
}
```

The follow / unfollow bottom in the right sidebar calls a function $scope.follow() or $scope.unfollow(), depending on whether or not the signed-in user is currently following the user. 

```html
<div ng-if="postData.user._id != currentUser._id ">
      <button class="btn btn-primary btn-sm btn-block" ng-if="!following" ng-click="follow()">Follow</button>
      <button class="btn btn-success btn-sm btn-block active" ng-if="following" ng-click="unfollow()">Unfollow</button>
</div>
```
$scope.follow() and $scope.unfollow() update the usersFollowing array in the Users collection. Here's the $scope.follow() function. $scope.unfollow() is the same except that instead of pushing the poster's user ID into the array, it splices this user ID out:

```javascript
$scope.follow = function() {
    $scope.usersFollowing = $scope.currentUser.usersFollowing;
    $scope.usersFollowing.push($scope.postData.user._id);
    userService.updateUser({
          usersFollowing: $scope.usersFollowing
        },
        $scope.currentUser._id)
      .then(function(response) {
      //   console.log(response);
        $scope.following = true;
      }, function(err) {
        console.error('Following Error', err);
      });
 };
 ```
The statistics shown in the right sidebar (overall user and cohort average emotion level, and last week user and cohort average emotion level) are derived from queries to the database. Here are the controller and service functions on the front end that query for overall average user emotion level:

```javascript
 // USER AVERAGE
    postService.averageQuery('user', $scope.postData.user._id, 'allTime')
      .then(function(response) {
        // console.log('checkuserAverage', response);
        $scope.userAverage = Math.round(response.data[0].avg);
        // console.log($scope.userAverage, "userAverage");
        $scope.userCount = response.data[0].count;
      }, function(err) {
        console.error('checkForUserAverage', err);
      });
 

this.averageQuery = function(group, num, duration, tags) {
      var query = 'group=' + group + '&duration=' + duration + '&user=' + num + '&tags=' + tags;
      // console.log(query, "query");
      return $http({
        method: 'GET',
        url: '/api/posts/getAvg?' + query

      });
    };
```

Here is the corresponding Node server middleware function that does an average query. As can be seen, this is a 2 part process:

1. Query for the user ID's in the group you want to search for
2. In the completeProcess() function, utilize the Mongoose aggregate feature to find the average $positiveScale (i.e. emotion level) for the users in the group you're searching for.

This middleware function supports averages for cohort, assigned mentor, and users following. Cohort is the only group used in the post detail page.

```javascript
findAvg: function(req, res) {
       console.log('in postsCtrl');
       console.log('in findAvg');
       console.log('req.query ', req.query);
       var group = '',
           duration = '';
       if (req.query.group)
            group = req.query.group;
       else
            group = 'user';
       if (req.query.duration)
            duration = req.query.duration;
       else
            duration = 'allTime';
       var user = req.query.user;
       var breakOutTags = (req.query.tags === 'true');
       var cohort = 0;
       var assignedMentor = '';
       var users = [];
       var queryUsers = true;
       if (group && group !== 'user') {
           usersModel
           .findById(user, 'cohort assignedMentor usersFollowing')
           .exec(function(err, result) {
                console.log('err', err);
                // console.log('result', result);
                if (err) {
                    console.log('in error routine');
                    return res.status(500).send(err);
                }
                else {
                    var queryObj = {};
                    switch (group) {
                        case 'following':
                           for (var i = 0; i < result._doc.usersFollowing.length; i++) {
                                users.push(result._doc.usersFollowing[i]);
                            }
                            completeProcess();
                            queryUsers = false;
                            break;
                        case 'mentor':
                            assignedMentor = result._doc.assignedMentor;
                            queryObj.assignedMentor = assignedMentor;
                            break;
                        case 'cohort':
                            cohort = result._doc.cohort;
                            queryObj.cohort = cohort;
                            break;
                        default:
                            cohort = result._doc.cohort;
                            queryObj.cohort = cohort;
                            break;
                    }
                    if (queryUsers) {
                        usersModel
                        .find(queryObj, '_id')
                        .exec(function(er, re) {
                            console.log('er', er);
                            // console.log('re', re);
                            if (er) {
                                console.log('in error routine');
                                return res.status(500).send(er);
                            }
                            else {
                                for (var i = 0; i < re.length; i++) {
                                    users.push(re[i]._doc._id);
                                }
                                completeProcess();
                            }
                        });
                    }
                }
           });
       }
       else {
           users.push(mongoose.Types.ObjectId(user)); // cast to object because aggregate feature will not automatically do the casting for a ref.
           completeProcess();
       }

       function completeProcess() {

           var matchCriteria = {};
           switch(duration) {
               case 'day' :
                   matchCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(1, 'day')), "$lt": new Date(moment(new Date()))}}; // cast back to Date object because aggregate feature cannot handle moment objects.
                   break;
               case 'week' :
                   matchCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(7, 'day')), "$lt": new Date(moment(new Date()))}};
                    break;
               case 'month' :
                    matchCriteria = {user: {$in: users}, datePosted: {"$gte": new Date(moment(new Date()).subtract(1, 'month')), "$lt": new Date(moment(new Date()))}};
                    break;
               case 'allTime' :
                     matchCriteria = {user: {$in: users} };
                     break;
               default :
                    matchCriteria = {user: {$in: users} };
                    break;
           }

           if (!breakOutTags) {
               postsModel.aggregate([
                   {$match: matchCriteria},
                   {$group: {
                       _id: null,
                       avg: {$avg: '$positiveScale'},
                       count: {$sum: 1}
                    }}
               ], function(e, r) {
                   console.log('err', e);
                  //  console.log('result', r);
                   if (e) {
                       console.log('in error routine');
                       return res.status(500).send(e);
                   }
                   else {
                       res.send(r);
                   }
               });
           }
           else { // break out tags
               postsModel.aggregate([
                   {$match: matchCriteria},
                   {$unwind: '$tags'},
                   {$group: {
                       _id: '$tags',
                       avg: {$avg: '$positiveScale'},
                       count: {$sum: 1}
                    }}
               ], function(e, r) {
                   console.log('err', e);
                  //  console.log('result', r);
                   if (e) {
                       console.log('in error routine');
                       return res.status(500).send(e);
                   }
                   else {
                       res.send(r);
                   }
               });
           }
       }
   },
```

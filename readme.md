# DEVMOUNAIN JOURNEY
## Your Path at DevMountain

[Link to hosted site](http://104.131.74.125:8004)

The purpose of this project was to create a system to allow students to blog and communicate their feelings to other students. A difference from a typical blog is that students choose an emotion level from 1 through 10, with 10 being highest, and their emotion is tracked along with what they were working on at the time. This project utilized the full MEAN stack. 

Features include a feed view that is either a timeline view, with images of blog posters separated by date, or a standard view, which lists basic information about the posts in reverse date order. Filters can be applied to the data. A new blog post can easily be made from the feed view. A click into a post brings up a detail view that allows the user to see the full text of the post, some basic information and statistics about the poster, and provides the ability to comment on the post. There's also a stats view that has a number of graphs of post data. A settings page allows for the ability to specify notification and privacy options, along with the ability to provide mentor name and start date.

##Getting Started
### Prerequisites
 - Mongo database.
 -  Server with Node.js installed

###Installation
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

##Design Goals
This site was intended to be eventually integrated into the DevMountain system. A separate Passport local auth system was created to allow for testing and demonstration independent of DevMountain. Due to DevMountain already having a user admin system, a separate user admin system was not created for this project.

The site was intended to be used by DevMountain students who are technically saavy and who will usually be using a laptop computer. Responsiveness was not a primary consideration but was built into the system. 

##Detailed Usage

###Models
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
###Detailed Description of System

####Feed View
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

 
####Post Detail View
Clicking into the modal on the feed view, or the post div on the standard view, brings up the post detail screen.

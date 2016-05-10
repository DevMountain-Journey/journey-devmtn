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



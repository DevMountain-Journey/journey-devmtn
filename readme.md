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

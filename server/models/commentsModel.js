var mongoose = require('mongoose'),
    postsModel = require('./postsModel.js'),
    usersModel = require('./usersModel.js'),
    Schema = mongoose.Schema;

var commentsSchema = new Schema({
    body: {type: 'String', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'Users'},
    postParent: {type: Schema.Types.ObjectId, ref: 'Posts'},
    commentParent: {type: Schema.Types.ObjectId, ref: 'Comments'},
    datePosted: {type: 'Date', default: Date.now}
});

commentsSchema.post('save', function(comment){
  postsModel
    .findById(comment.postParent)
    .exec(function(err, post){
      if(err) return err;
      post.numComments++;
      post.save(function(err, result){
        if(err) return err;
      });
      usersModel
        .findById(post.user)
        .exec(function(err, user){
          if(err) return err;
          if(user.preferences.communicationPreferences != ('none' || 'weeklySummary')){
            console.log('YO DAWG, YOUR COMMUNICATION PREFERENCES IF STATEMENT IS WORKING PROPERLY!');
          }
          return comment;
        });
    });
});

module.exports =  mongoose.model('Comments', commentsSchema);

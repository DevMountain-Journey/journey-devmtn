var mongoose = require('mongoose'),
    postsModel = require('./postsModel.js'),
    usersModel = require('./usersModel.js'),
    nodemailer = require('nodemailer'),
    sparkPostTransport = require('nodemailer-sparkpost-transport'),
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
          if(user.preferences && user.preferences.communicationPreferences != ('none' || 'weeklySummary')){
            console.log('SENDING EMAIL');
            var transporter = nodemailer.createTransport(sparkPostTransport({
              "content": {
                "template_id": "my-first-email"
              },
              "substitution_data": {
                "postId": post._id
              }
            }));

            transporter.sendMail({
              "recipients": [
                {
                  "address": {
                    "email": user.email,
                    "name": user.firstName + " " + user.lastName
                  }
                }
              ]
            }, function(err, info) {
              if (err) { console.log('EMAIL ERROR: ', err); }
              else { console.log('EMAIL SENT: ', info); }
            });
          }
          return comment;
        });
    });
});

module.exports =  mongoose.model('Comments', commentsSchema);

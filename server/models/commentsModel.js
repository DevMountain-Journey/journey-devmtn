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
      if (JSON.stringify(comment.user) !== JSON.stringify(post.user)) { // if user doing comment is different than user who originally posted
          usersModel
            .findById(post.user)
            .exec(function(er, user){
              if(er) return er;
              if(user.preferences && (user.preferences.communicationPreferences === 'newcomment' || user.preferences.communicationPreferences === 'all')) {
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
                           "address":
                           {
                              "email": user.email,
                              "name": user.firstName + " " + user.lastName
                           }
                       }
                      ]
                  }, function(e, info) {
                        if (e) { console.log('EMAIL ERROR: ', e); }
                        else { console.log('EMAIL SENT: ', info); }
                  });
              }
             // return user;
        });
      }
    });
});

module.exports =  mongoose.model('Comments', commentsSchema);

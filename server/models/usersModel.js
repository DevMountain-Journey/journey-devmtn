var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var preferencesSchema = require('./../schema/preferencesSchema');

var usersSchema = new Schema({
    firstName: {type: 'String', required: true, lowercase: true},
	lastName:{type: 'String', required: true, lowercase: true},
	email: {type: 'String', required: true, lowercase: true},
	password: {type: 'String'},
	cohort: {type: 'Number', required: true, default: 0},
    devmtnId: {type: 'Number'},
	startDate: {type: 'Date'},
	assignedMentor: {type: 'String', lowercase: true},
    usersFollowing: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    preferences: preferencesSchema
});


usersSchema.pre('save', function(next) {
	if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(9), null);
  return next(null, this);
});

// Methods
// Generate hash
// usersSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
// };

//Check if password is valid
usersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports =  mongoose.model('Users', usersSchema);

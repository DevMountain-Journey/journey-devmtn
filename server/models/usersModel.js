var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var usersSchema = new Schema({
  firstName: {type: 'String', required: true},
	lastName:{type: 'String', required: true},
	email: {type: 'String', required: true},
	password: {type: 'String', required: true},
	cohort: {type: 'Number', required: true},
	startDate: {type: 'Date', required: true},
	assignedMentor: {type: 'String', required: true}
});

// Methods
// Generate hash
usersSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
};

//Check if password is valid
usersSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports =  mongoose.model('Users', usersSchema);

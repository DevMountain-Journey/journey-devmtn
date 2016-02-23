var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postsSchema = new Schema({
//    title: {type: 'String', required: true},
	body: {type: 'String'},
	private: {type: 'Boolean', default: false},
	positiveScale: {type: 'Number', min: 1, max: 10, required: true},
	user: {type: Schema.Types.ObjectId, ref: 'Users'},
	tags: [{name: {type: 'String', required: true}}],
	datePosted: {type: 'Date', required: true, default: Date.now}

});


module.exports =  mongoose.model('Posts', postsSchema);

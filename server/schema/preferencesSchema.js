var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var preferencesSchema = new Schema({
  viewPreferences: {type: 'String', lowercase: true, required: true, default: 'timeline', enum: ['timeline', 'standard', 'graph']},
	communicationPreferences: {type: 'String', lowercase: true, required: true, default: 'all', enum: ['none', 'newcomment', 'weeklysummary', 'all']},
	privacyPreferences: {type: 'String', lowercase: true, required: true, default: 'public', enum: ['private', 'postsprivate', 'statsprivate', 'public']},
});

module.exports = preferencesSchema;

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var buttonSchema = new Schema({
	name: String,
	imgPath: String,
	scale: Number,
	offsetX: Number,
	offsetY: Number,
	description: String,
	date: {type: Date, default: Date.now()},
});

var targetSchema = new Schema({
	name: String,
	imgUrl: String,
	buttons: [buttonSchema],
	date: {type: Date, default: Date.now()},
});

var targetCollectionSchema = new Schema({
	name: String,
	wikitudeCollectionID: String,
	targets: [targetSchema],
	date: {type: Date, default: Date.now()},
});

var userSchema = new Schema({
	name: String,
	email: {type: String, unique: true},
	sub: {type: String, unique: true},
	date: {type: Date, default: Date.now()},
	targetCollections: [targetCollectionSchema],
});

var User = mongoose.model('User', userSchema);
var TargetCollection = mongoose.model('TargetCollection', targetCollectionSchema);
var Target = mongoose.model('Target', targetSchema);
var Button = mongoose.model('Button', buttonSchema);

module.exports = { 
					"User": User,
					"TargetCollection": TargetCollection,
					"Target": Target,
					"Button": Button,
				};
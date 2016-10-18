var express = require('express');
var cors = require('cors');
var path = require('path');
var base64image = require('base64-image');
var fs = require('fs');
var ManagerApi = require('./../ManagerAPI.js');
var mongoose = require('mongoose');
var models = require('./../models/models.js');
var https = require('https');
var router = express.Router();

// token and API creating for wikitude API
var token = process.argv[3];;
var targetsApi = new ManagerApi(token, 2);

// URL configuration for connecting mongoose to mongo database
var mongoPass = process.argv[2];
if (!mongoPass) throw "MongoDb password not provided";
var mongoUrl = 'mongodb://marauser:' + mongoPass + '@ds041924.mlab.com:41924/maradatabase';
mongoose.connect(mongoUrl);

// Initializing mongoose models;
var User = models.User;
var TargetCollection = models.TargetCollection;
var Target = models.Target;
var Button = models.Button;

// initialize helper functions & promises
var getToken = function(endpoint) {
	return new Promise((fulfill, reject) => {
		https.get(endpoint, function(r) {
			console.log('Google tokeninfo response status: ' + r.statusCode);
			r.setEncoding('utf8');
			r.on('data', function(data){
				var token = JSON.parse(data);
				fulfill(token);
			});
			r.on('error', reject);
		});
	});	
};


// Middle ware for sessions

router.use(function(req, res, next) {
	if (req.marasession && req.marasession.user) {
		User.findOne( { 'email': req.marasession.user.email} , function(err, user) {
			if (user) {
				req.user = user;
				delete req.user.sub;
				req.marasession.user = req.user;
			}
			next();
		});
	} else {
		next();
	}
});

function requireLogin(req, res, next) {
	if (!req.user) {
		res.status(401).end();
	} else {
		next();
	};
}

// ROUTES

router.post('/login', function(req, res, next) {
	
	var tokeninfoendpoint = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + req.body.id_token;
	
	getToken(tokeninfoendpoint).then(token => {
		User.findOne({ 'sub': token.sub }, function (err, user) {
		 	if (err) console.log('ERROR: ' + err);
		  
			if (user === null) {
				user = new User({ 
									name: token.name,
									email: token.email,
									sub: token.sub,
								});
				user.save();
				console.log("NEW USER SAVED: " + user.name);
			} else {
				console.log("USER FOUND: " + user.name);
			}

		  	req.marasession.user = user;
			res.end();
		})
	});
	
});

router.get('/logout', function(req, res) {
	req.marasession.reset();
	res.redirect('/');
});

router.get('/authenticate', requireLogin, function(req, res) {
	res.set('Content-Type', 'application/json');
	res.end(JSON.stringify({user: req.marasession.user.name}));
});

router.get('/targetCollections', requireLogin, function(req, res) {
	res.set('Content-Type', 'application/json');
	res.end(JSON.stringify(req.marasession.user.targetCollections));
});

router.get('/targetCollections/:id', requireLogin, function(req, res) {
	var collection = req.marasession.user.targetCollections.id(req.params.id);
	res.set('Content-Type', 'application/json');
	res.end(JSON.stringify(collection));
});

router.post('/targetCollections', requireLogin, function(req, res) {
	var targetCollections = req.marasession.user.targetCollections;
	targetCollections.push({name: req.body.name});
	var _id = targetCollections[targetCollections.length-1]._id;

	req.marasession.user.save()
		// Responding with the updated user targetCollections
		.then(() => {
			console.log("NEW COLLECTION ADD TO USER ACCOUNT: " + req.marasession.user.name);
			res.set('Content-Type', 'application/json');
			res.end(JSON.stringify(req.marasession.user.targetCollections));
		})
		// Creating Target Collection in Wikitude and updating the document in mogno with the wikitude ID
		.then(() => {
			console.log("Creating Wikitude Target Collection");
			return targetsApi.createTargetCollection(req.body.name);
		}).then(createdTargetCollection => {
			console.log("Target Collection created, updating database")
			User.findOneAndUpdate(
				{"_id": req.marasession.user._id, "targetCollections._id": _id}, 
				{
					"$set": {
						"targetCollections.$.wikitudeCollectionID": createdTargetCollection.id
					}
				}, 
				function(err, raw) {
					if (err) console.log(err);
				});
		}, err => {
			console.log(err);
			User.findOneAndUpdate(
				{"_id": req.marasession.user._id, "targetCollections._id": _id}, 
				{
					"$set": {
						"targetCollections.$.wikitudeCollectionID": "DUMMYWIKITUDEID"
					}
				}, 
				function(err, raw) {
					if (err) console.log(err);
				});
		});
});

router.delete('/targetCollections/:id', requireLogin, function(req, res) {
	req.marasession.user.targetCollections.id(req.params.id).remove();
	req.marasession.user.save(function(){
		console.log("COLLECTION REMOVED FROM USER ACCOUNT: " + req.marasession.user.name);
		res.set('Content-Type', 'application/json');
		res.end(JSON.stringify(req.marasession.user.targetCollections));
	});
})

router.post('/targetCollections/:id/targetupload', requireLogin, function(req, res, next) {
	var collection = req.marasession.user.targetCollections.id(req.params.id);

	var newTarget = new Target();

	newTarget.imgUrl = '/file/' + newTarget._id + '.' + req.body.extension; 
	newTarget.name = req.body.name;

	collection.targets.push(newTarget);
	req.marasession.user.save();

	// var fullUrl = req.protocol + '://' + req.get('host') + newTarget.imgUrl;
	var fullUrl = 'http' + '://' + 'ec2-52-62-175-192.ap-southeast-2.compute.amazonaws.com:3001' + newTarget.imgUrl;

	req.body.target = {name: newTarget.name, imageUrl: fullUrl };
	req.body.filename = newTarget._id + '.' + req.body.extension; 

	next();
}, base64image(path.join(__dirname, '../uploads')), function(req, res) {
	// Adding the target to collection in wikitude

	var collection = req.marasession.user.targetCollections.id(req.params.id);
	targetsApi.addTarget(collection.wikitudeCollectionID, req.body.target)
		.then(target => {
			console.log(`created target ${target.generationId}`);
		}).then(() => {
			console.log("Publishing target collection")
			return targetsApi.generateTargetCollection(collection.wikitudeCollectionID);
		}).then(archive => {
			console.log(`generated cloud archive: ${archive.id}`);
		}, rejected => {
			console.log(req.body.target.imageUrl);
			console.log(rejected);
		});

	res.end();
})

router.get('/targetCollections/:collectionid/targets/:targetid', requireLogin, function(req, res) {
	var collection = req.marasession.user.targetCollections.id(req.params.collectionid);
	var target = collection.targets.id(req.params.targetid);
	res.set('Content-Type', 'application/json');
	res.end(JSON.stringify(target));
});

router.post('/targetCollections/:collectionid/targets/:targetid/augmentupload', requireLogin, function(req, res, next) {
	var collection = req.marasession.user.targetCollections.id(req.params.collectionid);
	var target = collection.targets.id(req.params.targetid);
	var button = new Button({
		name: req.body.augmentation.name,
		scale: req.body.augmentation.scale,
		offsetX: req.body.augmentation.X,
		offsetY: req.body.augmentation.Y,
		description: req.body.augmentation.description,
	});
	button.imgPath = '/file/' + button._id + '.' + req.body.augmentation.extension;

	target.buttons.push(button);

	req.marasession.user.save();

	req.body.augmentationId = button._id
	req.body.filename = button._id + '.' + req.body.augmentation.extension;
	req.body.base64 = req.body.augmentation.src;
	next()
}, base64image(path.join(__dirname, '../uploads')), function(req, res) {
	res.set('Content-Type', 'application/json');
	res.end(JSON.stringify({id: req.body.augmentationId, filename: req.body.filename}));
});

router.get('/file/:name', cors(), function(req, res, next) {
	
	var options = {
		root: __dirname + '/../uploads/',
		dotfiles: 'deny',
		headers: {
		'x-timestamp': Date.now(),
		'x-sent': true
		}
	};

	var fileName = req.params.name;
		res.sendFile(fileName, options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Sent:', fileName);
		}
	});
	
});

// This route is for delivering files used for the demo augmentations and tutorials
router.get('/demo/:name', cors(), function(req, res, next) {
	var options = {
		root: __dirname + '/../demo/',
		dotfiles: 'deny',
		headers: {
		'x-timestamp': Date.now(),
		'x-sent': true
		}
	};

	var fileName = req.params.name;
		res.sendFile(fileName, options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Sent:', fileName);
		}
	});
});

router.get('/collection/:name', cors(), function(req, res, next) {

	User.aggregate([
		{
			"$match": {"targetCollections.name": req.params.name}
		},
		{
			"$unwind": "$targetCollections"
		},
		{
			"$match": {"targetCollections.name": req.params.name}
		},
		{
			"$project": {
				"name": "$targetCollections.name",
				"wikitudeCollectionID": "$targetCollections.wikitudeCollectionID",
				"targets": "$targetCollections.targets",
			}
		}], function (err, targetCollection) {
		if (err) console.log(err);
		res.set('Content-Type', 'application/json');
		res.end(JSON.stringify(targetCollection.targets));
	})

});

// router.post('/target', requireLogin, function(req, res, next) {
// 		req.marasession.user.targetCollections.push({name: req.body.name});
// 		var targetCollection = req.marasession.user.targetCollections[0];
// 		req.marasession.user.save();
// 		console.log("TC mongo ID: " + targetCollection._id);
// 		req.body.filename = targetCollection._id + "." + req.body.extension;
// 		next();
// 	}, base64image(path.join(__dirname, '../uploads')), function(req, res) {
// 		res.end();
// 	});

module.exports = router;

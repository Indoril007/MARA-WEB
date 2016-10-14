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
var token = 'eda9b06ac4a22d924f421d3e3e35dbac';
var targetsApi = new ManagerApi(token, 2);

// URL configuration for connecting mongoose to mongo database
var mongoPass = process.argv[2];
if (!mongoPass) throw "MongoDb password not provided";
var mongoUrl = 'mongodb://marauser:' + mongoPass + '@ds041924.mlab.com:41924/maradatabase';
mongoose.connect(mongoUrl);

// Initializing mongoose models;
var User = models.User;

// initialize helper functions & promises
var getToken = function(endpoint) {
	return new Promise((fulfill, reject) => {
		https.get(endpoint, function(r) {
			console.log('Google tokeninfo response status: ' + r.statusCode);
			r.setEncoding('utf8');
			r.on('data', function(data){
				var token = JSON.parse(data);
				console.log(token);
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
		res.set('Content-Type', 'application/json');
		res.end(JSON.stringify({status: "Not Logged In"}));
	} else {
		next();
	};
}

/* GET home page. */
// router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
// });

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
		  	console.log("NEW USER SAVED");
			console.log(user);
		  	req.marasession.user = user;
			
			res.end();
		  } else {

		  	console.log("USER FOUND");
		  	console.log(user);

		  	req.marasession.user = user;

			res.end();
		  }
		  
		})
	});
	
});

router.get('/dashboard', requireLogin, function(req, res) {
	res.set('Content-Type', 'application/json');
	res.end(JSON.stringify({status: "Logged In"}));
});


// router.get('/file/:name', cors(), function(req, res, next) {
	
	// var options = {
		// root: __dirname + '/../assets/',
		// dotfiles: 'deny',
		// headers: {
		// 'x-timestamp': Date.now(),
		// 'x-sent': true
		// }
	// };

	// var fileName = req.params.name;
		// res.sendFile(fileName, options, function (err) {
		// if (err) {
			// console.log(err);
			// res.status(err.status).end();
		// }
		// else {
			// console.log('Sent:', fileName);
		// }
	// });
	
// });

// router.get('/file/:name', cors(), function(req, res, next) {
	
	// var options = {
		// root: __dirname + '/../uploads/',
		// dotfiles: 'deny',
		// headers: {
		// 'x-timestamp': Date.now(),
		// 'x-sent': true
		// }
	// };

	// var fileName = req.params.name;
		// res.sendFile(fileName, options, function (err) {
		// if (err) {
			// console.log(err);
			// res.status(err.status).end();
		// }
		// else {
			// console.log('Sent:', fileName);
		// }
	// });
	
// });

// router.post('/targets/upload', upload.single("file"), function (req, res, next) {
	// console.log(req.file);
	// console.log(req.body);
	
	// var tmp_path = req.file.path;
	
	// var target_path = 'uploads/' + req.file.originalname;
	
	// var src = fs.createReadStream(tmp_path);
	// var dest = fs.createWriteStream(target_path);
	// src.pipe(dest);
	// src.on('end', function() { res.status(204).end(); });
	// src.on('error', function(error) { console.log( "ERROR"); });
	
// });

// MAKE SURE FILENAME HAS NO SPACES


// router.post('/uploader/json/:filename', function(req, res, next) {
	// var dir = path.join(__dirname, '../uploads');
	// // var abs = path.join(dir, req.params.filename);
	// var abs = path.join(dir, 'myDevices.json');
	// var reqdata = req.body.json;
	
	// fs.writeFile(abs, reqdata, function(err) {
      // if (err) return next(err);
	  
      // });
	  
	  // var fullUrl = req.protocol + '://' + req.get('host') + '/file/' + req.params.filename;
	  
	  // var resdata = {jsonUrl: fullUrl};
	  // res.set('Content-Type', 'application/json');
	  // res.end(JSON.stringify(resdata));
	
// })

// router.post('/uploader/augmentation/:filename', base64image(path.join(__dirname, '../uploads')), function (req,res,next) {
	
	// var fullUrl = req.protocol + '://' + req.get('host') + '/file/' + req.params.filename; 
	// var data = {augmentationUrl: fullUrl};
	// res.set('Content-Type', 'application/json');
	// res.end(JSON.stringify(data));
// });

// router.post('/uploader/target/:filename', base64image(path.join(__dirname, '../uploads')), function (req,res,next) {
	// var imgPath = res.locals.image.abs;
	// var fileName = res.locals.image.name;
	// var targetName = fileName.split('.')[0];
	// var fullUrl = req.protocol + '://' + req.get('host') + '/file/' + fileName; 
	
	// console.log(imgPath);
	// console.log(fullUrl)
	
	// targetsApi.createTargetCollection("targetCollection")
		// .then(createdTargetCollection => {
			// var id = createdTargetCollection.id;
			// console.log(`created targetCollection: ${id}`);
			
			// return ( Promise.resolve()
						// .then (() => {
							// var target = {name: targetName, imageUrl: fullUrl}
							// console.log(target);
							// return targetsApi.addTarget(id, target); 
						// })
						// .then(target => {
							// console.log(`created target ${target.generationId}`);
						// })
						// // generate target collection
						// .then(() => {
							// console.log(`PUBLISH TARGET COLLECTION`);
						// })
						// .then(() => targetsApi.generateTargetCollection(id))
						// .then(archive => {
							// console.log(`generated cloud archive: ${archive.id}`);
						// })
						// .then(() => {
							// var data = {targetCollection: "targetCollection", targetName: targetName, collectionId: id, targetUrl: fullUrl};
							// res.set('Content-Type', 'application/json');
							// res.end(JSON.stringify(data));
						// })
					// );
				// })
		// .catch(error => {
			// console.error("ERROR OCCURRED:", error.message, error);
		// });
		
	// var data = {targetCollection: "targetCollection", targetName: targetName, collectionId: "collectionId", targetUrl: fullUrl};
	// res.set('Content-Type', 'application/json');
	// res.end(JSON.stringify(data));
// });	



module.exports = router;

var express = require('express');
var cors = require('cors');
// var multer = require('multer');
// var upload = multer({ dest: 'uploads/'});
var path = require('path');
var base64image = require('base64-image');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/file/:name', cors(), function(req, res, next) {
	
	var options = {
		root: __dirname + '/../assets/',
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

router.post('/uploader/:filename', base64image(path.join(__dirname, '../uploads')), function (req,res,next) {
	
});



module.exports = router;

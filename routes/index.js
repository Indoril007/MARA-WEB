var express = require('express');
var multer = require('multer');
var upload = multer({ dest: 'uploads/'})
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/targets/upload', upload.single("file"), function (req, res, next) {
	console.log(req.file);
	console.log(req.body);
	
	var tmp_path = req.file.path;
	
	var target_path = 'uploads/' + req.file.originalname;
	
	var src = fs.createReadStream(tmp_path);
	var dest = fs.createWriteStream(target_path);
	src.pipe(dest);
	src.on('end', function() { res.status(204).end(); });
	src.on('error', function(error) { console.log( "ERROR"); });
	
})

module.exports = router;

var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require("mongoose");
var Grid = require('gridfs-stream');

router.get('/', function(req, res, next) {
});

router.get('/answer/:intent/:entity', function(req, res, next) {
	
	console.log(" Getting answer from DB ");
	var intentInput = req.params.intent;
	var entityInput = req.params.entity;

	console.log("Intent question : "+intentInput);
	console.log("Entity question : "+entityInput);

	var dbName = "Assistant_Chatbot_Android_Developer";
	var collectionName = "intent";

	var mongoClient = require('mongodb').MongoClient;
	var url = "mongodb://adminUser:purveshFALL2018@13.58.23.159/?authSource=admin&authMechanism=SCRAM-SHA-1";

	mongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(dbName);
	  var collection = dbo.collection( collectionName );

	  collection.find({[String(intentInput)] : {$exists: true}}).toArray(function(err, result){
	    if (err) throw err;

		var answer = result[0][intentInput][entityInput];
		console.log("Answer : "+answer);
		hasImage = false;

		// Image fetch on the front end directly
		if(intentInput.includes('ui_') && answer!==null && answer !=='')
		{
			hasImage = true;
			// gridfs
			/*mongoose.connect('mongodb://localhost:27017/'+dbName); // proper ip name of EC2
			var conn = mongoose.connection;

			Grid.mongo = mongoose.mongo;
			
			conn.once('open', function(){

				var gfs = Grid(conn.db);
				var writestream = fs.createWriteStream(path.join(__dirname, '/'+answer));
				try {

					var readstream = gfs.createReadStream({
						_id: answer
					});

					readstream.pipe(writestream, function(){
						res.sendFile(path.join(__dirname, '/'+answer));	
					});
					//writestream.on('close', function(){
					//	console.log(" written new file image - ");
					//});

				} 
				catch (err) {
					log.error("image not found....");
				    log.error(err);
				}

			});*/
		}
		
		res.json({
		    answer: answer,
		    image: hasImage
	  	});

	    db.close();
	  });

	});
});

module.exports = router;
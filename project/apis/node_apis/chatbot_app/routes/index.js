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
	var url = "mongodb://localhost:27017/";

	mongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db(dbName);
	  var collection = dbo.collection( collectionName );

	  collection.find({[String(intentInput)] : {$exists: true}}).toArray(function(err, result){
	    if (err) throw err;

		//console.log(result);

		var answer = result[0][intentInput][entityInput];
		console.log("Answer : "+answer);

		// Image fetching
		if(intentInput.includes('ui_') && answer!==null && answer !=='')
		{
			// gridfs
			mongoose.connect('mongodb://localhost:27017/'+dbName);
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
					/*writestream.on('close', function(){
						console.log(" written new file image - ");
					});*/

				} 
				catch (err) {
					log.error("image not found....");
				    log.error(err);
				}

			});
		}
		else
		{
			res.json({
			    answer: answer
		  	});
		}

	    db.close();
	  });

	});
});

module.exports = router;
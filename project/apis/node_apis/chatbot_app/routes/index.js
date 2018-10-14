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
	//var url = "mongodb://localhost:27017";

	mongoClient.connect(url, function(err1, db) {
		
	  	try
		{
			var dbo = db.db(dbName);
			var collection = dbo.collection( collectionName );

			collection.find({[String(intentInput)] : {$exists: true}}).toArray(function(err2, result)
			{
			  	try
				{ 	
					var hasImage = false;
					var answer = result[0][intentInput][entityInput];
					if(typeof answer === 'undefined') // In case entity not found.
					{
						answer = "";
					}

					console.log("Answer : "+answer);

					// Image fetch on the front end directly
					if(intentInput==='ui_element' && answer!==null && answer !=='')
					{
						hasImage = true;
						
						try
						{
							// gridfs code to save image is below.
							mongoose.connect(url+'/'+dbName);
							var conn = mongoose.connection;
							Grid.mongo = mongoose.mongo;

							conn.once('open', function(){

								var gfs = Grid(conn.db);
								var writestream = fs.createWriteStream(path.join(__dirname, '/'+answer));
								try {

									var readstream = gfs.createReadStream({
										_id: answer
									});

									console.log("readstream:::::"+readstream);

									readstream.pipe(writestream, function(){
										res.sendFile(path.join(__dirname, '/'+answer));	
									});
									writestream.on('close', function(){
										console.log(" written new file image - ");
									});
								} 
								catch (err3) {
									console.log("image not found....");
								    console.log(err3);
								    res.send(500, {error:"image not found...."});
								}
							});
						}
						catch (err4)
						{
							console.log("mongodb connection error for image fetch....");
							console.log(err4);
							res.send(500, {error:"mongodb connection error for image fetch...."});
						}
					}

					res.json({
						answer: answer,
						image: hasImage
					});
				}
				catch (err2) 
				{
					console.log("No Intent found in database.----------");
				    console.log(err2);
				    res.send(500, {error:"No Intent found in database."});
				}
			});

		}
		catch (err1) 
		{
			console.log("Mongodb Connection Issue.----------");
		    console.log(err1);
		    res.send(500, {error:"Mongodb Connection Issue."});
		}

	});
});

module.exports = router;


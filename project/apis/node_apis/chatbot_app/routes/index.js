var express = require('express');
var router = express.Router();

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

		/*console.log(result);*/

		var answer = result[0][intentInput][entityInput];
		console.log("Answer : "+answer);

	    res.json({
		    answer: answer
	  	});
	    
	    db.close();
	  });

	});
});

module.exports = router;
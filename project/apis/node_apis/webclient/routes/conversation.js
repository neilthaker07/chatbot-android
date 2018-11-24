  // Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const express = require('express');
const multer = require('multer');
const util = require('util');
const fs = require('fs');

// ----------------- Project Specific Configurations: Constants ----------------
const projectId = 'hello-world-agent-906ac'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';
const sampleRateHertz = 44100
const audioFileUploadLocation = 'uploads/'
const audioFileExtension = '.wav'

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId); // Define session path

// ----------------- Project Specific Configurations: Variables ----------------
var router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, audioFileUploadLocation)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + audioFileExtension) //Appending extension
  }
})

var upload = multer({ storage: storage });

// ------------------ Web Service Definitions -------------------

router.post('/voice', upload.single("file"), function(req,res){

  var filePath = req.file.path;
  const readFile = util.promisify(fs.readFile);

  readFile(filePath)
    .then(inputAudio => {
      // The audio query request
      const request = {
        session: sessionPath,
        queryInput: {
          audioConfig: {
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
          },
        },
        inputAudio: inputAudio,
      };

      // Recognizes the speech in the audio and detects its intent.
      return sessionClient.detectIntent(request);
    })
    .then(responses => {
      const result = responses[0].queryResult;

      logQueryResult(sessionClient, result);

      res.send({queryText: result.queryText, fulfillmentText: result.fulfillmentText});
    })
    .catch(err => {
      console.error('ERROR:', err);
      res.status(500).send({ error: err });
    });

    fs.unlinkSync(filePath); // Deleting the audio file after response/error is received from the server
});

// Detecting Intent from the Text
router.post('/ask',function(req,res){

  var intentDisplayName = "";

  var userQuery = req.body.userQuery;

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userQuery,
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  sessionClient.detectIntent(request)
    .then(responses => {

      const result = responses[0].queryResult;
      logQueryResult(sessionClient, result);

      if(result.intent) {
        intentDisplayName = result.intent.displayName;
      }

      res.send({fulfillmentText: result.fulfillmentText, intentName: intentDisplayName});
    })
    .catch(err => {
      console.error('ERROR:', err);
      res.status(500).send({ error: err });
    });
});

// ------------------- Util Functions -----------------

function logQueryResult(sessionClient, result) {
  // Instantiates a context client
  const contextClient = new dialogflow.ContextsClient();

  console.log('Detected intent:');
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}

module.exports = router;

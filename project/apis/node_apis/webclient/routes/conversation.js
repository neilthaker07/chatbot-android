// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

// You can find your project ID in your Dialogflow agent settings
const projectId = 'hello-world-agent-906ac'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

var express = require('express');
var router = express.Router();


router.post('/ask',function(req,res){

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

  var answerFromServer = "";

  // Send request and log result
  sessionClient.detectIntent(request)
    .then(responses => {
      console.log('Detected intent');
      const result = responses[0].queryResult;
      answerFromServer = result.fulfillmentText

      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);

      if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log(`  No intent matched.`);
      }

      res.send(answerFromServer);

    })
    .catch(err => {
      console.error('ERROR:', err);
    });


});

module.exports = router;

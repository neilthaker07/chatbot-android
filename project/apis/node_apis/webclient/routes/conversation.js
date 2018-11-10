// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const pump = require('pump');
const record = require('node-record-lpcm16');
const through2 = require('through2');
const sessionClient = new dialogflow.SessionsClient();

// You can find your project ID in your Dialogflow agent settings
const projectId = 'hello-world-agent-906ac'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

var express = require('express');
var router = express.Router();

router.post('/voice',function(req,res){

  //testFun();

  res.send({ "Hello":"world" });

});

function testFun() {

  const initialStreamRequest = {
    session: sessionPath,
    queryParams: {
      session: sessionClient.sessionPath(projectId, sessionId),
    },
    queryInput: {
      audioConfig: {
        audioEncoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      },
      singleUtterance: true,
    },
  };

  // Create a stream for the streaming request.
  const detectStream = sessionClient
    .streamingDetectIntent()
    .on('error', console.error)
    .on('data', data => {
      if (data.recognitionResult) {
        console.log(
          `Intermediate transcript: ${data.recognitionResult.transcript}`
        );
      } else {
        console.log(`Detected intent:`);
        logQueryResult(sessionClient, data.queryResult);
      }
  });

  // Write the initial stream request to config for audio input.
  detectStream.write(initialStreamRequest);

  pump(
      record
        .start({
          sampleRateHertz: '44100',
          threshold: 0.5,
          verbose: false,
          recordProgram: 'rec',
          silence: '1.0',
        })
        .on('error', console.error),
      // Format the audio stream into the request format.
      through2.obj((obj, _, next) => {
        next(null, {inputAudio: obj});
      }),
      detectStream
    );
    // [END dialogflow_detect_intent_streaming]

}

function logQueryResult(sessionClient, result) {

  // Instantiates a context client
  const contextClient = new dialogflow.ContextsClient();

  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
  const parameters = JSON.stringify(
    structjson.structProtoToJson(result.parameters)
  );
  console.log(`  Parameters: ${parameters}`);

  if (result.outputContexts && result.outputContexts.length) {
    console.log(`  Output contexts:`);
    result.outputContexts.forEach(context => {
      const contextId = contextClient.matchContextFromContextName(context.name);
      const contextParameters = JSON.stringify(
        structjson.structProtoToJson(context.parameters)
      );
      console.log(`    ${contextId}`);
      console.log(`      lifespan: ${context.lifespanCount}`);
      console.log(`      parameters: ${contextParameters}`);
    });
  }
}


// Detecting Intent from the Text
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
  var intent = "";

  // Send request and log result
  sessionClient.detectIntent(request)
    .then(responses => {
      console.log('Detected intent');
      const result = responses[0].queryResult;
      answerFromServer = result.fulfillmentText

      console.log(`  Query: ${result.queryText}`);
      console.log(`  Response: ${result.fulfillmentText}`);

      if (result.intent) {
        intent = result.intent.displayName
        console.log(`  Intent: ${result.intent.displayName}`);
      } else {
        console.log(`  No intent matched.`);
      }

      res.send({ answerText: answerFromServer, intentName: intent });

    })
    .catch(err => {
      console.error('ERROR:', err);
    });


});

module.exports = router;

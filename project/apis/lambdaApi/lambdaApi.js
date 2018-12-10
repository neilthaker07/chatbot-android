'use strict';
let http = require('http');
let starWarsAPI = `13.58.23.159`;
 
exports.handler = function(event, context, callback) {
  
  
  let intent = event.queryResult.intent['displayName'];
  let entityParams = event.queryResult.parameters;
  let entity = "";
  
  
  let entitiesList = ["Codenames","androidStudioEntites","classApiEntity","keyboardShortcutEntity","imageComponents","packageApiEntity","classApiEntity","basicsEntity"];
  
  for (var key in entityParams) {
    //console.log("Key is " + key + " " +  "value is " +  entityParams[key]);
    if(entitiesList.includes(key))
    {
        let entityObj = entityParams[key];
        console.log("object entity is "+entityObj);
        
        if(entityObj.length>1 && entityObj.constructor === Array)
        {
            let os = "";
            for(var i in entityObj)
            {
                if(!entityObj[i].toLowerCase().includes('mac') && !entityObj[i].toLowerCase().includes('win'))
                {
                    entity = entityObj[i];
                }
                else
                {
                    if(entityObj[i].toLowerCase() == 'macos')
                    {
                        os = 'mac';
                    }
                    else if(entityObj[i].toLowerCase() == 'windowsos' || entityObj[i].toLowerCase() == 'windows')
                    {
                        os = 'win';
                    }
                    else
                    {
                        os = entityObj[i].toLowerCase();
                    }
                    
                }
            }
            
            entity = entity + "?os="+os;
        }
        else if(entityObj.length==1 && entityObj.constructor === Array)
        {
            entity = entityObj[0].toLowerCase();
        }
        else if(entityObj.includes(" ") || entityObj.includes("."))
        {
           
            console.log("inside here");
            entity = entityObj.trim().replace(/[ .]/g, "_");
        
        }
        else if(entityObj=='' || entityObj == null)
        {
            //console.log("empty");
            entity = "null";
        }
        else
        {
            entity = entityObj.trim();
        }
    }
  }
  
  if(intent=='image')
  {
      intent = 'ui_element';
  }
  if(intent.includes('followup'))
  {
      let intentArr = intent.split('_');
      console.log("Intent is  "+ intentArr[0] + "_" + intentArr[1]);
      intent = intentArr[0] + "_" + intentArr[1];
      intent = intent.trim();
  }

  
  let options = searchPeopleRequestOptions(intent.trim().toLowerCase(), entity.trim().toLowerCase());
  
  //console.log("options",options.path);
  
  makeRequest(options, function( data, error) {
    //let person = data.results[0];
    if (data) {
        let code = data['answer'];
        console.log("data is " + code);
        let response = "";
        if(intent=='ui_element' || intent=='studio' || intent=='api_packages' || 'api_classes')
        {
            response = "";
        }
        else if(intent=='keyboard_shortcuts')
        {
            response = "Keyboard shortcut for "+ entityParams['keyboardShortcutEntity'][0] + " command for "+entityParams['keyboardShortcutEntity'][1] +" is "; 
        }
        if(intent=='code')
        {
            response = "Diagnostic Code for "+entity + " is ";
        }
       
        if(code)
        {
            if(code instanceof Object)
            {
                response = response + "window : "+ code['win'] + ", mac : "+ code['mac'];
                //console.log("here --");
            }
            else
            {
                console.log("here");
                response = response + code;
            }
            
        }
        else
        {
            response = "Sorry we couldn't find anything for your requested query. Please try again!!";
        }
        
        callback(null, {"fulfillmentText": response});
    }
    else {
        callback(null, {"fulfillmentText": "I'm not sure!"});
    }
  });
};
 
function searchPeopleRequestOptions(intent, entity) {
    return {
        host: starWarsAPI,
        port: 3000,
        path: `/answer/`+intent+'/'+entity
    };
}
 
function makeRequest(options, callback) {
    var request = http.request(options, 
    function(response) {
        var responseString = '';
        response.on('data', function(data) {
            console.log('data =', data);
            responseString += data;
        });
         response.on('end', function() {
            var responseJSON = JSON.parse(responseString);
            callback(responseJSON, null);
        });
    });
    request.end();
}

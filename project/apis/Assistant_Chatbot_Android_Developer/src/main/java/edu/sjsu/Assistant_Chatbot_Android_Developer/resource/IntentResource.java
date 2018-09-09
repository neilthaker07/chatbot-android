package edu.sjsu.Assistant_Chatbot_Android_Developer.resource;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import edu.sjsu.Assistant_Chatbot_Android_Developer.model.Intent;
import edu.sjsu.Assistant_Chatbot_Android_Developer.service.IntentService;

@RestController
@CrossOrigin
public class IntentResource {
	
	@Autowired
	IntentService intentService;
	
	@RequestMapping(value="/answer/{intent}/{entity}", method=RequestMethod.GET)
	public List<Intent> getAnswer(@PathVariable String intent,
						  		  @PathVariable String entity)
	{
		return intentService.getAnswerFromDB(intent, entity);
	}
	
}

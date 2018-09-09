package edu.sjsu.Assistant_Chatbot_Android_Developer.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import edu.sjsu.Assistant_Chatbot_Android_Developer.model.Intent;
import edu.sjsu.Assistant_Chatbot_Android_Developer.repository.IntentRepository;


public class IntentService {
	
	@Autowired
	IntentRepository intentRepository;
	
	public List<Intent> getAnswerFromDB(String intent,
										String entity)
	{
		return intentRepository.findAll();
	}

}

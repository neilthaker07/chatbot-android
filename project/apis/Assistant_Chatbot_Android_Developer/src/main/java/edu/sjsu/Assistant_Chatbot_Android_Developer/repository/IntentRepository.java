package edu.sjsu.Assistant_Chatbot_Android_Developer.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import edu.sjsu.Assistant_Chatbot_Android_Developer.model.Intent;

@Repository
public interface IntentRepository extends MongoRepository<Intent, String>{
	
	//Intent findBy_id(ObjectId _id);
	Intent findByCode(String a);
}

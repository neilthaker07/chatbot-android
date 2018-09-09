package edu.sjsu.Assistant_Chatbot_Android_Developer.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="intent")
public class Intent {
	
	@Id
	public ObjectId _id;
	public Object code;
	
	public Intent(Object _id, Object code)
	{
		_id = this._id;
		code = this.code;
	}

	public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	public Object getCode() {
		return code;
	}

	public void setCode(Object code) {
		this.code = code;
	}
	
	
	
}

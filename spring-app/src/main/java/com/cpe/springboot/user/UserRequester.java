package com.cpe.springboot.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

import com.cpe.springboot.user.UserModel;

@Component
public class UserRequester {
	
	@Autowired
    JmsTemplate jmsTemplate;
	
	private static final String QUEUE_KEY_UPDATE = "fr.cpe.spring-app.updateUser";
	private static final String QUEUE_KEY_ADD = "fr.cpe.spring-app.addUser";

    public void addUserModelToUpdateQueue(UserModel user) {
        System.out.println("[UserRequester] SEND updateUser User=["+user+"]");
        jmsTemplate.convertAndSend(QUEUE_KEY_UPDATE,user);
    }
    
    public void addUserModelToAddQueue(UserModel user) {
        System.out.println("[UserRequester] SEND addUser User=["+user+"]");
        jmsTemplate.convertAndSend(QUEUE_KEY_ADD,user);
    }
}
package com.cpe.springboot.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserListener {
	
	@Autowired
    JmsTemplate jmsTemplate;
	
	private final UserService userService;
	
	public UserListener(UserService userService) {
		this.userService = userService;
	}
	
    @JmsListener(destination = "fr.cpe.spring-app.updateUser")
    public void receiveUserModelFromUpdateQueue(UserModel user) {
    	System.out.println("[UserListener] RECEIVED updateUser User=["+user+"]");
    	
    	userService.updateUser(new UserDTO(user));
    }
    
    
    @JmsListener(destination = "fr.cpe.spring-app.addUser")
    public void receiveUserModelFromAddQueue(UserModel user) {
    	System.out.println("[UserListener] RECEIVED addUser User=["+user+"]");
    	
    	userService.addUser(new UserDTO(user));
    }
}
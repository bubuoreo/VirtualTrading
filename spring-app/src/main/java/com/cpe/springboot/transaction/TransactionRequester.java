package com.cpe.springboot.transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
public class TransactionRequester {

	@Autowired
	JmsTemplate jmsTemplate;

	private static final String QUEUE_KEY_UPDATE = "fr.cpe.spring-app.updateTransaction";
	private static final String QUEUE_KEY_ADD = "fr.cpe.spring-app.writeTransaction";

	public void addTransactionModelToUpdateQueue(TransactionModel t) {
		System.out.println("[TransactionRequester] SEND updateTransaction User=[" + t + "]");
		jmsTemplate.convertAndSend(QUEUE_KEY_UPDATE, t);
	}

	public void addTransactionModelToAddQueue(TransactionModel t) {
		System.out.println("[TransactionRequester] SEND writeTransaction User=[" + t + "]");
		jmsTemplate.convertAndSend(QUEUE_KEY_ADD, t);
	}
}

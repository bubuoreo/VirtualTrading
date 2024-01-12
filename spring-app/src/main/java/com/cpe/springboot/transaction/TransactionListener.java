package com.cpe.springboot.transaction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
public class TransactionListener {
	
	@Autowired
	JmsTemplate jmsTemplate;
	
	private final TransactionService transactionService;

	public TransactionListener(TransactionService transactionService) {
		this.transactionService = transactionService;
	}
	
	@JmsListener(destination = "fr.cpe.spring-app.updateTransaction")
    public void receiveTransactionModelFromUpdateQueue(TransactionModel t) {
    	System.out.println("[TransactionListener] RECEIVED updateTransaction Transaction=["+t+"]");
    	
    	transactionService.updateTransaction(new TransactionDTO(t), true);
    }
    
    
    @JmsListener(destination = "fr.cpe.spring-app.writeTransaction")
    public void receiveTransactionModelFromAddQueue(TransactionModel t) {
    	System.out.println("[TransactionListener] RECEIVED writeTransaction Transaction=["+t+"]");
    	
    	transactionService.writeTransaction(new TransactionDTO(t), true);
    }
	
}

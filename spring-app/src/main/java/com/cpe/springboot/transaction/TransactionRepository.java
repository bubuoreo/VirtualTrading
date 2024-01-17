package com.cpe.springboot.transaction;

import java.util.List;

import org.springframework.data.repository.CrudRepository;


public interface TransactionRepository extends CrudRepository<TransactionModel, Integer>{
	List<TransactionModel> findByUserId(Integer userId);
	
}

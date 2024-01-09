package com.cpe.springboot.transaction;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cpe.springboot.asset.AssetDTO;
import com.cpe.springboot.asset.AssetModel;
import com.cpe.springboot.asset.AssetModelService;
import com.cpe.springboot.common.DTOMapper;
import com.cpe.springboot.user.UserModel;
import com.cpe.springboot.user.UserService;

@Service
public class TransactionService {
	
	private final TransactionRepository transactionRepository;
	private final AssetModelService assetModelService;
	private final UserService userService;
	@Autowired
	private final TransactionRequester transactionRequester;
	
	public TransactionService(TransactionRepository transactionRepository, TransactionRequester transactionRequester,AssetModelService assetModelService, UserService userService) {
		this.transactionRepository = transactionRepository;
		this.transactionRequester = transactionRequester;
		this.assetModelService = assetModelService;
		this.userService = userService;
	}

	public List<TransactionModel> getAllTransactions() {
		List<TransactionModel> transactionList = new ArrayList<TransactionModel>();
		transactionRepository.findAll().forEach(transactionList::add);
		return transactionList;
	}

	public TransactionDTO writeTransaction(TransactionDTO t, boolean dequeued) {
		TransactionDTO ret = new TransactionDTO();
		TransactionModel newTransactionModel = DTOMapper.fromTransactionDTOToTransactionModel(t);
		if (dequeued) {
			TransactionModel transactionSaved = transactionRepository.save(newTransactionModel);
			System.out.println(transactionSaved);
			AssetModel newAssetModel = new AssetModel();
			newAssetModel.setSymbol(transactionSaved.getSymbol());
			newAssetModel.setAssetQuantity(transactionSaved.getAssetQuantity());
			newAssetModel.setUserId(t.getUserId());
			assetModelService.createAsset(newAssetModel);
//			
//			// TODO: condition si l'utilisateur n'existe pas à mettre au niveau du Rest Controller
//			Optional<UserModel> user = userService.getUser(transactionSaved.getUserId());
//			user.get().addAsset(newAssetModel);
//			
//			ret = DTOMapper.fromTransactionModelToTransactionDTO(transactionSaved);
		}
		else {
			transactionRequester.addTransactionModelToAddQueue(newTransactionModel);
		}
		return ret;
	}
	
	public TransactionDTO updateTransaction(TransactionDTO t, boolean dequeued) {
		TransactionDTO ret = new TransactionDTO();
		TransactionModel newTransactionModel = DTOMapper.fromTransactionDTOToTransactionModel(t);
		if (dequeued) {
			TransactionModel updatedTransaction=transactionRepository.save(newTransactionModel);
			ret = DTOMapper.fromTransactionModelToTransactionDTO(updatedTransaction);
		}
		else {
			transactionRequester.addTransactionModelToUpdateQueue(newTransactionModel);
		}
		return ret;
	}

}

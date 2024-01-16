package com.cpe.springboot.transaction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.cpe.springboot.asset.AssetDTO;
import com.cpe.springboot.asset.AssetModel;
import com.cpe.springboot.asset.AssetModelService;
import com.cpe.springboot.common.DTOMapper;
import com.cpe.springboot.user.UserDTO;
import com.cpe.springboot.user.UserModel;
import com.cpe.springboot.user.UserService;

@Service
public class TransactionService {

	private final TransactionRepository transactionRepository;
	private final AssetModelService assetModelService;
	private final UserService userService;
	@Autowired
	private final TransactionRequester transactionRequester;

	public TransactionService(TransactionRepository transactionRepository, TransactionRequester transactionRequester,
			AssetModelService assetModelService, UserService userService) {
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

			Optional<UserModel> userOptional = checkUserExistance(newTransactionModel.getUserId());

			AssetModel asset = null;

			UserModel userModel = userOptional.get();
			for (AssetModel assetModel : userModel.getAssetsList()) {
				if (assetModel.getSymbol().equals(transactionSaved.getSymbol())) {
					asset = assetModel;
				}
			}
			if (t.getType().equals("BUY")) {
				userModel.setAccount(userModel.getAccount() - transactionSaved.getTransactionPrice());				
			} else if (t.getType().equals("SELL")) {
				userModel.setAccount(userModel.getAccount() + transactionSaved.getTransactionPrice());
			}
			userService.updateUser(DTOMapper.fromUserModelToUserDTO(userModel));

			if (asset != null) {
				// Asset already exists, update the existing asset quantity
				if (t.getType().equals("BUY")) {
					asset.setAssetQuantity(asset.getAssetQuantity() + transactionSaved.getAssetQuantity());				
				} else if (t.getType().equals("SELL")) {
					asset.setAssetQuantity(asset.getAssetQuantity() - transactionSaved.getAssetQuantity());
				}
				System.out.println(asset.getAssetQuantity());
				if (asset.getAssetQuantity() == 0.0) {
					assetModelService.deleteAssetModel(asset.getId());
				} else {
					assetModelService.updateAsset(DTOMapper.fromAssetModelToAssetDTO(asset));
				}

			} else {
				// Asset does not exist, create a new asset
				AssetDTO newAssetDTO = new AssetDTO();
				newAssetDTO.setSymbol(transactionSaved.getSymbol());
				newAssetDTO.setAssetQuantity(transactionSaved.getAssetQuantity());
				newAssetDTO.setUserId(t.getUserId());

				assetModelService.createAsset(newAssetDTO);
			}
			
		} else {
			transactionRequester.addTransactionModelToAddQueue(newTransactionModel);
		}
		return ret;
	}

	public TransactionDTO updateTransaction(TransactionDTO t, boolean dequeued) {
		TransactionDTO ret = new TransactionDTO();
		TransactionModel newTransactionModel = DTOMapper.fromTransactionDTOToTransactionModel(t);
		if (dequeued) {
			TransactionModel updatedTransaction = transactionRepository.save(newTransactionModel);
			ret = DTOMapper.fromTransactionModelToTransactionDTO(updatedTransaction);
		} else {
			transactionRequester.addTransactionModelToUpdateQueue(newTransactionModel);
		}
		return ret;
	}

	public Optional<UserModel> checkUserExistance(Integer userId) {
		return userService.getUser(userId);
	}

	public boolean checkAssetAvailability(TransactionDTO t, UserModel userModel) {
		boolean ret = false;
		List<AssetModel> assetModelsList = new ArrayList<AssetModel>();
		for (AssetModel assetModel : userModel.getAssetsList()) {
			if (assetModel.getSymbol().equals(t.getSymbol())) {
				if (assetModel.getAssetQuantity() >= t.getAssetQuantity()) {
					ret = true;
				}
			}
		}
		return ret;
	}

	public List<TransactionModel> getUserTransactions(Integer userId) {
		return transactionRepository.findByUserId(userId);
	}
}

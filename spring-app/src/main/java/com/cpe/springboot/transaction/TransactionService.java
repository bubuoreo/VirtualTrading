package com.cpe.springboot.transaction;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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

			Optional<UserModel> user = userService.getUser(t.getUserId());
			Set<AssetModel> userAssetsList = new HashSet<AssetModel>();
			userAssetsList = user.get().getAssetsList();
			// TODO: Check in a loop over all user's assets if the asset symbol is present in one of them
			// in case of success of the previous condition, Do not create a new asset but
			// add up the AssetQuantity field with the one in the transaction
			boolean assetExists = false;
			for (Iterator<AssetModel> iterator = userAssetsList.iterator(); iterator.hasNext();) {
				AssetModel assetModel = (AssetModel) iterator.next();
				System.out.println(assetModel);
			}
//			for (AssetModel asset : userAssetsList) {
//			    if (asset.getSymbol().equals(transactionSaved.getSymbol())) {
//			        assetExists = true;
//			        break;
//			    }
//			}

			if (assetExists) {
				// Asset already exists, update the existing asset quantity
				userAssetsList.stream().filter(asset -> asset.getSymbol().equals(transactionSaved.getSymbol()))
						.findFirst().ifPresent(existingAsset -> {
							existingAsset.setAssetQuantity(
									existingAsset.getAssetQuantity() + transactionSaved.getAssetQuantity());
							assetModelService.updateAsset(existingAsset);
						});
			} else {
				// Asset does not exist, create a new asset
				AssetModel newAssetModel = new AssetModel();
				newAssetModel.setSymbol(transactionSaved.getSymbol());
				newAssetModel.setAssetQuantity(transactionSaved.getAssetQuantity());
				newAssetModel.setUserId(t.getUserId());

				assetModelService.createAsset(newAssetModel);
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
}

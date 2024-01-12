package com.cpe.springboot.common;

import com.cpe.springboot.asset.AssetDTO;
import com.cpe.springboot.asset.AssetModel;
import com.cpe.springboot.transaction.TransactionDTO;
import com.cpe.springboot.transaction.TransactionModel;
import com.cpe.springboot.user.UserDTO;
import com.cpe.springboot.user.UserModel;

public class DTOMapper {

	public static UserDTO fromUserModelToUserDTO(UserModel user) {
		return new UserDTO(user);
	}

	public static UserModel fromUserDTOToUserModel(UserDTO user) {
		return new UserModel(user);
	}
	
	public static TransactionDTO fromTransactionModelToTransactionDTO(TransactionModel t) {
		return new TransactionDTO(t);
	}
	
	public static TransactionModel fromTransactionDTOToTransactionModel(TransactionDTO t) {
		return new TransactionModel(t);
	}
	
	public static AssetDTO fromAssetModelToAssetDTO(AssetModel asset) {
		return new AssetDTO(asset);
	}
	
	public static AssetModel fromAssetDTOToAssetModel(AssetDTO asset) {
		return new AssetModel(asset);
	}
}

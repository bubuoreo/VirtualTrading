package com.cpe.springboot.asset;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.cpe.springboot.common.DTOMapper;
import com.cpe.springboot.user.UserModel;
import com.cpe.springboot.user.UserService;

@Service
public class AssetModelService {
	
	private final AssetRepository assetRepository;
	private final UserService userService;

	public AssetModelService(AssetRepository assetRepository, UserService userService) {
		this.assetRepository = assetRepository;
		this.userService = userService;
	}

	public List<AssetModel> getAllAssetModel() {
		List<AssetModel> assetsList = new ArrayList<>();
		assetRepository.findAll().forEach(assetsList::add);
		return assetsList;
	}

	public Optional<AssetModel> getAsset(Integer id) {
		// TODO Auto-generated method stub
		return null;
	}

	public AssetDTO createAsset(AssetModel asset) {
		AssetModel savedAssetModel =assetRepository.save(asset);
		return DTOMapper.fromAssetModelToAssetDTO(savedAssetModel);
	}

	public void deleteAssetModel(Integer id) {
		// TODO Auto-generated method stub

	}

	public AssetDTO updateAsset(AssetModel asset) {
		// TODO Auto-generated method stub
		return null;
	}

	public Optional<UserModel> getUser(Integer userId) {
		return userService.getUser(userId);
	}

}
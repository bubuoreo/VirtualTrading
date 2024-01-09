package com.cpe.springboot.asset;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cpe.springboot.common.DTOMapper;
import com.cpe.springboot.user.UserModel;
import com.google.common.base.Optional;

@Service
public class AssetModelService {
	
	private AssetRepository assetRepository;

	public AssetModelService(AssetRepository assetRepository) {
		this.assetRepository = assetRepository;
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


}

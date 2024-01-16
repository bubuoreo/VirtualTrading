package com.cpe.springboot.asset;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cpe.springboot.common.DTOMapper;
import com.cpe.springboot.user.UserModel;
import com.cpe.springboot.user.UserService;


//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController
public class AssetRestController {

	private final AssetModelService assetModelService;

	public AssetRestController(AssetModelService assetModelService) {
		this.assetModelService = assetModelService;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/assets")
	private List<AssetDTO> getAllAssets() {
		List<AssetDTO> assetList = new ArrayList<>();
		for (AssetModel c : assetModelService.getAllAssetModel()) {
			assetList.add(new AssetDTO(c));
		}
		return assetList;

	}

	@RequestMapping(method = RequestMethod.GET, value = "/asset/{id}")
	private AssetDTO getAsset(@PathVariable String id) {
		Optional<AssetModel> asset = assetModelService.getAsset(Integer.valueOf(id));
		if (asset.isPresent()) {
			return DTOMapper.fromAssetModelToAssetDTO(asset.get());
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Asset id:" + id + ", not found", null);

	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/asset/user/{userId}")
	private List<AssetDTO> getUserAssets(@PathVariable String userId) {
		List<AssetDTO> assetDTOList = new ArrayList<AssetDTO>();
		Optional<UserModel> user = assetModelService.getUser(Integer.valueOf(userId));
		if (user.isPresent()) {
			for (AssetModel assetModel : user.get().getAssetsList()) {
				assetDTOList.add(DTOMapper.fromAssetModelToAssetDTO(assetModel));
			}
			return assetDTOList;
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User id:" + userId + ", not found", null);

	}

	@RequestMapping(method = RequestMethod.POST, value = "/asset")
	public AssetDTO createAsset(@RequestBody AssetDTO asset) {
		return assetModelService.createAsset(asset);
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/asset/{id}")
	public AssetDTO updateAsset(@RequestBody AssetDTO asset, @PathVariable String id) {
		asset.setId(Integer.valueOf(id));
		return assetModelService.updateAsset(asset);
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/asset/{id}")
	public void deleteAssetModel(@PathVariable String id) {
		assetModelService.deleteAssetModel(Integer.valueOf(id));
	}

}

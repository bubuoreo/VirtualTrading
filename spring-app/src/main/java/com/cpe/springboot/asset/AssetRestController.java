package com.cpe.springboot.asset;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cpe.springboot.common.DTOMapper;
import com.google.common.base.Optional;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController
public class AssetRestController {

	private final AssetModelService assetModelService;

	public AssetRestController(AssetModelService assetModelService) {
		this.assetModelService = assetModelService;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/assets")
	private List<AssetDTO> getAllCards() {
		List<AssetDTO> assetList = new ArrayList<>();
		for (AssetModel c : assetModelService.getAllAssetModel()) {
			assetList.add(new AssetDTO(c));
		}
		return assetList;

	}

	@RequestMapping(method = RequestMethod.GET, value = "/asset/{id}")
	private AssetDTO getCard(@PathVariable String id) {
		Optional<AssetModel> rcard;
		rcard = assetModelService.getAsset(Integer.valueOf(id));
		if (rcard.isPresent()) {
			return DTOMapper.fromAssetModelToAssetDTO(rcard.get());
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Card id:" + id + ", not found", null);

	}

	@RequestMapping(method = RequestMethod.POST, value = "/asset")
	public AssetDTO createAsset(@RequestBody AssetDTO asset) {
		return assetModelService.createAsset(DTOMapper.fromAssetDTOToAssetModel(asset));
	}

	@RequestMapping(method = RequestMethod.PUT, value = "/asset/{id}")
	public AssetDTO updateAsset(@RequestBody AssetDTO asset, @PathVariable String id) {
		asset.setId(Integer.valueOf(id));
		return assetModelService.updateAsset(DTOMapper.fromAssetDTOToAssetModel(asset));
	}

	@RequestMapping(method = RequestMethod.DELETE, value = "/asset/{id}")
	public void deleteAssetModel(@PathVariable String id) {
		assetModelService.deleteAssetModel(Integer.valueOf(id));
	}

}

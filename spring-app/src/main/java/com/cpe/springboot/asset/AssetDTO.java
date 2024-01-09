package com.cpe.springboot.asset;

public class AssetDTO {

	private Integer id;
	private String symbol;
	private float assetQuantity;
	private Integer userId;

	public AssetDTO() {
	}

	public AssetDTO(AssetModel asset) {
		this.id = asset.getId();
		this.symbol = asset.getSymbol();
		this.assetQuantity = asset.getAssetQuantity();
		this.userId = asset.getUserId();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public float getAssetQuantity() {
		return assetQuantity;
	}

	public void setAssetQuantity(float assetQuantity) {
		this.assetQuantity = assetQuantity;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}


}

package com.cpe.springboot.asset;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
public class AssetModel implements Serializable{

	private static final long serialVersionUID = 2733795832476568049L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String symbol;
	private float assetQuantity;
	private Integer userId;
	
	public AssetModel() {
		this.symbol = "XXX";
		this.assetQuantity = 0;
	}
	
	public AssetModel(AssetDTO asset) {
		this.id = asset.getId();
		this.symbol = asset.getSymbol();
		this.assetQuantity = asset.getAssetQuantity();
		this.userId = asset.getUserId();
	}

	public Integer getId() {
		return id;
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

	@Override
	public String toString() {
		return "AssetModel [id=" + id + ", symbol=" + symbol + ", assetQuantity=" + assetQuantity + ", userId=" + userId
				+ "]";
	}

}

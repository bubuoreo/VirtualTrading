package com.cpe.springboot.transaction;

import java.time.LocalDateTime;

public class TransactionDTO {
	private Integer id;
	private String dateTime;
	private Integer userId;
	private String symbol;
	private String type;
	private float assetPrice;
	private float transactionPrice;
	private float assetQuantity;
	// TODO
	//private float transactionFee;

	public TransactionDTO() {
	}

	public TransactionDTO(TransactionModel transactionModel) {
		this.id = transactionModel.getId();
		this.dateTime = transactionModel.getDateTime();
		this.userId = transactionModel.getUserId();
		this.symbol = transactionModel.getSymbol();
		this.type = transactionModel.getType();
		this.assetPrice = transactionModel.getAssetPrice();
		this.transactionPrice = transactionModel.getTransactionPrice();
		this.assetQuantity = transactionModel.getAssetQuantity();
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getDateTime() {
		return dateTime;
	}

	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public float getAssetPrice() {
		return assetPrice;
	}

	public void setAssetPrice(float assetPrice) {
		this.assetPrice = assetPrice;
	}

	public float getTransactionPrice() {
		return transactionPrice;
	}

	public void setTransactionPrice(float transactionPrice) {
		this.transactionPrice = transactionPrice;
	}

	public float getAssetQuantity() {
		return assetQuantity;
	}

	public void setAssetQuantity(float assetQuantity) {
		this.assetQuantity = assetQuantity;
	}

	@Override
	public String toString() {
		return "TransactionDTO [id=" + id + ", dateTime=" + dateTime + ", userId=" + userId + ", symbol=" + symbol
				+ ", type=" + type + ", assetPrice=" + assetPrice + ", transactionPrice=" + transactionPrice
				+ ", assetQuantity=" + assetQuantity + "]";
	}
	
}

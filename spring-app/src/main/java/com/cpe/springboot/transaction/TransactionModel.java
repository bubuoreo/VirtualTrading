package com.cpe.springboot.transaction;

import java.io.Serializable;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class TransactionModel implements Serializable {

	private static final long serialVersionUID = 2733795832476568049L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
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

	public TransactionModel() {
		this.dateTime = "1970-01-01T00:00:00";
		this.userId = 0;
		this.symbol = "XXX";
		this.type = "NULL";
		this.assetPrice = 0;
		this.transactionPrice = 0;
		this.assetQuantity = 0;
		//this.transactionFee = 0;
	}

	public TransactionModel(TransactionDTO tDTO) {
		this.dateTime = tDTO.getDateTime();
		this.userId = tDTO.getUserId();
		this.symbol = tDTO.getSymbol();
		this.type = tDTO.getType();
		this.assetPrice = tDTO.getAssetPrice();
		this.transactionPrice = tDTO.getTransactionPrice();
		this.assetQuantity = tDTO.getAssetQuantity();
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

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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
		return "TransactionModel [id=" + id + ", dateTime=" + dateTime + ", userId=" + userId + ", symbol=" + symbol
				+ ", type=" + type + ", assetPrice=" + assetPrice + ", transactionPrice=" + transactionPrice
				+ ", assetQuantity=" + assetQuantity + "]";
	}
	
}

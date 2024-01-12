package com.cpe.springboot.user;

import java.util.HashSet;
import java.util.Set;

import com.cpe.springboot.asset.AssetModel;

public class UserDTO {
	private Integer id;
	private String login;
	private String pwd;
	private float account;
	private String lastName;
	private String surName;
	private String email;

	private Set<Integer> assetsList = new HashSet<>();

	public UserDTO() {
	}

	public UserDTO(UserModel userModel) {
		this.id = userModel.getId();
		this.login = userModel.getLogin();
		this.pwd = userModel.getPwd();
		this.account = userModel.getAccount();
		this.lastName = userModel.getLastName();
		this.surName = userModel.getSurName();
		this.email = userModel.getEmail();
		for (AssetModel asset : userModel.getAssetsList()) {
			this.assetsList.add(asset.getId());
		}
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getPwd() {
		return pwd;
	}

	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public float getAccount() {
		return account;
	}

	public void setAccount(float account) {
		this.account = account;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getSurName() {
		return surName;
	}

	public void setSurName(String surName) {
		this.surName = surName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "UserDTO [id=" + id + ", login=" + login + ", pwd=" + pwd + ", account=" + account + ", lastName="
				+ lastName + ", surName=" + surName + ", email=" + email + ", assetsList=" + assetsList + "]";
	}

	public Set<Integer> getAssetsList() {
		return assetsList;
	}

	public void setAssetsList(Set<Integer> assetsList) {
		this.assetsList = assetsList;
	}
}

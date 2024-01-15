package com.cpe.springboot.user;

import com.cpe.springboot.asset.AssetModel;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
@JsonIdentityInfo(generator= ObjectIdGenerators.PropertyGenerator.class, property="id")
public class UserModel implements Serializable{

	private static final long serialVersionUID = 2733795832476568049L;
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;
	private String login;
	private String pwd;
	private float account;
	private String lastName;
	private String surName;
	private String email;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "userId", fetch = FetchType.EAGER)
	private Set<AssetModel> assetsList = new HashSet<>();

	public UserModel() {
		this.login = "";
		this.pwd = "";
		this.lastName="lastname_default";
		this.surName="surname_default";
		this.email="email_default";
	}
	
	public UserModel(UserDTO user) {
		this.id=user.getId();
		this.login=user.getLogin();
		this.pwd=user.getPwd();
		this.account=user.getAccount();
		this.lastName=user.getLastName();
		this.surName=user.getSurName();
		this.email=user.getEmail();
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

	public String getSurName() {
		return surName;
	}

	public String getEmail() {
		return email;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public void setSurName(String surName) {
		this.surName = surName;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
	public void addAsset(AssetModel asset) {
		this.assetsList.add(asset);
		asset.setUserId(this.id);
	}
	
	public Set<AssetModel> getAssetsList() {
		return assetsList;
	}

	public void setAssetsList(Set<AssetModel> assetsList) {
		this.assetsList = assetsList;
	}

	@Override
	public String toString() {
		return "UserModel [id=" + id + ", login=" + login + ", pwd=" + pwd + ", account=" + account + ", lastName="
				+ lastName + ", surName=" + surName + ", email=" + email + ", assetsList=" + assetsList + "]";
	}

}

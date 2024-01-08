package com.cpe.springboot.auth;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cpe.springboot.user.UserModel;
import com.cpe.springboot.user.UserService;

@Service
public class AuthService {
	
	private UserService userService;
	
	public AuthService(UserService userService) {
		this.userService = userService;
	}

	public List<UserModel> authenticateUser(String username, String password) {
		List<UserModel> retList = userService.getUserByLoginPwd(username, password);
		return retList;
	}

}

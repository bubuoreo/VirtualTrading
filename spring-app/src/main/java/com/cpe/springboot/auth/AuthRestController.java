package com.cpe.springboot.auth;

import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cpe.springboot.user.CookieUtil;
import com.cpe.springboot.user.UserModel;
import com.cpe.springboot.user.UserService;

@CrossOrigin
@RestController
public class AuthRestController {
	
	private final AuthService authService;
	
	public AuthRestController(AuthService authService) {
		this.authService = authService;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/auth")
	private Integer getAllCourses(@RequestBody AuthDTO authDto) {
		List<UserModel> uList = authService.authenticateUser(authDto.getUsername(), authDto.getPassword());
		if (uList.size() > 0) {
//			authService.createConnectionCookie(uList.get(0).getId());
			// TODO
			UserModel user = uList.get(0);
			return user.getId();
		}
		throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authentification Failed", null);

	}
	
}

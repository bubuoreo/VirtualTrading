package com.cpe.springboot.user;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cpe.springboot.common.DTOMapper;
import com.cpe.springboot.user.UserDTO;
import com.cpe.springboot.user.UserModel;

@Service
public class UserService {

	private final UserRepository userRepository;
	@Autowired
	private final UserRequester userRequester;

	public UserService(UserRepository userRepository, UserRequester userRequester) {
		this.userRepository = userRepository;
		this.userRequester = userRequester;
	}

	public List<UserModel> getAllUsers() {
		List<UserModel> userList = new ArrayList<>();
		userRepository.findAll().forEach(userList::add);
		return userList;
	}

	public Optional<UserModel> getUser(String id) {
		return userRepository.findById(Integer.valueOf(id));
	}

	public Optional<UserModel> getUser(Integer id) {
		return userRepository.findById(id);
	}

	public UserDTO addUser(UserDTO user) {
		UserModel newUserModel = DTOMapper.fromUserDTOToUserModel(user);
		UserModel userSaved = userRepository.save(newUserModel);
		return DTOMapper.fromUserModelToUserDTO(userSaved);
	}

	public UserDTO updateUser(UserDTO user) {
		Optional<UserModel> userOptional= getUser(user.getId());
		UserModel newUserModel = DTOMapper.fromUserDTOToUserModel(user);
		if (userOptional.isPresent()) {
			UserModel userModel = userOptional.get();
			if (user.getLogin() != null) {
				userModel.setLogin(user.getLogin());
			}
			if (user.getLastName() != null) {
				userModel.setLastName(user.getLastName());
			}
			if (user.getSurName() != null) {
				userModel.setSurName(user.getSurName());
			}
			if (user.getEmail() != null) {
				userModel.setEmail(user.getEmail());
			}
			if (user.getAccount() != 0) {
				userModel.setAccount(user.getAccount());
			}
			// TODO
			
		}
		System.out.println(newUserModel);
		UserModel updatedUser = userRepository.save(newUserModel);
		return DTOMapper.fromUserModelToUserDTO(updatedUser);
	}

	public void deleteUser(String id) {
		userRepository.deleteById(Integer.valueOf(id));
	}

	public List<UserModel> getUserByLoginPwd(String login, String pwd) {
		List<UserModel> ulist = null;
		ulist = userRepository.findByLoginAndPwd(login, pwd);
		return ulist;
	}

	public String createConnectionCookie(Integer id) {
		Optional<UserModel> userOptional = userRepository.findById(id);
		if (userOptional.isPresent()) {
			CookieUtil test = new CookieUtil();
			try {
				System.out.println(userOptional.get().toString());
				test.createSecureCookie(userOptional.get().toString());
			} catch (NoSuchAlgorithmException e) {
				e.printStackTrace();
			}			
		}
		return null;
	}
}

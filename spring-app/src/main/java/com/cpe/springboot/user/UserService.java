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
		newUserModel.setAccount(100000);
		UserModel userSaved = userRepository.save(newUserModel);
		return DTOMapper.fromUserModelToUserDTO(userSaved);
	}

	public UserDTO updateUser(UserDTO user) {
		Optional<UserModel> userOptional= getUser(user.getId());
		UserModel newUserModel = null;
		if (userOptional.isPresent()) {
			newUserModel = userOptional.get();
			if (user.getLogin() != null) {
				newUserModel.setLogin(user.getLogin());
			}
			if (user.getPwd() != null) {
				newUserModel.setPwd(user.getPwd());
			}
			if (user.getLastName() != null) {
				newUserModel.setLastName(user.getLastName());
			}
			if (user.getSurName() != null) {
				newUserModel.setSurName(user.getSurName());
			}
			if (user.getEmail() != null) {
				newUserModel.setEmail(user.getEmail());
			}
			if (user.getAccount() != 0) {
				newUserModel.setAccount(user.getAccount());
			}
			
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

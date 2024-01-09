package com.cpe.springboot.user;

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

	public UserDTO addUser(UserDTO user, boolean dequeued) {
		UserDTO ret = new UserDTO();
		UserModel u = DTOMapper.fromUserDTOToUserModel(user);
		if (dequeued) {
			UserModel u_saved = userRepository.save(u);
			ret = DTOMapper.fromUserModelToUserDTO(u_saved);
		}
		else {
			userRequester.addUserModelToAddQueue(u);
		}
		return ret;
	}

	public UserDTO updateUser(UserDTO user, boolean dequeued) {
		UserDTO ret = new UserDTO();
		UserModel u = DTOMapper.fromUserDTOToUserModel(user);
		if (dequeued) {
			UserModel uBd =userRepository.save(u);
			ret = DTOMapper.fromUserModelToUserDTO(uBd);
		}
		else {
			userRequester.addUserModelToUpdateQueue(u);
		}
		return ret;
	}

	public void deleteUser(String id) {
		userRepository.deleteById(Integer.valueOf(id));
	}

	public List<UserModel> getUserByLoginPwd(String login, String pwd) {
		List<UserModel> ulist = null;
		ulist = userRepository.findByLoginAndPwd(login, pwd);
		return ulist;
	}
}
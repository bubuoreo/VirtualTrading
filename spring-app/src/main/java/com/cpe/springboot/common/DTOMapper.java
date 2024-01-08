package com.cpe.springboot.common;

import com.cpe.springboot.user.UserDTO;
import com.cpe.springboot.user.UserModel;

public class DTOMapper {

	public static UserDTO fromUserModelToUserDTO(UserModel uM) {
		UserDTO uDto = new UserDTO(uM);
		return uDto;
	}

	public static UserModel fromUserDTOToUserModel(UserDTO uDTO) {
		UserModel uM = new UserModel(uDTO);
		return uM;
	}
}

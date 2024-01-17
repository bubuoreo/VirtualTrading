package com.cpe.springboot.launcher;

import com.cpe.springboot.VirtualTrading;
import com.cpe.springboot.user.UserModel;

public class VirtualTradingLauncher {
	
    public static void main(String[] args) {
    	VirtualTrading vt = new VirtualTrading();
        // Create two UserModels
        UserModel user1 = new UserModel();
        user1.setLogin("user1");
        user1.setLastName("LastName1");

        UserModel user2 = new UserModel();
        user2.setLogin("user2");
        user2.setLastName("LastName2");

        // Perform any other operations with UserModels if needed

        // Print the created UserModels
        System.out.println("User1: " + user1);
        System.out.println("User2: " + user2);
    }
}

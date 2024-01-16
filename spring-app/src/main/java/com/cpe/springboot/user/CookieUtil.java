package com.cpe.springboot.user;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.math.BigInteger;

public class CookieUtil {

    private String secret = "legroupeGOATESQUEdu69"; // Utilisez un secret sécurisé

    public String createSecureCookie(String userInfo) throws NoSuchAlgorithmException {
        String cookieValue = hashUserInfo(userInfo);

        Cookie cookie = new Cookie("userCookie", cookieValue);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // True si vous utilisez HTTPS
        cookie.setMaxAge(7 * 24 * 60 * 60); // Durée de vie en secondes
        // cookie.setPath("/"); // Définissez le chemin si nécessaire

        return cookieValue;
    }

    private String hashUserInfo(String userInfo) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        // Ajout du secret au userInfo pour le hachage
        String combined = userInfo + secret;
        byte[] hashedBytes = md.digest(combined.getBytes(StandardCharsets.UTF_8));
        // Convertir le tableau de bytes en représentation hexadécimale
        BigInteger number = new BigInteger(1, hashedBytes);
        return number.toString(16);
    }
}

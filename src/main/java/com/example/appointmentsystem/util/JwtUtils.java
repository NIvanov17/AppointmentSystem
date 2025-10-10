package com.example.appointmentsystem.util;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import javax.crypto.SecretKey;

import com.example.appointmentsystem.model.enums.Role;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;


@Component
public class JwtUtils {
    private final long EXPIRATION_TIME = 3600000;
    private final Key SECRET_KEY = Keys.hmacShaKeyFor("MySuperSecureLongSecretKey123456!".getBytes());

    public String generateToken(String username, String role) {

        return Jwts
                .builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY).compact();
    }

    public String extractEmail(String token) {
        return Jwts
                .parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        return (String) claims.get("role");
    }

    public List<Role> mapStringsToRoles(List<String> roleNames) {

        return roleNames.stream()
                .map(s -> Role.valueOf(s.toUpperCase(Locale.ROOT)))
                .toList();
    }

    public String getTokenFromRequest(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }

    public boolean isTokenValid(String token, String username) {
        String extractedUsername = extractEmail(token);
        boolean isValid = extractedUsername.equals(username) && !isTokenExpired(token);

        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Date extractExpiration(String token) {
        Claims allClaims = extractAllClaims(token);

        return allClaims.getExpiration();
    }
}

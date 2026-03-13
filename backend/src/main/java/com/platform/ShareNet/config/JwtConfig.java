package com.platform.ShareNet.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Configuration
public class JwtConfig {

    // Set in application.properties: jwt.secret=<at-least-32-char string>
    @Value("${jwt.secret:ShareNetSuperSecretKeyThatIsLongEnough2024}")
    private String jwtSecret;

    // Default: 24 hours in milliseconds
    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    @Bean
    public SecretKey secretKey() {
        // Keys.hmacShaKeyFor requires >= 32 bytes for HS256
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public long getJwtExpiration() {
        return jwtExpiration;
    }
}
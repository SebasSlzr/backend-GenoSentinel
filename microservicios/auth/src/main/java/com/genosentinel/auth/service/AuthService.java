package com.genosentinel.auth.service;

import com.genosentinel.auth.dto.LoginRequest;
import com.genosentinel.auth.dto.LoginResponse;
import com.genosentinel.auth.model.User;
import com.genosentinel.auth.repository.UserRepository;
import com.genosentinel.auth.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.getActive()) {
            throw new RuntimeException("User account is disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return new LoginResponse(
                token,
                user.getUsername(),
                user.getFullName(),
                user.getRole()
        );
    }

    public User createUser(String username, String password, String fullName, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setEmail(email);
        user.setRole("USER");
        user.setActive(true);

        return userRepository.save(user);
    }

    public Boolean validateToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            User user = userRepository.findByUsername(username)
                    .orElse(null);

            return user != null && user.getActive() && jwtUtil.validateToken(token, username);
        } catch (Exception e) {
            return false;
        }
    }
}
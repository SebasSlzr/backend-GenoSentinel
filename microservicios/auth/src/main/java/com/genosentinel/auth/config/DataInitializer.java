package com.genosentinel.auth.config;

import com.genosentinel.auth.model.User;
import com.genosentinel.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFullName("Administrator");
            adminUser.setEmail("admin@genosentinel.com");
            adminUser.setRole("USER");
            adminUser.setActive(true);

            userRepository.save(adminUser);

            System.out.println("===================================");
            System.out.println("Default user created:");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("===================================");
        }
    }
}
package com.platform.ShareNet.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.platform.ShareNet.model.User;
import com.platform.ShareNet.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User registerUser(User user) {
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple password check (in production, use proper password hashing)
            if (user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }

    public User addCredit(Long userId, double amount) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setCreditPoints(user.getCreditPoints() + amount);
            return userRepository.save(user);
        }
        return null;
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }
}

package com.aspirepath.controller;

import com.aspirepath.dto.AuthResponse;
import com.aspirepath.model.Admin;
import com.aspirepath.model.Student;
import com.aspirepath.repository.AdminRepository;
import com.aspirepath.repository.StudentRepository;
import com.aspirepath.security.CustomUserDetails;
import com.aspirepath.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;

    public AuthController(AuthService authService, StudentRepository studentRepository, AdminRepository adminRepository) {
        this.authService = authService;
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        try {
            @SuppressWarnings("unchecked")
            java.util.List<String> skills = (java.util.List<String>) body.get("skills");
            @SuppressWarnings("unchecked")
            java.util.List<String> interests = (java.util.List<String>) body.get("interests");
            
            authService.register(
                (String) body.get("name"), 
                (String) body.get("email"), 
                (String) body.get("password"), 
                (String) body.get("role"),
                skills,
                interests
            );
            return ResponseEntity.status(201).body(Map.of("message", "Registration successful"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            AuthResponse response = authService.login(body.get("email"), body.get("password"));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if ("admin".equals(userDetails.getRole())) {
            return ResponseEntity.ok(adminRepository.findById(userDetails.getId()).get());
        } else {
            return ResponseEntity.ok(studentRepository.findById(userDetails.getId()).get());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody Map<String, Object> body) {
        if ("admin".equals(userDetails.getRole())) {
            Admin admin = adminRepository.findById(userDetails.getId()).get();
            if (body.containsKey("name")) admin.setName((String) body.get("name"));
            if (body.containsKey("profilePic")) admin.setProfilePic((String) body.get("profilePic"));
            return ResponseEntity.ok(adminRepository.save(admin));
        } else {
            Student student = studentRepository.findById(userDetails.getId()).get();
            if (body.containsKey("name")) student.setName((String) body.get("name"));
            if (body.containsKey("profilePic")) student.setProfilePic((String) body.get("profilePic"));
            if (body.containsKey("skills")) {
                @SuppressWarnings("unchecked")
                java.util.List<String> skills = (java.util.List<String>) body.get("skills");
                student.setSkills(skills);
            }
            if (body.containsKey("interests")) {
                @SuppressWarnings("unchecked")
                java.util.List<String> interests = (java.util.List<String>) body.get("interests");
                student.setInterests(interests);
            }
            return ResponseEntity.ok(studentRepository.save(student));
        }
    }
}

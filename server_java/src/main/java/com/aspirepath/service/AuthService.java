package com.aspirepath.service;

import com.aspirepath.dto.AuthResponse;
import com.aspirepath.model.Admin;
import com.aspirepath.model.Student;
import com.aspirepath.repository.AdminRepository;
import com.aspirepath.repository.StudentRepository;
import com.aspirepath.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final StudentRepository studentRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(StudentRepository studentRepository, AdminRepository adminRepository, 
                       PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.studentRepository = studentRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public void register(String name, String email, String password, String role, java.util.List<String> skills, java.util.List<String> interests) {
        if ("admin".equals(role)) {
            if (adminRepository.findByEmail(email).isPresent()) {
                throw new RuntimeException("Admin already exists");
            }
            Admin admin = new Admin();
            admin.setName(name != null ? name : "Admin");
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            adminRepository.save(admin);
        } else {
            if (studentRepository.findByEmail(email).isPresent()) {
                throw new RuntimeException("Student already exists");
            }
            Student student = new Student();
            student.setName(name);
            student.setEmail(email);
            student.setPassword(passwordEncoder.encode(password));
            if (skills != null) student.setSkills(skills);
            if (interests != null) student.setInterests(interests);
            studentRepository.save(student);
        }
    }

    public AuthResponse login(String email, String password) {
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                String token = jwtUtils.generateToken(admin.getId(), admin.getEmail(), "admin");
                AuthResponse response = new AuthResponse();
                response.setToken(token);
                response.setRole("admin");
                response.setAdmin(new AuthResponse.UserData(admin.getId(), admin.getName(), admin.getEmail(), admin.getProfilePic(), null, null));
                return response;
            }
        }

        Optional<Student> studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (passwordEncoder.matches(password, student.getPassword())) {
                String token = jwtUtils.generateToken(student.getId(), student.getEmail(), "student");
                AuthResponse response = new AuthResponse();
                response.setToken(token);
                response.setRole("student");
                response.setStudent(new AuthResponse.UserData(student.getId(), student.getName(), student.getEmail(), student.getProfilePic(), student.getSkills(), student.getInterests()));
                return response;
            }
        }

        throw new RuntimeException("Invalid credentials");
    }
}

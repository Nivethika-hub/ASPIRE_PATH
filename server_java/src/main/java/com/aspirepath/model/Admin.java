package com.aspirepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
public class Admin {
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getProfilePic() { return profilePic; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Admin() {}
    public Admin(Long id, String name, String email, String password, String profilePic, String role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.profilePic = profilePic;
        this.role = role;
        this.createdAt = createdAt;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name = "Admin";

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String profilePic = "";

    @Column(nullable = false)
    private String role = "admin";

    @CreationTimestamp
    private LocalDateTime createdAt;
}

package com.aspirepath.model;

import jakarta.persistence.*;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
public class Student {
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
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Student() {}
    public Student(Long id, String name, String email, String password, String profilePic, List<String> skills, List<String> interests, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.profilePic = profilePic;
        this.skills = skills;
        this.interests = interests;
        this.createdAt = createdAt;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String profilePic = "";

    @ElementCollection
    @CollectionTable(name = "student_skills", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "skill")
    private List<String> skills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "student_interests", joinColumns = @JoinColumn(name = "student_id"))
    @Column(name = "interest")
    private List<String> interests = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;
}

package com.aspirepath.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "opportunities")
public class Opportunity {
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getSkillsRequired() { return skillsRequired; }
    public void setSkillsRequired(List<String> skillsRequired) { this.skillsRequired = skillsRequired; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public String getApplyLink() { return applyLink; }
    public void setApplyLink(String applyLink) { this.applyLink = applyLink; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Opportunity() {}
    public Opportunity(Long id, String title, String type, String company, String description, List<String> skillsRequired, String location, LocalDateTime deadline, String applyLink, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.company = company;
        this.description = description;
        this.skillsRequired = skillsRequired;
        this.location = location;
        this.deadline = deadline;
        this.applyLink = applyLink;
        this.createdAt = createdAt;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type; // Hackathon, Internship, Job

    @Column(nullable = false)
    private String company;

    @Column(nullable = false, length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "opportunity_skills", joinColumns = @JoinColumn(name = "opportunity_id"))
    @Column(name = "skill")
    private List<String> skillsRequired = new ArrayList<>();

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(nullable = false)
    private String applyLink;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

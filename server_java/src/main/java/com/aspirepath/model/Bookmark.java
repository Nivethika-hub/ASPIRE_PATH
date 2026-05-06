package com.aspirepath.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookmarks")
public class Bookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Bookmark() {}

    public Bookmark(Long id, Student student, Opportunity opportunity, LocalDateTime createdAt) {
        this.id = id;
        this.student = student;
        this.opportunity = opportunity;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Opportunity getOpportunity() { return opportunity; }
    public void setOpportunity(Opportunity opportunity) { this.opportunity = opportunity; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

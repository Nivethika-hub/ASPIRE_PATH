package com.aspirepath.repository;

import com.aspirepath.model.Bookmark;
import com.aspirepath.model.Student;
import com.aspirepath.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByStudent(Student student);
    Optional<Bookmark> findByStudentAndOpportunity(Student student, Opportunity opportunity);
    void deleteByStudentAndOpportunity(Student student, Opportunity opportunity);
}

package com.aspirepath.service;

import com.aspirepath.model.Bookmark;
import com.aspirepath.model.Opportunity;
import com.aspirepath.model.Student;
import com.aspirepath.repository.BookmarkRepository;
import com.aspirepath.repository.OpportunityRepository;
import com.aspirepath.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final StudentRepository studentRepository;
    private final OpportunityRepository opportunityRepository;

    public BookmarkService(BookmarkRepository bookmarkRepository, StudentRepository studentRepository, OpportunityRepository opportunityRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.studentRepository = studentRepository;
        this.opportunityRepository = opportunityRepository;
    }

    public void addBookmark(Long studentId, Long opportunityId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        if (bookmarkRepository.findByStudentAndOpportunity(student, opportunity).isPresent()) {
            throw new RuntimeException("Already bookmarked");
        }

        Bookmark bookmark = new Bookmark();
        bookmark.setStudent(student);
        bookmark.setOpportunity(opportunity);
        bookmarkRepository.save(bookmark);
    }

    public List<Bookmark> getStudentBookmarks(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return bookmarkRepository.findByStudent(student);
    }

    @Transactional
    public void removeBookmark(Long studentId, Long opportunityId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        
        bookmarkRepository.deleteByStudentAndOpportunity(student, opportunity);
    }

    public boolean isBookmarked(Long studentId, Long opportunityId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        return bookmarkRepository.findByStudentAndOpportunity(student, opportunity).isPresent();
    }
}

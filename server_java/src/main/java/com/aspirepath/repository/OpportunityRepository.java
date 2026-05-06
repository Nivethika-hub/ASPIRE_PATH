package com.aspirepath.repository;

import com.aspirepath.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByType(String type);
    List<Opportunity> findByLocationContainingIgnoreCase(String location);
    List<Opportunity> findByTitleContainingIgnoreCase(String title);
    
    long countByDeadlineGreaterThanEqual(LocalDateTime date);
    long countByDeadlineLessThan(LocalDateTime date);
}

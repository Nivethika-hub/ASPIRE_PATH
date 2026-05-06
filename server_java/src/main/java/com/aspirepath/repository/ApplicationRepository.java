package com.aspirepath.repository;

import com.aspirepath.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    Optional<Application> findByStudentIdAndOpportunityId(Long studentId, Long opportunityId);
}

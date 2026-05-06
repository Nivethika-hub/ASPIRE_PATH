package com.aspirepath.service;

import com.aspirepath.model.Application;
import com.aspirepath.model.Opportunity;
import com.aspirepath.model.Student;
import com.aspirepath.repository.ApplicationRepository;
import com.aspirepath.repository.OpportunityRepository;
import com.aspirepath.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final OpportunityRepository opportunityRepository;

    public ApplicationService(ApplicationRepository applicationRepository, 
                             StudentRepository studentRepository, 
                             OpportunityRepository opportunityRepository) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.opportunityRepository = opportunityRepository;
    }

    public Application apply(Long studentId, Long opportunityId) {
        if (applicationRepository.findByStudentIdAndOpportunityId(studentId, opportunityId).isPresent()) {
            throw new RuntimeException("You have already applied for this opportunity");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        Application application = new Application();
        application.setStudent(student);
        application.setOpportunity(opportunity);
        application.setStatus(Application.ApplicationStatus.APPLIED);
        
        return applicationRepository.save(application);
    }

    public List<Application> getStudentApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public Application updateStatus(Long applicationId, Application.ApplicationStatus newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(newStatus);
        return applicationRepository.save(application);
    }
    
    public void deleteApplication(Long applicationId) {
        applicationRepository.deleteById(applicationId);
    }
}

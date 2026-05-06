package com.aspirepath.service;

import com.aspirepath.dto.OpportunityRecommendationResponse;
import com.aspirepath.model.Opportunity;
import com.aspirepath.model.Student;
import com.aspirepath.repository.OpportunityRepository;
import com.aspirepath.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;
    private final StudentRepository studentRepository;

    public OpportunityService(OpportunityRepository opportunityRepository, StudentRepository studentRepository) {
        this.opportunityRepository = opportunityRepository;
        this.studentRepository = studentRepository;
    }

    public List<Opportunity> getAllOpportunities(String type, String location, String search) {
        List<Opportunity> opportunities = opportunityRepository.findAll();

        return opportunities.stream()
                .filter(opp -> type == null || type.isEmpty() || opp.getType().equalsIgnoreCase(type))
                .filter(opp -> location == null || location.isEmpty() || opp.getLocation().toLowerCase().contains(location.toLowerCase()))
                .filter(opp -> search == null || search.isEmpty() || opp.getTitle().toLowerCase().contains(search.toLowerCase()))
                .sorted(Comparator.comparing(Opportunity::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<OpportunityRecommendationResponse> getRecommendations(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        List<Opportunity> opportunities = opportunityRepository.findAll();

        return opportunities.stream()
                .map(opp -> {
                    // Skill matching
                    long skillMatchCount = opp.getSkillsRequired().stream()
                            .filter(skill -> student.getSkills().stream()
                                    .anyMatch(s -> s.toLowerCase().contains(skill.toLowerCase()) || skill.toLowerCase().contains(s.toLowerCase())))
                            .count();
                    
                    double skillScore = opp.getSkillsRequired().isEmpty() ? 0 : 
                            ((double) skillMatchCount / opp.getSkillsRequired().size()) * 80; // Skills account for 80%

                    // Interest matching
                    long interestMatchCount = student.getInterests().stream()
                            .filter(interest -> 
                                opp.getTitle().toLowerCase().contains(interest.toLowerCase()) ||
                                opp.getDescription().toLowerCase().contains(interest.toLowerCase()) ||
                                opp.getType().toLowerCase().contains(interest.toLowerCase())
                            ).count();
                    
                    double interestScore = student.getInterests().isEmpty() ? 0 :
                            ((double) interestMatchCount / student.getInterests().size()) * 20; // Interests account for 20%

                    int totalScore = (int) Math.min(100, Math.round(skillScore + interestScore));
                    
                    return new OpportunityRecommendationResponse(opp, totalScore);
                })
                .filter(opp -> opp.getMatchScore() > 10) // Only show if match score > 10%
                .sorted(Comparator.comparing(OpportunityRecommendationResponse::getMatchScore).reversed())
                .collect(Collectors.toList());
    }

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        LocalDateTime now = LocalDateTime.now();
        
        stats.put("totalOpportunities", opportunityRepository.count());
        stats.put("activeOpportunities", opportunityRepository.countByDeadlineGreaterThanEqual(now));
        stats.put("expiredOpportunities", opportunityRepository.countByDeadlineLessThan(now));
        stats.put("totalStudents", studentRepository.count());
        
        return stats;
    }

    public Opportunity createOpportunity(Opportunity opportunity) {
        return opportunityRepository.save(opportunity);
    }

    public Opportunity updateOpportunity(Long id, Opportunity opportunityDetails) {
        Opportunity opportunity = opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
        
        opportunity.setTitle(opportunityDetails.getTitle());
        opportunity.setType(opportunityDetails.getType());
        opportunity.setCompany(opportunityDetails.getCompany());
        opportunity.setDescription(opportunityDetails.getDescription());
        opportunity.setSkillsRequired(opportunityDetails.getSkillsRequired());
        opportunity.setLocation(opportunityDetails.getLocation());
        opportunity.setDeadline(opportunityDetails.getDeadline());
        opportunity.setApplyLink(opportunityDetails.getApplyLink());
        
        return opportunityRepository.save(opportunity);
    }

    public void deleteOpportunity(Long id) {
        opportunityRepository.deleteById(id);
    }

    public Opportunity getOpportunityById(Long id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));
    }
}

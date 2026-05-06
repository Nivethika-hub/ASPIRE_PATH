package com.aspirepath.controller;

import com.aspirepath.dto.OpportunityRecommendationResponse;
import com.aspirepath.model.Opportunity;
import com.aspirepath.security.CustomUserDetails;
import com.aspirepath.service.OpportunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityService opportunityService;

    public OpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Opportunity> createOpportunity(@RequestBody Opportunity opportunity) {
        return ResponseEntity.status(201).body(opportunityService.createOpportunity(opportunity));
    }

    @GetMapping
    public ResponseEntity<List<Opportunity>> getAllOpportunities(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(opportunityService.getAllOpportunities(type, location, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Opportunity> getOpportunityById(@PathVariable Long id) {
        return ResponseEntity.ok(opportunityService.getOpportunityById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Opportunity> updateOpportunity(@PathVariable Long id, @RequestBody Opportunity opportunity) {
        return ResponseEntity.ok(opportunityService.updateOpportunity(id, opportunity));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOpportunity(@PathVariable Long id) {
        opportunityService.deleteOpportunity(id);
        return ResponseEntity.ok(Map.of("message", "Opportunity deleted"));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<OpportunityRecommendationResponse>> getRecommendations(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(opportunityService.getRecommendations(userDetails.getId()));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(opportunityService.getStats());
    }
}

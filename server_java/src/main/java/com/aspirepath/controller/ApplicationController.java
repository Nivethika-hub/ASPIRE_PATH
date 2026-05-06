package com.aspirepath.controller;

import com.aspirepath.model.Application;
import com.aspirepath.security.CustomUserDetails;
import com.aspirepath.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply/{opportunityId}")
    public ResponseEntity<?> apply(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long opportunityId) {
        try {
            return ResponseEntity.ok(applicationService.apply(userDetails.getId(), opportunityId));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyApplications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getStudentApplications(userDetails.getId()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            Application.ApplicationStatus status = Application.ApplicationStatus.valueOf(body.get("status"));
            return ResponseEntity.ok(applicationService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid status or application not found"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ResponseEntity.ok(Map.of("message", "Application removed from tracking"));
    }
}

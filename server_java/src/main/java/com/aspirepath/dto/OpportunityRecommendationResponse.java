package com.aspirepath.dto;

import com.aspirepath.model.Opportunity;

public class OpportunityRecommendationResponse extends Opportunity {
    private int matchScore;

    public OpportunityRecommendationResponse() {}

    public OpportunityRecommendationResponse(Opportunity opp, int matchScore) {
        this.setId(opp.getId());
        this.setTitle(opp.getTitle());
        this.setType(opp.getType());
        this.setCompany(opp.getCompany());
        this.setDescription(opp.getDescription());
        this.setSkillsRequired(opp.getSkillsRequired());
        this.setLocation(opp.getLocation());
        this.setDeadline(opp.getDeadline());
        this.setApplyLink(opp.getApplyLink());
        this.setCreatedAt(opp.getCreatedAt());
        this.matchScore = matchScore;
    }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }
}

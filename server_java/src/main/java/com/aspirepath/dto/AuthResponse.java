package com.aspirepath.dto;

import java.util.List;

public class AuthResponse {
    private String token;
    private String role;
    private UserData student;
    private UserData admin;

    public AuthResponse() {}

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public UserData getStudent() { return student; }
    public void setStudent(UserData student) { this.student = student; }
    public UserData getAdmin() { return admin; }
    public void setAdmin(UserData admin) { this.admin = admin; }

    public static class UserData {
        private Long id;
        private String name;
        private String email;
        private String profilePic;
        private List<String> skills;
        private List<String> interests;

        public UserData() {}

        public UserData(Long id, String name, String email, String profilePic, List<String> skills, List<String> interests) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.profilePic = profilePic;
            this.skills = skills;
            this.interests = interests;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getProfilePic() { return profilePic; }
        public void setProfilePic(String profilePic) { this.profilePic = profilePic; }
        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) { this.skills = skills; }
        public List<String> getInterests() { return interests; }
        public void setInterests(List<String> interests) { this.interests = interests; }
    }
}

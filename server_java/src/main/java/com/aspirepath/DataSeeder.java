package com.aspirepath;

import com.aspirepath.model.Admin;
import com.aspirepath.model.Opportunity;
import com.aspirepath.model.Student;
import com.aspirepath.repository.AdminRepository;
import com.aspirepath.repository.OpportunityRepository;
import com.aspirepath.repository.StudentRepository;
import com.aspirepath.repository.BookmarkRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final OpportunityRepository opportunityRepository;
    private final BookmarkRepository bookmarkRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AdminRepository adminRepository, StudentRepository studentRepository,
                      OpportunityRepository opportunityRepository, BookmarkRepository bookmarkRepository,
                      PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.opportunityRepository = opportunityRepository;
        this.bookmarkRepository = bookmarkRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedStudent();
        seedOpportunities();
    }

    private void seedAdmin() {
        if (adminRepository.findByEmail("priya@gmail.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setName("Priya Admin");
            admin.setEmail("priya@gmail.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            adminRepository.save(admin);
            System.out.println("✅ Seeded admin: priya@gmail.com / 123456");
        }
    }

    private void seedStudent() {
        if (studentRepository.findByEmail("rithanya@gmail.com").isEmpty()) {
            Student student = new Student();
            student.setName("Rithanya");
            student.setEmail("rithanya@gmail.com");
            student.setPassword(passwordEncoder.encode("654321"));
            student.setSkills(Arrays.asList("React", "Java", "Spring Boot", "Python", "Machine Learning"));
            student.setInterests(Arrays.asList("AI", "Web Development", "Hackathons", "Startups"));
            studentRepository.save(student);
            System.out.println("✅ Seeded student: rithanya@gmail.com / 654321");
        }
    }

    private void seedOpportunities() {
        System.out.println("🌱 Cleaning and re-seeding dummy opportunities...");
        bookmarkRepository.deleteAll();
        opportunityRepository.deleteAll();
        
        List<Opportunity> opportunities = Arrays.asList(

                createOpportunity(
                    "Smart India Hackathon 2025",
                    "Hackathon",
                    "Ministry of Education",
                    "India's biggest hackathon. Build innovative tech solutions for real government problems. Open to all college students.",
                    Arrays.asList("React", "Python", "Machine Learning", "Cloud"),
                    "Chennai",
                    LocalDateTime.now().plusDays(30),
                    "https://www.sih.gov.in/"
                ),

                createOpportunity(
                    "Full Stack Developer Intern",
                    "Internship",
                    "Zoho Corporation",
                    "6-month paid internship for Full Stack developers. Work on real products used by millions of customers worldwide.",
                    Arrays.asList("Java", "Spring Boot", "React", "MySQL"),
                    "Chennai",
                    LocalDateTime.now().plusDays(20),
                    "https://careers.zohocorp.com/"
                ),

                createOpportunity(
                    "AI/ML Engineer",
                    "Job",
                    "Freshworks",
                    "Build AI-powered CRM features. Work with large-scale data and cutting-edge ML models in production.",
                    Arrays.asList("Python", "Machine Learning", "TensorFlow", "SQL"),
                    "Chennai",
                    LocalDateTime.now().plusDays(45),
                    "https://www.freshworks.com/company/careers/"
                ),

                createOpportunity(
                    "Hack With Amazon 2025",
                    "Hackathon",
                    "Amazon Web Services",
                    "48-hour cloud computing hackathon. Build innovative solutions using AWS services. Win up to ₹5 lakhs in prizes.",
                    Arrays.asList("AWS", "Python", "Cloud", "React"),
                    "Bangalore",
                    LocalDateTime.now().plusDays(15),
                    "https://aws.amazon.com/events/hackathon/"
                ),

                createOpportunity(
                    "React Developer Intern",
                    "Internship",
                    "Infosys",
                    "3-month internship to work on enterprise-grade React applications. Mentored by senior engineers.",
                    Arrays.asList("React", "JavaScript", "CSS", "REST APIs"),
                    "Pune",
                    LocalDateTime.now().plusDays(25),
                    "https://www.infosys.com/careers/"
                ),

                createOpportunity(
                    "Data Science Analyst",
                    "Job",
                    "TCS",
                    "Join TCS as a Data Science Analyst. Build dashboards, run statistical models, and drive business decisions with data.",
                    Arrays.asList("Python", "Machine Learning", "SQL", "Power BI"),
                    "Hyderabad",
                    LocalDateTime.now().plusDays(60),
                    "https://www.tcs.com/careers"
                ),

                createOpportunity(
                    "HackRush Coimbatore",
                    "Hackathon",
                    "PAALS University",
                    "24-hour hackathon exclusively for engineering students. Solve industry-grade problems in AI, FinTech, and Healthcare tracks.",
                    Arrays.asList("AI", "React", "Python", "Java"),
                    "Coimbatore",
                    LocalDateTime.now().plusDays(10),
                    "https://hackrush.dev/"
                ),

                createOpportunity(
                    "Backend Java Developer",
                    "Job",
                    "PayU India",
                    "Work on high-traffic payment processing systems built on Java and Spring Boot. Join a fast-paced FinTech team.",
                    Arrays.asList("Java", "Spring Boot", "Microservices", "PostgreSQL"),
                    "Mumbai",
                    LocalDateTime.now().plusDays(40),
                    "https://careers.payu.in/"
                ),

                createOpportunity(
                    "Machine Learning Intern",
                    "Internship",
                    "Samsung R&D India",
                    "Hands-on internship with Samsung's AI research lab. Work on real ML problems in computer vision and NLP.",
                    Arrays.asList("Python", "Machine Learning", "Deep Learning", "OpenCV"),
                    "Bangalore",
                    LocalDateTime.now().plusDays(18),
                    "https://research.samsung.com/careers"
                ),

                createOpportunity(
                    "Google Developer Student Club Hackathon",
                    "Hackathon",
                    "Google Developer Groups",
                    "Open hackathon by GDSC chapters. Build solutions for social good. 72-hour challenge with mentors from Google.",
                    Arrays.asList("React", "Firebase", "Python", "Android"),
                    "Delhi",
                    LocalDateTime.now().plusDays(35),
                    "https://gdsc.community.dev/"
                ),
                createOpportunity(
                    "Python Data Science Workshop",
                    "Workshop",
                    "NPTEL India",
                    "A comprehensive workshop on Data Science using Python. Learn NumPy, Pandas, and Scikit-learn from industry experts.",
                    Arrays.asList("Python", "Data Science", "Pandas"),
                    "Online",
                    LocalDateTime.now().plusDays(12),
                    "https://nptel.ac.in/"
                ),
                createOpportunity(
                    "UI/UX Design Challenge",
                    "Competition",
                    "Adobe India",
                    "Design the next generation of mobile apps. 48-hour design sprint for creative students. Winners get Adobe Creative Cloud subscriptions.",
                    Arrays.asList("Figma", "UI/UX", "Design"),
                    "Remote",
                    LocalDateTime.now().plusDays(22),
                    "https://www.adobe.com/in/"
                ),
                createOpportunity(
                    "Cyber Security Analyst Intern",
                    "Internship",
                    "Quick Heal",
                    "Join our threat research team. Learn about malware analysis, network security, and vulnerability assessment.",
                    Arrays.asList("Networking", "Security", "Python"),
                    "Pune",
                    LocalDateTime.now().plusDays(15),
                    "https://www.quickheal.co.in/careers"
                )
            );

            opportunityRepository.saveAll(opportunities);
            System.out.println("✅ Seeded " + opportunities.size() + " dummy opportunities.");
    }

    private Opportunity createOpportunity(String title, String type, String company,
                                          String description, List<String> skills,
                                          String location, LocalDateTime deadline, String applyLink) {
        Opportunity opp = new Opportunity();
        opp.setTitle(title);
        opp.setType(type);
        opp.setCompany(company);
        opp.setDescription(description);
        opp.setSkillsRequired(skills);
        opp.setLocation(location);
        opp.setDeadline(deadline);
        opp.setApplyLink(applyLink);
        return opp;
    }
}

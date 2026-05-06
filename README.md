# AspirePath - Student Opportunity Discovery Platform

A Full-Stack application designed to help students discover and track hackathons, internships, and job opportunities with AI-driven recommendations.

## 🚀 Tech Stack

**Frontend:**
- React.js
- React Router (Navigation)
- Axios (API Communication)
- Vanilla CSS & Tailwind CSS
- Chart.js (Analytics Visualization)

**Backend:**
- Java Spring Boot (v3.1.5)
- Spring Data JPA
- PostgreSQL (Database)
- Spring Security & JWT (Authentication)
- Lombok

## ✨ Key Features

### 🎓 Student Features
- **Personalized Recommendations**: Opportunities suggested based on your specific skills and interests provided during registration.
- **Application Tracker**: Monitor your progress (Applied, Interviewing, Offered, Rejected) for every opportunity.
- **Bookmark System**: Save interesting opportunities to your favorites for later.
- **Deadline Management**: Visual indicators for upcoming opportunity deadlines.
- **Interactive Profile**: Manage your skills, interests, and profile picture.

### 🛡️ Admin Features
- **Centralized Dashboard**: High-level statistics on platform growth and opportunity distribution.
- **CRUD Management**: Full control to Add, Edit, and Delete opportunities.
- **Analytics Visualization**: Interactive charts for monitoring student engagement and opportunity types.
- **Profile Settings**: Manage administrative account details.

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Java 17 or higher
- PostgreSQL (v14 or higher)
- Maven (for dependency management)

### Backend Setup (Spring Boot)
1. Navigate to the server directory:
   ```bash
   cd server_java
   ```
2. Configure your database in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/aspirepath
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on **http://localhost:5001**.

### Frontend Setup (React)
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on **http://localhost:3000**.

## 🔑 Default Credentials
- **Admin**: `priya@gmail.com` / `123456`
- **Student**: `rithanya@gmail.com` / `654321`

## 📂 Project Structure
```
AspirePath/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI elements
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services (axios)
│   │   └── assets/        # Images and icons
├── server_java/           # Spring Boot Backend
│   ├── src/main/java/     # Java Source Code
│   │   ├── controller/    # REST API endpoints
│   │   ├── model/         # Database entities
│   │   ├── repository/    # JPA repositories
│   │   └── service/       # Business logic
│   └── src/main/resources # Configuration and SQL seeds
```

## 📜 License
This project is for educational purposes.

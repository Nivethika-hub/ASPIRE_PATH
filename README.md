# AspirePath - Student Opportunity Discovery Platform

A Full Stack Development project that helps students discover hackathons, internships, and job opportunities.

## Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- Tailwind CSS
- Chart.js

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## Features

### Student Features
- Browse and search opportunities
- Filter by type, location, and domain
- Bookmark opportunities
- View skill-based recommendations
- Track deadlines
- Update profile

### Admin Features
- Add new opportunities
- Edit existing opportunities
- Delete opportunities
- View platform statistics
- Dashboard with charts

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aspirepath
JWT_SECRET=aspirepath_secret_key_2024
ADMIN_EMAIL=admin@aspirepath.com
ADMIN_PASSWORD=admin123
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to client directory:
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

Frontend will run on http://localhost:3000

## Default Admin Credentials

- Email: admin@aspirepath.com
- Password: admin123

## Project Structure

```
AspirePath/
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── server/                # Backend
    ├── models/            # Database models
    ├── routes/            # API routes
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware
    ├── config/            # Configuration files
    ├── server.js          # Entry point
    └── package.json
```

## API Endpoints

### Authentication
- POST /api/auth/register - Student registration
- POST /api/auth/login - Student login
- POST /api/auth/admin-login - Admin login
- GET /api/auth/profile - Get student profile
- PUT /api/auth/profile - Update student profile

### Opportunities
- GET /api/opportunities - Get all opportunities
- GET /api/opportunities/:id - Get opportunity by ID
- POST /api/opportunities - Create opportunity (Admin)
- PUT /api/opportunities/:id - Update opportunity (Admin)
- DELETE /api/opportunities/:id - Delete opportunity (Admin)
- GET /api/opportunities/recommendations - Get recommendations
- GET /api/opportunities/stats - Get statistics (Admin)

### Bookmarks
- POST /api/bookmarks - Add bookmark
- GET /api/bookmarks - Get user bookmarks
- DELETE /api/bookmarks/:id - Remove bookmark
- GET /api/bookmarks/check/:opportunityId - Check if bookmarked

## Routes

### Public Routes
- / - Landing page
- /login - Student login
- /register - Student registration
- /admin-login - Admin login
- /explore - Browse opportunities

### Student Routes
- /dashboard - Student dashboard
- /opportunity/:id - Opportunity details
- /bookmarks - Saved opportunities
- /profile - Edit profile

### Admin Routes
- /admin/dashboard - Admin dashboard
- /admin/add-opportunity - Add new opportunity
- /admin/opportunity/edit/:id - Edit opportunity

## Features Implemented

1. **Authentication**: JWT-based authentication for students and admins
2. **CRUD Operations**: Full CRUD for opportunities
3. **Bookmarking**: Students can save opportunities
4. **Filtering**: Search and filter opportunities
5. **Recommendations**: Skill-based opportunity matching
6. **Deadline Tracking**: Visual countdown for deadlines
7. **Statistics**: Admin dashboard with charts
8. **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## License

This is a college project for educational purposes.

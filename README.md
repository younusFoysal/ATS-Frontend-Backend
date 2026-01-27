# ATS (Applicant Tracking System)

A comprehensive Applicant Tracking System with AI-powered resume parsing, video interview analysis, and candidate evaluation.

## System Architecture

The ATS consists of three main components:

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────────┐
│   Admin Panel   │         │   Get Jobs       │         │   ATS Server        │
│   (React)       │────────▶│   (React)        │────────▶│   (Node.js)         │
│   Port: 5174    │         │   Port: 5173     │         │   Port: 5001        │
└─────────────────┘         └──────────────────┘         └─────────────────────┘
                                                                      │
                                                                      │
                                    ┌─────────────────────────────────┴────────────────────┐
                                    │                                                      │
                                    ▼                                                      ▼
                          ┌──────────────────┐                              ┌──────────────────────┐
                          │  Resume Parser   │                              │  Video Analyzer      │
                          │  (Python/Flask)  │                              │  (Python/Flask)      │
                          │  Port: 5000      │                              │  Port: 3001          │
                          └──────────────────┘                              └──────────────────────┘
                                    │                                                      │
                                    └──────────────────┬───────────────────────────────────┘
                                                       │
                                                       ▼
                                             ┌──────────────────┐
                                             │   MongoDB        │
                                             │   Database       │
                                             └──────────────────┘
```

## Project Structure

```
ATS/
├── admin-panel/         # Admin dashboard (React + Vite)
│   └── src/
│       ├── api/         # API services
│       ├── components/  # Reusable components
│       ├── context/     # React contexts
│       └── pages/       # Admin pages
├── get-jobs/            # User portal (React + Vite)
│   └── src/
│       ├── api/         # API services
│       ├── components/  # Reusable components
│       ├── context/     # React contexts
│       └── pages/       # User pages
└── ATS-server/          # Backend API (Node.js + Express)
    ├── models/          # MongoDB models
    ├── controllers/     # API controllers
    └── routes/          # API routes
```

## Complete Application Workflow

### 1. Job Management Flow (Admin → Users)

```
1. Admin logs in to Admin Panel (localhost:5174)
   └─▶ POST /api/auth/admin/login

2. Admin creates/edits/deletes jobs
   └─▶ POST /api/jobs (Create)
   └─▶ PUT /api/jobs/:id (Update)
   └─▶ DELETE /api/jobs/:id (Delete)

3. Users view jobs in Get Jobs portal (localhost:5173)
   └─▶ GET /api/jobs (List all jobs)
   └─▶ GET /api/jobs/:id (Job details)
```

### 2. Application Submission Flow (User → Backend → Python APIs)

```
1. User clicks "Apply" on job
   └─▶ Opens Application Modal

2. User uploads resume PDF
   └─▶ Frontend: POST to ATS-server /api/applications
   └─▶ ATS-server: Forwards PDF to Python Resume Parser
       └─▶ POST http://localhost:5000/parse-resume
       └─▶ Wait up to 10 minutes for parsing
       └─▶ Returns structured JSON with candidate info

3. User answers interview questions
   └─▶ Shows interview questions in modal

4. User records video interview
   └─▶ Camera opens and records 5-10 minute video
   └─▶ Video uploaded to Publitio CDN
   └─▶ Publitio returns video URL

5. Video sent for AI analysis
   └─▶ ATS-server: POST to Python Video Analyzer
       └─▶ POST http://localhost:3001/parse-video
       └─▶ Body: { "video_url": "https://publit.io/..." }
       └─▶ Returns emotion analysis + transcription

6. Application saved to MongoDB
   └─▶ Stores: Resume data + Video URL + AI analysis
   └─▶ Returns 201 Created
```

### 3. Application Review Flow (Admin → Backend → Python API)

```
1. Admin views applications list
   └─▶ GET /api/applications

2. Admin opens application details
   └─▶ GET /api/applications/:id
   └─▶ Shows: Parsed resume, Video transcript, Emotion analysis

3. Admin clicks "Evaluate Candidate"
   └─▶ POST http://localhost:3001/evaluate-candidate
   └─▶ Sends: Resume + Interview data + Job description
   └─▶ Returns: AI evaluation with scores
       ├─── Technical score (0-5)
       ├─── Communication score (0-5)
       ├─── Experience score (0-5)
       ├─── Education score (0-5)
       ├─── Professionalism score (0-5)
       ├─── Overall score
       └─── Summary & recommendations

4. Results displayed in modal
   └─▶ Shows scores with reasons and summary
```

## Technology Stack

### Frontend (Admin Panel + Get Jobs)
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **TanStack Query** - Data fetching & caching
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Tailwind CSS** - Styling

### Backend (ATS-server)
- **Node.js + Express** - Web server
- **MongoDB + Mongoose** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Multer** - File upload handling
- **Axios** - HTTP client for Python APIs
- **Publitio SDK** - Video storage
- **dotenv** - Environment variables
- **nodemon** - Auto-restart on changes

### AI Services (Python)
- **Flask** - Web framework
- **Resume Parser** (Port 5000) - PDF parsing
- **Video Analyzer** (Port 3001) - Emotion + speech analysis
- **Candidate Evaluator** (Port 3001) - AI scoring

### External Services
- **Publitio** - Video CDN storage
- **MongoDB Atlas** - Cloud database

## Backend Setup

### Technologies Used
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin resource sharing

### Environment Variables
Create a `.env` file in `ATS-server/`:
```
PORT=5001
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-change-this-in-production
ADMIN_EMAIL=atsadmin@gmail.com
ADMIN_PASSWORD=atsadmin123
PUBLITIO_API_KEY=your-publitio-api-key
PUBLITIO_API_SECRET=your-publitio-api-secret
RESUME_PARSER_URL=http://localhost:5000
VIDEO_ANALYZER_URL=http://localhost:3001
```

### Installation & Running
```bash
cd ATS-server
npm install
npm start
```

The server will start on **http://localhost:5001**

### API Endpoints

#### Authentication Endpoints

##### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

##### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

##### 3. Admin Login
**POST** `/api/auth/admin/login`

**Request Body:**
```json
{
  "email": "atsadmin@gmail.com",
  "password": "atsadmin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "admin-id",
      "name": "Admin",
      "email": "atsadmin@gmail.com",
      "isAdmin": true
    }
  }
}
```

#### Job Management Endpoints

##### 4. Create Job (Admin Only)
**POST** `/api/jobs`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "title": "Data Analyst - Entry to Mid-Level",
  "role": "Data Analyst",
  "level": "Entry to Mid-level (0-3 years)",
  "location": "Remote",
  "employmentType": "Full-time",
  "salary": {
    "min": 60000,
    "max": 85000,
    "currency": "USD"
  },
  "description": "Job description...",
  "requiredSkills": ["SQL", "Python", "Excel"],
  "preferredSkills": ["Pandas", "Tableau"],
  "educationRequirements": ["Bachelor's degree"],
  "softSkills": ["Communication", "Problem solving"],
  "experienceExpectations": ["0-3 years experience"],
  "projectExpectations": ["Dashboard creation"],
  "responsibilities": ["Analyze data", "Create reports"],
  "benefits": ["Health insurance", "Remote work"]
}
```

##### 5. Get All Jobs
**GET** `/api/jobs`

**Query Parameters:**
- `search` (optional) - Search by title, role, or location

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "job-id",
      "title": "Data Analyst",
      "role": "Data Analyst",
      "location": "Remote",
      "employmentType": "Full-time",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

##### 6. Get Job Details
**GET** `/api/jobs/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "job-id",
    "title": "Data Analyst",
    "role": "Data Analyst",
    "level": "Entry to Mid-level",
    "location": "Remote",
    "employmentType": "Full-time",
    "salary": { "min": 60000, "max": 85000, "currency": "USD" },
    "description": "...",
    "requiredSkills": ["..."],
    "preferredSkills": ["..."],
    "educationRequirements": ["..."],
    "softSkills": ["..."],
    "experienceExpectations": ["..."],
    "projectExpectations": ["..."],
    "responsibilities": ["..."],
    "benefits": ["..."],
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

##### 7. Update Job (Admin Only)
**PUT** `/api/jobs/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:** Same as Create Job

##### 8. Delete Job (Admin Only)
**DELETE** `/api/jobs/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

#### Application Endpoints

##### 9. Submit Application
**POST** `/api/applications`

**Headers:**
```
Authorization: Bearer <user-token>
Content-Type: multipart/form-data
```

**Form Data:**
- `resume` - PDF file
- `jobId` - Job ID
- `videoUrl` - Video interview URL (from Publitio)
- `answers` - JSON string of interview answers

**Process:**
1. Receives resume PDF
2. Sends PDF to Python Resume Parser (http://localhost:5000/parse-resume)
3. Waits up to 10 minutes for parsing
4. Receives video URL and sends to Python Video Analyzer (http://localhost:3001/parse-video)
5. Saves application with parsed data to MongoDB

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "application-id",
    "jobId": "job-id",
    "userId": "user-id",
    "parsedResume": { "name": "...", "email": "...", "skills": ["..."] },
    "videoAnalysis": { "emotions": {...}, "subtitles": {...} },
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

##### 10. Get All Applications (Admin Only)
**GET** `/api/applications`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "application-id",
      "jobId": "job-id",
      "jobTitle": "Data Analyst",
      "userId": "user-id",
      "userName": "John Doe",
      "userEmail": "john@example.com",
      "status": "pending",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

##### 11. Get Application Details (Admin Only)
**GET** `/api/applications/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "application-id",
    "jobId": "job-id",
    "job": { "title": "...", "role": "..." },
    "userId": "user-id",
    "user": { "name": "...", "email": "..." },
    "parsedResume": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "skills": ["SQL", "Python"],
      "education": [{"degree": "...", "university": "..."}],
      "experience": [{"title": "...", "company": "..."}],
      "experience_years": 2.5
    },
    "videoUrl": "https://publit.io/...",
    "videoAnalysis": {
      "emotions": {
        "percentages": {"Happiness": 40, "Neutral": 35, "...": 25},
        "dominant_emotion": "Happiness"
      },
      "subtitles": {
        "full_text": "Interview transcript...",
        "segments": [{"start": 0, "end": 5, "text": "..."}]
      },
      "video_metadata": {
        "duration_seconds": 180,
        "resolution": {"width": 1280, "height": 720},
        "fps": 30
      }
    },
    "status": "pending",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

##### 12. Get User Applications
**GET** `/api/applications/user/:userId`

**Headers:**
```
Authorization: Bearer <user-token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "application-id",
      "jobId": "job-id",
      "jobTitle": "Data Analyst",
      "status": "pending",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Candidate Evaluation Endpoint

##### 13. Evaluate Candidate (Admin Only)
**POST** `/api/applications/:id/evaluate`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Process:**
1. Retrieves application data from MongoDB
2. Sends to Python Evaluator (http://localhost:3001/evaluate-candidate)
3. Receives AI evaluation with scores

**Python API Request Body:**
```json
{
  "resume": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "skills": ["SQL", "Python"],
    "education": [{"degree": "...", "university": "..."}],
    "experience": [{"title": "...", "company": "..."}],
    "experience_years": 2.5
  },
  "interview": {
    "emotions": {
      "percentages": {"Happiness": 40, "Neutral": 35},
      "dominant_emotion": "Happiness"
    },
    "subtitles": {
      "full_text": "Interview transcript...",
      "segments": [...]
    },
    "video_metadata": {...}
  },
  "videoInterviewUrl": "https://publit.io/...",
  "job_description": {...},
  "job_title": "Data Analyst"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "technical": 4.0,
      "technical_reason": "Strong technical skills...",
      "communication": 3.5,
      "communication_reason": "Good communication...",
      "experience": 3.0,
      "experience_reason": "Relevant experience...",
      "education": 4.5,
      "education_reason": "Strong educational background...",
      "professionalism": 4.0,
      "professionalism_reason": "Professional demeanor...",
      "overall": 3.8,
      "mode": "llm-only",
      "rationale": "AI evaluation..."
    },
    "summary": "Candidate shows strong potential..."
  }
}
```

### Python APIs (External Services)

#### Resume Parser API
**URL:** http://localhost:5000/parse-resume
**Method:** POST
**Content-Type:** multipart/form-data
**Timeout:** 10 minutes

**Request:**
```bash
curl -X POST http://localhost:5000/parse-resume \
     -F "file=@resume.pdf"
```

**Response:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "skills": ["SQL", "Python", "Excel"],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "university": "University Name",
      "start_year": "2018",
      "end_year": "2022"
    }
  ],
  "experience": [
    {
      "title": "Data Analyst",
      "company": "Company Name",
      "start_date": "2022-06",
      "end_date": "Present"
    }
  ],
  "experience_years": 2.5
}
```

#### Video Analyzer API
**URL:** http://localhost:3001/parse-video
**Method:** POST
**Content-Type:** application/json
**Timeout:** Default

**Request:**
```bash
curl -X POST http://localhost:3001/parse-video \
     -H "Content-Type: application/json" \
     -d '{"video_url": "https://publit.io/file/video.mp4"}'
```

**Response:**
```json
{
  "emotions": {
    "distribution": [
      {"emotion": "Happiness", "score": 40.5},
      {"emotion": "Neutral", "score": 35.2}
    ],
    "dominant_emotion": "Happiness",
    "percentages": {
      "Happiness": 40.5,
      "Neutral": 35.2,
      "Sadness": 10.3
    }
  },
  "subtitles": {
    "full_text": "Full interview transcript...",
    "segments": [
      {
        "start": 0.0,
        "end": 5.2,
        "text": "First part of interview..."
      }
    ]
  },
  "video_metadata": {
    "duration_seconds": 180.5,
    "fps": 30,
    "resolution": {
      "width": 1280,
      "height": 720
    }
  },
  "processing_info": {
    "emotion_frames_analyzed": 150,
    "emotion_model": "enet_b0_8_best_vgaf",
    "subtitle_segments_count": 10
  }
}
```

#### Candidate Evaluator API
**URL:** http://localhost:3001/evaluate-candidate
**Method:** POST
**Content-Type:** application/json

**Request:**
```bash
curl -X POST http://localhost:3001/evaluate-candidate \
     -H "Content-Type: application/json" \
     -d '{
       "resume": {...},
       "interview": {...},
       "videoInterviewUrl": "...",
       "job_description": {...},
       "job_title": "..."
     }'
```

**Response:**
```json
{
  "evaluation": {
    "technical": 4.0,
    "technical_reason": "Strong technical skills with SQL and Python proficiency.",
    "communication": 3.5,
    "communication_reason": "Clear communication with good articulation.",
    "experience": 3.0,
    "experience_reason": "2.5 years of relevant experience meets job requirements.",
    "education": 4.5,
    "education_reason": "Bachelor's degree in Computer Science from accredited university.",
    "professionalism": 4.0,
    "professionalism_reason": "Professional demeanor throughout the interview.",
    "overall": 3.8,
    "mode": "llm-only (LLM provider=openrouter, model=qwen/qwen-2.5-7b-instruct)",
    "rationale": "Blended heuristic with LLM-evaluated rubric."
  },
  "summary": "- Strong educational background with perfect score.\n- Technical skills are solid, rated at 4.0.\n- Communication and professionalism are above average.\n- Experience meets the job requirements.\n- Overall score of 3.8 indicates a strong candidate.\n- Recommended for further consideration."
}
```

## Frontend Setup

### Technologies Used
- **React 18** - UI library
- **React Router DOM** - Routing
- **TanStack Query (React Query)** - Data fetching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Color Palette
- **#04060D** - Black (Primary background)
- **#D3D4D7** - Gray (Cards, text)
- **#143AA2** - Blue (Primary actions)
- **#3E8DE3** - Sky (Secondary elements)

### Environment Variables
Create a `.env` file in `get-jobs/`:
```
VITE_API_URL=http://localhost:5001
```

### Installation & Running
```bash
cd get-jobs
npm install
npm run dev
```

The app will start on **http://localhost:5174** (or another available port)

### Pages

1. **Login** (`/login`) - User login page
2. **Register** (`/register`) - User registration page
3. **Home** (`/`) - Protected dashboard (requires authentication)

### Features

- ✅ User registration with validation
- ✅ User login with JWT authentication
- ✅ Protected routes (redirects to login if not authenticated)
- ✅ Token stored in localStorage
- ✅ Automatic token injection in API requests
- ✅ Clean UI with specified color scheme
- ✅ Form validation (password length, matching passwords, etc.)
- ✅ Loading states during API calls
- ✅ Error handling and display

### Authentication Flow

1. User registers/logs in
2. Backend returns JWT token and user data
3. Frontend stores token in localStorage
4. AuthContext manages authentication state
5. Protected routes check authentication status
6. API requests automatically include token in headers

## Testing the System

### Running All Services

You need to run 5 services simultaneously:

```bash
# Terminal 1 - MongoDB (if local)
mongod

# Terminal 2 - ATS Backend
cd ATS-server
npm start

# Terminal 3 - Admin Panel
cd admin-panel
npm run dev

# Terminal 4 - User Portal
cd get-jobs
npm run dev

# Terminal 5 & 6 - Python Services (managed by your Python developer)
# Resume Parser: http://localhost:5000
# Video Analyzer & Evaluator: http://localhost:3001
```

### Backend API Tests (using curl)

**Test User Registration:**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Test User Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Test Admin Login:**
```bash
curl -X POST http://localhost:5001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"atsadmin@gmail.com","password":"atsadmin123"}'
```

**Test Create Job (Admin):**
```bash
curl -X POST http://localhost:5001/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "title": "Data Analyst",
    "role": "Data Analyst",
    "level": "Entry to Mid-level",
    "location": "Remote",
    "employmentType": "Full-time",
    "salary": {"min": 60000, "max": 85000, "currency": "USD"},
    "description": "Job description...",
    "requiredSkills": ["SQL", "Python"],
    "preferredSkills": ["Tableau"],
    "educationRequirements": ["Bachelor degree"],
    "softSkills": ["Communication"],
    "experienceExpectations": ["0-3 years"],
    "projectExpectations": ["Dashboard creation"],
    "responsibilities": ["Data analysis"],
    "benefits": ["Remote work"]
  }'
```

**Test Get Jobs:**
```bash
curl http://localhost:5001/api/jobs
```

**Test Resume Parser (Python API):**
```bash
curl -X POST http://localhost:5000/parse-resume \
     -F "file=@path/to/resume.pdf"
```

**Test Video Analyzer (Python API):**
```bash
curl -X POST http://localhost:3001/parse-video \
     -H "Content-Type: application/json" \
     -d '{"video_url": "https://publit.io/file/video.mp4"}'
```

### Frontend Testing

#### Admin Panel (http://localhost:5174)
1. Login with admin credentials:
   - Email: `atsadmin@gmail.com`
   - Password: `atsadmin123`
2. Create a new job posting
3. View/edit/delete job postings
4. View applications list
5. Click on application to see details
6. Click "Evaluate Candidate" to get AI evaluation

#### User Portal (http://localhost:5173)
1. Register a new user account
2. Login with user credentials
3. Browse jobs list
4. Search for specific jobs
5. View job details
6. Click "Apply" to start application:
   - Upload resume PDF
   - Wait for resume parsing (up to 10 minutes)
   - Answer interview questions
   - Click "Open Camera and Record"
   - Record 5-10 minute video interview (English only)
   - Submit application
7. View "My Applications" to see submitted applications

### End-to-End Testing Flow

1. **Admin creates job:**
   - Login to Admin Panel
   - Create job posting
   - Verify job appears in list

2. **User applies for job:**
   - Login to User Portal
   - Find job and click Apply
   - Upload resume PDF
   - System parses resume (wait 1-10 minutes)
   - Answer interview questions
   - Record video interview
   - Video uploads to Publitio
   - System analyzes video for emotions and transcription
   - Application submitted

3. **Admin reviews application:**
   - Check Applications list
   - Open application details
   - Review parsed resume data
   - Watch video and see transcript
   - See emotion analysis
   - Click "Evaluate Candidate"
   - View AI evaluation scores and summary

### Expected Timeouts

- **Resume Parsing:** Up to 10 minutes
- **Video Analysis:** 1-3 minutes (depending on video length)
- **Candidate Evaluation:** 30-60 seconds

## Project Status

✅ Backend authentication APIs implemented and tested
✅ Frontend login/register pages created
✅ TanStack Query integration complete
✅ Authentication context and protected routes working
✅ Color scheme applied consistently
✅ MongoDB connection configured
✅ Token-based authentication working

## Next Steps

- Add password reset functionality
- Add email verification
- Add user profile management
- Add refresh token mechanism
- Add rate limiting for security
- Add more comprehensive error handling
- Add unit and integration tests

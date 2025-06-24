# Feedback System

A comprehensive feedback management system with a FastAPI backend and a modern React frontend. Features include role-based dashboards, team management, interactive comments, peer feedback, analytics, and PDF export.

---

## 🚀 Features

### General
- Secure authentication (JWT)
- Role-based access (Manager/Employee)
- Real-time dashboards and analytics
- Modular, extensible architecture

### Manager Features
- Dashboard with feedback stats and sentiment trends
- Team management (add/remove/view team members)
- Send and manage feedback for employees
- View team member profiles and feedback history
- Advanced analytics (sentiment trends, performance charts, distribution)
- View comments on feedback (read-only)
- Respond to feedback requests
- Notifications for new feedback/requests

### Employee Features
- View and acknowledge received feedback
- Add and view comments on feedback
- Request feedback from managers or peers
- Send peer feedback (with optional anonymity)
- Export feedback to PDF
- View notifications

---

## 🖥️ Main UI Sections (Frontend)
- **Employee Dashboard:** Feedback timeline, actions, requests, summary
- **Manager Dashboard:** Team overview, stats, analytics
- **Peer Feedback Page:** Give/view peer feedback, user selection, anonymity
- **Request Feedback Page:** Send/track feedback requests
- **Team Management:** Add/remove/view team members
- **Notifications:** View and mark notifications
- **Analytics:** Sentiment trends, performance, distribution charts

---

## 🔗 API Endpoints (Backend)

### **Authentication**
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `GET /api/users/me` — Get current user info

### **Team Management**
- `GET /api/users/team` — List manager's team
- `GET /api/users/available-employees` — List unassigned employees
- `POST /api/users/team/add` — Add employee to team
- `DELETE /api/users/team/remove/{employee_id}` — Remove employee from team
- `GET /api/users/managers` — List all managers
- `GET /api/users/all` — List all users (for peer feedback)

### **Feedback**
- `POST /api/feedback` — Create feedback (manager)
- `GET /api/feedback/employee` — List feedback received (employee)
- `GET /api/feedback/manager` — List feedback given (manager)
- `PATCH /api/feedback/{id}` — Update feedback (manager)
- `POST /api/feedback/{id}/acknowledge` — Acknowledge feedback (employee)
- `GET /api/feedback/employee/pdf` — Export feedback as PDF (employee)

### **Feedback Requests**
- `POST /api/feedback/request` — Request feedback
- `GET /api/feedback/requests/made` — List requests made (employee)
- `GET /api/feedback/requests/received` — List requests received (manager)
- `PATCH /api/feedback/request/{id}/status?status=...` — Update request status

### **Peer Feedback**
- `POST /api/feedback/peer` — Submit peer feedback
- `GET /api/feedback/peer/given` — List peer feedback given
- `GET /api/feedback/peer/received` — List peer feedback received

### **Comments**
- `GET /api/feedback/{feedback_id}/comments` — List comments for feedback
- `POST /api/feedback/{feedback_id}/comments` — Add comment to feedback

### **Notifications**
- `GET /api/feedback/notifications` — List notifications
- `POST /api/feedback/notifications/{id}/read` — Mark notification as read
- `DELETE /api/feedback/notifications/clear-all` — Clear all notifications

### **Tags & Analytics**
- `POST /api/feedback/tags` — Create tag
- `GET /api/feedback/tags` — List tags
- `POST /api/feedback/{feedback_id}/tags/{tag_id}` — Add tag to feedback
- `DELETE /api/feedback/{feedback_id}/tags/{tag_id}` — Remove tag from feedback
- `GET /api/dashboard/manager/overview` — Manager dashboard stats
- `GET /api/dashboard/manager/sentiment_trends` — Sentiment trends
- `GET /api/dashboard/manager/team-member-stats/{employee_id}` — Team member stats
- `GET /api/dashboard/employee/timeline` — Employee feedback timeline

---

## 🗄️ Database Schema (Backend)

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `hashed_password`: Hashed password
- `role`: User role (manager/employee)
- `manager_id`: Foreign key to manager (for employees)

### Feedback Table
- `id`: Primary key
- `manager_id`: Manager who gave feedback
- `employee_id`: Employee who received feedback
- `strengths`: Feedback on strengths
- `areas_to_improve`: Areas for improvement
- `sentiment`: Sentiment (positive/neutral/negative)
- `acknowledged`: Whether feedback was acknowledged
- `created_at`: Timestamp

### Feedback Comments Table
- `id`: Primary key
- `feedback_id`: Foreign key to feedback
- `user_id`: User who posted the comment
- `content`: Comment text content
- `created_at`: Timestamp

---

## 🛠️ Technologies Used

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic
- FPDF (PDF export)

### Frontend
- React (UI library)
- Vite (build tool)
- Zustand (state management)
- MUI (Material UI)
- TailwindCSS (utility CSS)
- Axios (HTTP client)
- React Router DOM (routing)
- Framer Motion (animations)
- React Hot Toast (notifications)
- React Markdown (markdown rendering)
- Recharts (charts/analytics)
- File Saver (PDF download)
- ESLint (linting)

---

## ▶️ Getting Started

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Architecture & Extensibility
- **Backend:** RESTful API, modular routes, CRUD separation, JWT auth, extensible for new features.
- **Frontend:** Zustand for state, modular components, API layer, protected routing, MUI+Tailwind for UI.
- **Real-time:** Auto-refresh, toast notifications, loading states, responsive design.

---

## 🤝 Contributing & Development
- Follow code style and structure.
- Add new features modularly (store, API, component).
- Keep API calls in `src/api/`.
- Use Zustand for global state.
- Write accessible, consistent UI.

---

## 📬 Contact
For questions or issues, open an issue or contact the maintainer.
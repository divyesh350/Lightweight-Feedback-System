# Feedback System Frontend (React + Vite)

A modern, full-featured feedback system for structured, ongoing feedback between managers and employees. Built with React, Zustand, MUI, and Vite.

---

## 🚀 Features

- **Role-based Dashboards:**
  - Employee and Manager dashboards with tailored views and actions.
- **Feedback Management:**
  - Employees can view, acknowledge, and comment on feedback received from managers.
  - Managers can create, edit, and view feedback for their team.
- **Feedback Requests:**
  - Employees can request feedback from managers or peers.
  - Managers can view and respond to feedback requests.
- **Peer Feedback:**
  - Employees can give feedback to any user (with optional anonymity).
  - View feedback given and received.
- **Comments:**
  - Users can comment on feedback entries (with markdown support).
- **PDF Export:**
  - Employees can export all received feedback as a PDF report.
- **Notifications:**
  - In-app notifications for new feedback, comments, and requests.
- **Team Management:**
  - Managers can add/remove employees from their team.
- **Modern UI:**
  - Responsive, accessible, and visually appealing design using MUI and TailwindCSS.

---

## 🖥️ Main UI Sections

- **Employee Dashboard:** Timeline of feedback, actions panel, recent requests, feedback summary.
- **Manager Dashboard:** Team overview, feedback stats, recent feedback, analytics.
- **Peer Feedback Page:** Give and view peer feedback, with user selection and anonymity.
- **Request Feedback Page:** Employees can send and track feedback requests.
- **Team Management:** Managers manage team members and assignments.
- **Notifications:** View and mark notifications as read.

---

## 🔗 API Endpoints Used

### **Auth**
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `GET /api/users/me` — Get current user info

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

### **Team & Users**
- `GET /api/users/team` — List team members (manager)
- `GET /api/users/available-employees` — List unassigned employees (manager)
- `POST /api/users/team/add` — Add employee to team
- `DELETE /api/users/team/remove/{employee_id}` — Remove employee from team
- `GET /api/users/managers` — List all managers
- `GET /api/users/all` — List all users (for peer feedback selection)

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

---

## 🛠️ Technologies & Node Modules

- **React** (UI library)
- **Vite** (build tool)
- **Zustand** (state management)
- **MUI** (Material UI components)
- **TailwindCSS** (utility-first CSS)
- **Axios** (HTTP client)
- **React Router DOM** (routing)
- **Framer Motion** (animations)
- **React Hot Toast** (notifications)
- **React Markdown** (rendering markdown in comments)
- **Recharts** (charts/analytics)
- **File Saver** (PDF download)
- **ESLint** (linting)

---

## ▶️ Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the dev server:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```
4. **Preview production build:**
   ```sh
   npm run preview
   ```

---

## 🏗️ Architecture & Extensibility

- **State Management:** All global state (auth, feedback, requests, notifications, etc.) is managed with Zustand stores in `src/store/`.
- **API Layer:** All backend calls are organized in `src/api/` modules, using Axios with an interceptor for auth tokens.
- **Component Structure:** UI is modular, with reusable components for feedback cards, lists, forms, modals, and analytics.
- **Role-based Routing:** Uses protected routes to ensure only authorized users can access certain pages.
- **Styling:** Combines MUI for structure and TailwindCSS for utility classes and custom design.

---

## 🤝 Contributing & Development

- Follow the existing code style and structure.
- Add new features in a modular way (new store, API, and component as needed).
- Keep API calls in the `src/api/` directory.
- Use Zustand for new global state.
- Write clear, accessible UI and keep UX consistent.

---

## 📬 Contact
For questions or issues, open an issue or contact the maintainer.

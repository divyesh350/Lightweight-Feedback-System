# Feedback System

A comprehensive feedback management system built with FastAPI backend and React frontend, featuring role-based access control, real-time dashboards, team management capabilities, interactive comments, and advanced analytics.

## Features

### Authentication & Authorization
- Role-based login (Manager/Employee)
- JWT token authentication
- Protected routes based on user roles
- Automatic logout on unauthorized access

### Manager Features
- **Dashboard**: Real-time overview with feedback statistics and sentiment trends
- **Team Management**: Add/remove team members, view team structure
- **Feedback Management**: Send feedback to team members, view feedback history
- **Team Members Page**: Comprehensive view of direct reports with:
  - Individual feedback statistics
  - Progress badges based on performance
  - Grid and list view modes
  - Detailed member profiles with feedback history
  - Real-time data integration
- **Comments**: View comments on feedback (read-only)
- **Analytics Dashboard**: Advanced analytics with deep insights:
  - Sentiment trends over time with line charts
  - Employee performance comparison with bar charts
  - Feedback distribution by sentiment, employee, and month
  - Interactive filters for time range, employee, and chart type
  - Key insights and metrics (avg. feedback/month, acknowledgment rates)
  - Real-time data visualization

### Employee Features
- View received feedback
- Request feedback from managers
- Send peer feedback
- Export feedback to PDF
- **Comments**: Add comments to feedback and view existing comments
- Acknowledge feedback

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/me` - Get current user info

### Team Management
- `GET /api/users/team` - Get manager's team members
- `GET /api/users/available` - Get available employees for team
- `POST /api/users/team/add` - Add member to team
- `DELETE /api/users/team/remove/{user_id}` - Remove member from team

### Feedback
- `POST /api/feedback/` - Create new feedback
- `GET /api/feedback/manager` - Get manager's feedback (includes employee details)
- `GET /api/feedback/employee` - Get employee's received feedback
- `PATCH /api/feedback/{feedback_id}/acknowledge` - Acknowledge feedback

### Comments
- `GET /api/feedback/{feedback_id}/comments` - Get comments for a specific feedback
- `POST /api/feedback/{feedback_id}/comments` - Add a comment to feedback

### Dashboard
- `GET /api/dashboard/manager/overview` - Manager dashboard overview
- `GET /api/dashboard/manager/sentiment_trends` - Sentiment trends over time
- `GET /api/dashboard/manager/team-member-stats/{employee_id}` - Individual team member statistics
- `GET /api/dashboard/employee/timeline` - Employee feedback timeline

### Feedback Requests
- `POST /api/feedback/request` - Request feedback
- `GET /api/feedback/requests/received` - Get received feedback requests
- `PATCH /api/feedback/request/{request_id}/status` - Update request status

## Frontend Routes

### Manager Routes
- `/dashboard/manager` - Manager dashboard
- `/manager/feedback` - Feedback management page with comments (read-only)
- `/team` - Team members page with detailed member profiles
- `/analytics` - Advanced analytics dashboard with charts and insights

### Employee Routes
- `/dashboard/employee` - Employee dashboard
- `/feedback` - View received feedback with ability to add comments
- `/feedback/requests` - Request feedback
- `/peer-feedback` - Send peer feedback

## Analytics Dashboard Features

The Analytics page (`/analytics`) provides managers with comprehensive data visualization and insights:

### Interactive Filters
- **Time Range**: Filter data by 1 month, 3 months, 6 months, or 1 year
- **Employee Filter**: View data for specific employees or all team members
- **Chart Type**: Switch between sentiment, employee, and monthly distribution views

### Key Insights Cards
- **Total Feedback**: All-time feedback count with trend indicators
- **This Month**: Current month feedback count
- **Avg. per Month**: Average monthly feedback rate
- **Positive Rate**: Percentage of positive feedback
- **Acknowledgment Rate**: Percentage of acknowledged feedback
- **Team Size**: Total number of team members

### Chart Visualizations
- **Sentiment Trends Chart**: Line chart showing sentiment distribution over time
  - Positive, neutral, and negative sentiment trends
  - Interactive time range selection
  - Trend indicators and percentage changes
- **Employee Performance Chart**: Bar charts showing individual performance metrics
  - Feedback count, positive rate, and acknowledgment rate per employee
  - Performance comparison across team members
  - Individual employee filtering
- **Feedback Distribution Chart**: Multiple chart types based on selection
  - **By Sentiment**: Pie chart showing positive/neutral/negative distribution
  - **By Employee**: Pie chart showing feedback distribution across team members
  - **By Month**: Bar chart showing monthly feedback trends

### Real-time Features
- Auto-refresh functionality
- Loading states and skeleton loaders
- Error handling with toast notifications
- Responsive design for all screen sizes

## Comments System

The feedback system includes an interactive comments feature:

### For Managers
- **View Comments**: Managers can view all comments on feedback they've given
- **Read-Only**: Managers cannot add comments to employee feedback
- **Comment Display**: Shows comment count and expandable comment section

### For Employees
- **Add Comments**: Employees can add comments to feedback they've received
- **View Comments**: Employees can view all comments on their feedback
- **Real-time Updates**: Comments are immediately visible after posting

### Comment Features
- **Expandable Interface**: Click "Show/Hide Comments" to toggle comment section
- **User Avatars**: Display user initials in colored circles
- **Timestamps**: Show when comments were posted
- **Loading States**: Skeleton loaders while fetching comments
- **Empty States**: Helpful messages when no comments exist
- **Form Validation**: Prevent empty comments from being submitted

## Team Members Page Features

The Team Members page (`/team`) provides managers with a comprehensive view of their direct reports:

### Overview Statistics
- Total team members count
- Active members count
- Total feedback given
- Team satisfaction percentage

### Member Cards
- **Grid View**: Compact cards showing member info, feedback count, satisfaction, and progress badge
- **List View**: Detailed rows with member info, role, feedback count, and progress status
- **Progress Badges**: Color-coded performance indicators:
  - Green: Excellent (5+ feedback, 80%+ positive)
  - Blue: Good (3+ feedback, 60%+ positive)
  - Yellow: Average (1+ feedback, 40%+ positive)
  - Red: Needs Improvement (low positive percentage)
  - Gray: No Feedback (no feedback given yet)

### Member Profiles
Clicking on any member card opens a detailed modal with:
- **Overview Tab**: Member info, feedback statistics, acknowledgment rates
- **Feedback History Tab**: Complete feedback history with sentiment analysis

### Real-time Data
- Automatic refresh of team data
- Real-time feedback statistics
- Live progress badge updates based on recent feedback

## Installation & Setup

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
npm start
```

## Database Schema

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password_hash`: Hashed password
- `role`: User role (manager/employee)
- `manager_id`: Foreign key to manager (for employees)

### Feedback Table
- `id`: Primary key
- `manager_id`: Manager who gave feedback
- `employee_id`: Employee who received feedback
- `strengths`: Feedback on strengths
- `areas_to_improve`: Areas for improvement
- `sentiment`: Sentiment classification (positive/neutral/negative)
- `acknowledged`: Whether feedback was acknowledged
- `created_at`: Timestamp

### Feedback Comments Table
- `id`: Primary key
- `feedback_id`: Foreign key to feedback
- `user_id`: User who posted the comment
- `content`: Comment text content
- `created_at`: Timestamp

## Technologies Used

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic for data validation

### Frontend
- React 18
- React Router
- Zustand for state management
- Tailwind CSS
- Framer Motion for animations
- Material-UI components
- Axios for API calls

## Development

The system is designed with a modular architecture:
- **Backend**: RESTful API with clear separation of concerns
- **Frontend**: Component-based architecture with reusable UI components
- **State Management**: Centralized stores for different features
- **Real-time Updates**: Auto-refresh functionality for dashboard data
- **Comments System**: Interactive commenting with role-based permissions
- **Analytics**: Advanced data visualization with interactive charts and filters
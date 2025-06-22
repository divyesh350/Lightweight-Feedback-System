# Feedback System Backend

A lightweight feedback system for structured, ongoing feedback between managers and employees.

---

## 📁 Project Structure

```
backend/
│
├── app/
│   ├── api/
│   │   ├── deps.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── feedback.py
│   │   │   ├── dashboard.py
│   │   │   └── __init__.py
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── __init__.py
│   ├── crud/
│   │   ├── crud_user.py
│   │   ├── crud_feedback.py
│   │   └── __init__.py
│   ├── db/
│   │   ├── base.py
│   │   ├── session.py
│   │   ├── init_db.py
│   │   └── alembic/
│   ├── models/
│   │   ├── user.py
│   │   ├── feedback.py
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── feedback.py
│   │   ├── token.py
│   │   └── __init__.py
│   ├── main.py
│   └── __init__.py
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env
└── README.md
```

---

## ⚙️ .env Variables

```
DATABASE_URL=postgresql+psycopg2://<user>:<password>@<host>:<port>/<db>?sslmode=require
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
# (Optional for email notifications)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
```

---

## 🗄️ Database Models

### User
| Field           | Type    | Description                        |
|-----------------|---------|------------------------------------|
| id              | int     | Primary key                        |
| name            | string  | User's name                        |
| email           | string  | Unique, used for login             |
| hashed_password | string  | Hashed password                    |
| role            | enum    | 'manager' or 'employee'            |
| manager_id      | int     | FK to users.id (nullable, employee only) |

### Feedback
| Field             | Type    | Description                        |
|-------------------|---------|------------------------------------|
| id                | int     | Primary key                        |
| manager_id        | int     | FK to users.id (manager)           |
| employee_id       | int     | FK to users.id (employee)          |
| strengths         | string  | Feedback strengths                 |
| areas_to_improve  | string  | Feedback improvement areas         |
| sentiment         | enum    | 'positive', 'neutral', 'negative'  |
| created_at        | datetime| Created timestamp                  |
| updated_at        | datetime| Updated timestamp                  |
| acknowledged      | bool    | Employee has acknowledged?         |

### Feedback Request (Bonus)
| Field        | Type   | Description                       |
|--------------|--------|-----------------------------------|
| id           | int    | Primary key                       |
| requester_id | int    | User who requested feedback       |
| target_id    | int    | User from whom feedback is requested |
| message      | string | Optional message                  |
| status       | enum   | "pending", "completed", "rejected" |
| created_at   | datetime | Created timestamp                |
| updated_at   | datetime | Updated timestamp                |

### Peer Feedback (Bonus)
| Field           | Type    | Description                        |
|-----------------|---------|------------------------------------|
| id              | int     | Primary key                        |
| from_user_id    | int     | User giving feedback               |
| to_user_id      | int     | User receiving feedback            |
| strengths       | string  | Feedback strengths                 |
| areas_to_improve| string  | Feedback improvement areas         |
| sentiment       | enum    | 'positive', 'neutral', 'negative'  |
| is_anonymous    | bool    | If true, hides from_user_id        |
| created_at      | datetime| Created timestamp                  |
| updated_at      | datetime| Updated timestamp                  |

### Feedback Comments (Bonus)
| Field        | Type   | Description                       |
|--------------|--------|-----------------------------------|
| id           | int    | Primary key                       |
| feedback_id  | int    | Feedback this comment belongs to  |
| user_id      | int    | User who wrote the comment        |
| content      | string | Markdown content                  |
| created_at   | datetime | Created timestamp                |

### Tags (Bonus)
| Field        | Type   | Description                       |
|--------------|--------|-----------------------------------|
| id           | int    | Primary key                       |
| name         | string | Tag name (unique)                 |

### Notifications (Bonus)
| Field        | Type   | Description                       |
|--------------|--------|-----------------------------------|
| id           | int    | Primary key                       |
| user_id      | int    | User who receives the notification|
| message      | string | Notification message              |
| type         | string | 'feedback', 'request', 'comment'  |
| read         | bool   | Has the user read it?             |
| created_at   | datetime | Created timestamp                |

### PDF Export (Bonus)
- **GET /api/feedback/employee/pdf**
  - (Employee) Download a PDF report of all feedback received
  - Returns a PDF file with all feedback entries (date, strengths, areas to improve, sentiment, acknowledgment)
  - Example: Download and open the file in any PDF viewer

---

## 📝 API Endpoints

### Auth
- **POST /api/auth/register**
  - Register a new user
  - Body:
    ```json
    {
      "name": "Alice Manager",
      "email": "alice.manager@example.com",
      "password": "password123",
      "role": "manager",
      "manager_id": null
    }
    ```
- **POST /api/auth/login**
  - Login (form data, not JSON)
  - Body (x-www-form-urlencoded):
    - username: alice.manager@example.com
    - password: password123
  - Response:
    ```json
    { 
      "access_token": "...", 
      "token_type": "bearer",
      "role": "manager"
    }
    ```

### Users
- **GET /api/users/me**
  - Get current user info (Bearer token required)
- **GET /api/users/team**
  - (Manager only) List direct reports
- **GET /api/users/available-employees**
  - (Manager only) List employees not assigned to any manager
- **POST /api/users/team/add**
  - (Manager only) Add an employee to the current manager's team
  - Body:
    ```json
    {
      "employee_id": 2
    }
    ```
- **DELETE /api/users/team/remove/{employee_id}**
  - (Manager only) Remove an employee from the current manager's team

### Feedback
- **POST /api/feedback/**
  - (Manager only) Submit feedback for an employee
  - Body:
    ```json
    {
      "employee_id": 2,
      "strengths": "Great teamwork",
      "areas_to_improve": "Time management",
      "sentiment": "positive"
    }
    ```
- **GET /api/feedback/employee**
  - (Employee only) List feedback received
- **GET /api/feedback/manager**
  - (Manager only) List feedback given to team
  - Response:
    ```json
    [
      {
        "strengths": "Great teamwork",
        "areas_to_improve": "Time management", 
        "sentiment": "positive",
        "id": 4,
        "manager_id": 3,
        "employee_id": 4,
        "created_at": "2025-06-22T06:45:46.236438",
        "updated_at": "2025-06-22T06:45:46.236438",
        "acknowledged": false,
        "tags": [],
        "employee_name": "divyesh",
        "employee_email": "divyesh.employee@gmail.com"
      }
    ]
    ```
- **PATCH /api/feedback/{feedback_id}**
  - (Manager only) Update feedback
- **POST /api/feedback/{feedback_id}/acknowledge**
  - (Employee only) Acknowledge feedback

### Feedback Request (Bonus)
- **POST /api/feedback/request**
  - (Employee) Request feedback from a manager or peer
  - Body:
    ```json
    {
      "target_id": 2,
      "message": "Could you give me feedback on my last project?"
    }
    ```
- **GET /api/feedback/requests/made**
  - (Employee) List feedback requests made by the current user
- **GET /api/feedback/requests/received**
  - (Manager) List feedback requests received by the current user
- **PATCH /api/feedback/request/{request_id}/status?status=completed**
  - (Manager) Update the status of a feedback request (e.g., approve/complete/reject)
  - Query param: `status` ("pending", "completed", "rejected")

### Peer Feedback (Bonus)
- **POST /api/feedback/peer**
  - (Employee) Submit peer feedback (optionally anonymous)
  - Body:
    ```json
    {
      "to_user_id": 2,
      "strengths": "Great collaborator",
      "areas_to_improve": "Be more proactive in meetings",
    }
    ```
- **GET /api/feedback/peer/given**
  - (Employee) List peer feedback given by the current user
- **GET /api/feedback/peer/received**
  - (Employee) List peer feedback received by the current user (if anonymous, `from_user_id` is hidden)

### Dashboard
- **GET /api/dashboard/manager/overview**
  - (Manager only) Feedback count per team member
- **GET /api/dashboard/manager/sentiment_trends**
  - (Manager only) Sentiment trends per month
- **GET /api/dashboard/employee/timeline**
  - (Employee only) Timeline of feedback received

### Feedback Comments (Bonus)
- **POST /api/feedback/{feedback_id}/comments**
  - Add a comment to a feedback (markdown supported)
  - Body:
    ```json
    {
      "content": "Great feedback! **Thank you!**"
    }
    ```
- **GET /api/feedback/{feedback_id}/comments**
  - List all comments for a feedback
  - Response:
    ```json
    [
      {
        "id": 1,
        "feedback_id": 2,
        "user_id": 3,
        "content": "Great feedback! **Thank you!**",
        "created_at": "2024-06-20T12:00:00Z"
      }
    ]
    ```

### Tags (Bonus)
- **POST /api/feedback/tags**
  - (Manager) Create a new tag
  - Body:
    ```json
    { "name": "leadership" }
    ```
- **GET /api/feedback/tags**
  - List all tags
- **POST /api/feedback/{feedback_id}/tags/{tag_id}**
  - (Manager) Add a tag to feedback
- **DELETE /api/feedback/{feedback_id}/tags/{tag_id}**
  - (Manager) Remove a tag from feedback
- **FeedbackRead** now includes a `tags` field (list of tags for each feedback)

### Notifications (Bonus)
- **GET /api/feedback/notifications**
  - List all notifications for the current user
- **POST /api/feedback/notifications/{notification_id}/read**
  - Mark a notification as read

#### Email Notifications
- When feedback is created, the employee receives an email (using SMTP settings in `.env`).
- You can extend this to send emails for feedback requests and comments as well.

---

## 🧑‍💻 Example Usage

### Register a Manager
```json
{
  "name": "Alice Manager",
  "email": "alice.manager@example.com",
  "password": "password123",
  "role": "manager",
  "manager_id": null
}
```

### Register an Employee
```json
{
  "name": "Bob Employee",
  "email": "bob.employee@example.com",
  "password": "password123",
  "role": "employee",
  "manager_id": 1
}
```

### Login (curl)
```sh
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice.manager@example.com&password=password123"
```

### Create Feedback (as Manager)
```json
{
  "employee_id": 2,
  "strengths": "Great teamwork",
  "areas_to_improve": "Time management",
  "sentiment": "positive"
}
```

### Team Management (as Manager)
```sh
# Get team members
curl -X GET "http://localhost:8000/api/users/team" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get available employees
curl -X GET "http://localhost:8000/api/users/available-employees" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add employee to team
curl -X POST "http://localhost:8000/api/users/team/add" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"employee_id": 3}'

# Remove employee from team
curl -X DELETE "http://localhost:8000/api/users/team/remove/3" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🛠️ Tech Stack
- FastAPI
- SQLAlchemy
- PostgreSQL (cloud/local)
- Alembic (for migrations)
- Docker (optional, for local dev)

---

## 🚀 Quick Start
1. Set up your `.env` file with your database and secret key.
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Run the server:
   ```sh
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
4. Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API docs.

---

## 📬 Contact
For questions or issues, open an issue or contact the maintainer.

## ✨ Features

### Core Functionality
- **Role-Based Access Control**: Separate roles for **Manager** and **Employee** with distinct permissions.
- **Secure Authentication**: JWT-based login system to protect endpoints.
- **Structured Feedback**: Managers can submit feedback with `strengths`, `areas to improve`, and `sentiment`.
- **Feedback History**: A complete history of feedback is available to both managers and employees.
- **Manager Dashboard**: Overview of team feedback count and sentiment trends over time.
- **Employee Timeline**: A chronological timeline of all feedback received.
- **Team Management**: Managers can add/remove employees from their team and view available employees.

### Bonus Features
- **Feedback Requests**: Employees can proactively request feedback from their manager or peers.
- **Peer Feedback**: Employees can give feedback to each other, with an option for anonymity.
- **Feedback Comments**: Users can leave comments on feedback entries (with full markdown support).
- **Tagging System**: Managers can add customizable tags (e.g., "communication", "leadership") to feedback for better organization.
- **Notifications**: In-app and email notifications for key events like new feedback or comments.
- **PDF Export**: Employees can export their entire feedback history as a downloadable PDF report. 
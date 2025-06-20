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
    { "access_token": "...", "token_type": "bearer" }
    ```

### Users
- **GET /api/users/me**
  - Get current user info (Bearer token required)
- **GET /api/users/team**
  - (Manager only) List direct reports

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
- **PATCH /api/feedback/{feedback_id}**
  - (Manager only) Update feedback
- **POST /api/feedback/{feedback_id}/acknowledge**
  - (Employee only) Acknowledge feedback

### Dashboard
- **GET /api/dashboard/manager/overview**
  - (Manager only) Feedback count per team member
- **GET /api/dashboard/manager/sentiment_trends**
  - (Manager only) Sentiment trends per month
- **GET /api/dashboard/employee/timeline**
  - (Employee only) Timeline of feedback received

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
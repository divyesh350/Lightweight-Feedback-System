from fastapi import FastAPI
from .api.routes import auth, users, feedback, dashboard
from .models import user, feedback as feedback_model
from .db.base import Base
from .db.session import engine

# Create all tables (for dev/demo; use Alembic in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Feedback System API")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(feedback.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Feedback System API"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette_proxy_headers.middleware import ProxyHeadersMiddleware
from .api.routes import auth, users, feedback, dashboard
from .models import user, feedback as feedback_model
from .db.base import Base
from .db.session import engine

# Create all tables (for dev/demo; use Alembic in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Feedback System API")

# Add ProxyHeadersMiddleware to trust X-Forwarded-Proto and similar headers
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "https://lightweight-feedback-system-kappa.vercel.app",  # React dev server (if using)
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(feedback.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Feedback System API"}

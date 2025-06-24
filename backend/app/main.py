from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import auth, users, feedback, dashboard
from .models import user, feedback as feedback_model
from .db.base import Base
from .db.session import engine

# Create all tables (for dev/demo; use Alembic in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Feedback System API")

class CustomProxyHeadersMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers = dict(scope["headers"])
            x_forwarded_proto = headers.get(b"x-forwarded-proto")
            if x_forwarded_proto:
                scope["scheme"] = x_forwarded_proto.decode()
        await self.app(scope, receive, send)

# Add the custom proxy headers middleware
app.add_middleware(CustomProxyHeadersMiddleware)

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

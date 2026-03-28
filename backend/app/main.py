from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine
from app.models.models import Base
from app.routers import transactions

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="VoiceTrace API")

# CORS — allows the React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(transactions.router)

@app.get("/")
def root():
    return {"status": "VoiceTrace API is running"}
"""CareCopilot API — FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from seed import seed_database
from routers import auth, chat, intake, analytics, documents, appointments

logger = logging.getLogger("carecopilot")
logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables and seed demo data."""
    logger.info("Starting CareCopilot API...")
    await seed_database()
    logger.info("CareCopilot API ready!")
    yield
    logger.info("Shutting down CareCopilot API...")


app = FastAPI(
    title="CareCopilot API",
    description="AI-Powered Healthcare Intelligence Platform — Clinical Q&A, Analytics, and Workflow Automation",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(intake.router)
app.include_router(analytics.router)
app.include_router(documents.router)
app.include_router(appointments.router)


@app.get("/")
async def root():
    return {
        "name": "CareCopilot API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "llm_configured": settings.llm_available,
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}

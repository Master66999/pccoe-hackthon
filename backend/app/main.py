import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

# Set up logging
logger = structlog.get_logger()

from contextlib import asynccontextmanager
from app.database import init_db
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    title="ReLife AI API",
    description="Backend API for Laptop Health Assessment & Circular Economy Platform",
    version="1.0.0",
    lifespan=lifespan,
)

from app.api import auth, scans

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(scans.router, prefix=f"{settings.API_V1_STR}/scans", tags=["Scans"])

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For Electron local dev environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    logger.info(
        "request_processed",
        path=request.url.path,
        method=request.method,
        duration_ms=int(process_time * 1000),
        status_code=response.status_code,
    )
    return response

@app.get("/api/v1/health-check")
def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "service": "relife-ai-backend"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

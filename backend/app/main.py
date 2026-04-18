from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.routers import auth, properties, images, admin, inquiries

app = FastAPI(
    title="FreshBooking API",
    description="Real Estate Platform API",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(properties.router)
app.include_router(images.router)
app.include_router(admin.router)
app.include_router(inquiries.router)


@app.get("/")
def root():
    return {"message": "FreshBooking API is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}

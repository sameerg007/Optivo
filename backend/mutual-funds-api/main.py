"""
Optivo Mutual Funds API
FastAPI application for fetching Indian mutual fund data
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import API_TITLE, API_VERSION, API_DESCRIPTION, CORS_ORIGINS
from app.routes import funds_router

# Create FastAPI app
app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=API_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(funds_router)


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": API_TITLE,
        "version": API_VERSION,
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "funds": "/api/mutual-funds/",
            "search": "/api/mutual-funds/search?q=",
            "categories": "/api/mutual-funds/categories",
            "fund_detail": "/api/mutual-funds/{symbol}",
            "fund_nav": "/api/mutual-funds/{symbol}/nav",
            "fund_history": "/api/mutual-funds/{symbol}/history",
            "portfolio": "/api/mutual-funds/portfolio/calculate"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    from app.config import HOST, PORT
    
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)

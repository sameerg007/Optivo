"""
Configuration settings for the Mutual Funds API
"""
import os
from dotenv import load_dotenv

load_dotenv()

# API Settings
API_TITLE = "Optivo Mutual Funds API"
API_VERSION = "1.0.0"
API_DESCRIPTION = "API for fetching Indian mutual fund data using Yahoo Finance"

# CORS Settings
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

# Cache Settings (in seconds)
CACHE_TTL = int(os.getenv("CACHE_TTL", "300"))  # 5 minutes default

# Server Settings
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

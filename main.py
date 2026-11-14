"""
Root entry point for FIRE-X Platform API
Runs the backend.main application
"""
import os
import uvicorn
from backend.main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    is_cloud = bool(os.environ.get("RENDER") or os.environ.get("VERCEL"))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=not is_cloud)

#!/usr/bin/env python3
"""
Globe Trotter Backend Runner
Run this file to start the FastAPI server
"""

import uvicorn
from decouple import config

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(config("PORT", default="8000")),
        reload=config("ENVIRONMENT", default="development") == "development"
    )
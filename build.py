#!/usr/bin/env python3
"""
Full-stack build script: Builds the React frontend and copies it into backend/app/static.
Enables FastAPI to serve both API endpoints and the React SPA under a single unified web server.
"""

import os
import shutil
import subprocess
import sys

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
FRONTEND_DIST = os.path.join(FRONTEND_DIR, "dist")
STATIC_TARGET = os.path.join(ROOT_DIR, "backend", "app", "static")

def main():
    print("=" * 60)
    print("Building Civic Infrastructure Memory Combined Full-Stack App")
    print("=" * 60)

    # 1. Build frontend
    print("\n[1/3] Building React Frontend with Vite...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    subprocess.run([npm_cmd, "run", "build"], cwd=FRONTEND_DIR, check=True)

    # 2. Ensure target static directory exists
    print(f"\n[2/3] Copying production assets from {FRONTEND_DIST} to {STATIC_TARGET}...")
    os.makedirs(STATIC_TARGET, exist_ok=True)
    
    # Copy files
    for item in os.listdir(FRONTEND_DIST):
        s = os.path.join(FRONTEND_DIST, item)
        d = os.path.join(STATIC_TARGET, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, dirs_exist_ok=True)
        else:
            shutil.copy2(s, d)

    print(f"\n[3/3] Successfully unified Frontend + Backend into {STATIC_TARGET}!")
    print("\nYou can now run the complete unified application with:")
    print("  cd backend")
    print("  uvicorn app.main:app --host 0.0.0.0 --port 8000")
    print("=" * 60)

if __name__ == "__main__":
    main()

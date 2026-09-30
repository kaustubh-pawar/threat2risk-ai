#!/usr/bin/env python3
"""
 Threat2Risk AI Engine — Unified Application Runner
 --------------------------------------------------
 Starts both the FastAPI Backend (Port 8000) and Next.js Frontend (Port 4000)
 with a single command:
 
     python threat2risk-ai.py [--open]
"""

import os
import sys
import time
import signal
import subprocess
import webbrowser
from pathlib import Path

# Paths
ROOT_DIR = Path(__file__).parent.resolve()
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

# Determine Python Executable
VENV_PYTHON_MAC = BACKEND_DIR / "venv" / "bin" / "python"
VENV_PYTHON_WIN = BACKEND_DIR / "venv" / "Scripts" / "python.exe"

if VENV_PYTHON_MAC.exists():
    PYTHON_EXE = str(VENV_PYTHON_MAC)
elif VENV_PYTHON_WIN.exists():
    PYTHON_EXE = str(VENV_PYTHON_WIN)
else:
    PYTHON_EXE = sys.executable

processes = []

def print_banner():
    banner = """
  ████████╗██╗  ██╗██████╗ ███████╗█████╗ ████████╗██████╗ ██████╗ ██╗███████╗██╗  ██╗   █████╗ ██╗
  ╚══██╔══╝██║  ██║██╔══██╗██╔════╝██╔══██╗╚══██╔══╝╚════██╗██╔══██╗██║██╔════╝██║ ██╔╝  ██╔══██╗██║
     ██║   ███████║██████╔╝█████╗  ███████║   ██║    █████╔╝██████╔╝██║███████╗█████═╝   ███████║██║
     ██║   ██╔══██║██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔═══╝ ██╔══██╗██║╚════██║██  ██╗   ██╔══██║██║
     ██║   ██║  ██║██║  ██║███████╗██║  ██║   ██║   ███████╗██║  ██║██║███████║██║ ╚██╗  ██║  ██║██║
     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝  ╚═╝  ╚═╝╚═╝
  ===================================================================================================
                               SECURE COMMAND CENTER & AI RISK ENGINE
  ===================================================================================================
    """
    print(banner)

def cleanup(sig=None, frame=None):
    print("\n\n[!] Shutting down Threat2Risk AI Engine services...")
    for p in processes:
        if p.poll() is None:
            try:
                p.terminate()
                p.wait(timeout=3)
            except Exception:
                p.kill()
    print("[✓] All services stopped cleanly. Goodbye!\n")
    sys.exit(0)

def main():
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)

    print_banner()

    # 1. Start FastAPI Backend
    print("[1/2] Launching FastAPI Backend Server on port 8000...")
    backend_cmd = [
        PYTHON_EXE,
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8000",
        "--reload"
    ]
    
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=str(BACKEND_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    processes.append(backend_proc)

    # 2. Start Next.js Frontend
    print("[2/2] Launching Next.js Frontend Server on port 4000...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_cmd = [npm_cmd, "run", "dev"]

    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=str(FRONTEND_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    processes.append(frontend_proc)

    time.sleep(2)

    print("\n" + "=" * 70)
    print(" 🚀 THREAT2RISK AI IS NOW RUNNING!")
    print("=" * 70)
    print("  ► SOC Command Center Frontend: http://localhost:4000")
    print("  ► FastAPI AI Backend Engine:   http://localhost:8000")
    print("  ► API Interactive OpenAPI Docs: http://localhost:8000/docs")
    print("=" * 70)
    print("  [Press Ctrl+C at any time to stop all services]\n")

    # Optional auto-open browser
    if "--open" in sys.argv:
        time.sleep(1)
        webbrowser.open("http://localhost:4000")

    # Keep script alive & stream outputs
    try:
        while True:
            # Monitor backend
            b_line = backend_proc.stdout.readline()
            if b_line:
                print(f"[BACKEND]  {b_line.strip()}")
            
            # Monitor frontend
            f_line = frontend_proc.stdout.readline()
            if f_line:
                print(f"[FRONTEND] {f_line.strip()}")

            if backend_proc.poll() is not None and frontend_proc.poll() is not None:
                break
    except KeyboardInterrupt:
        cleanup()

if __name__ == "__main__":
    main()

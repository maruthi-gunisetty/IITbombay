import subprocess
import time
import re
import sys
import os
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT, "frontend")

def is_port_open(port):
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.settimeout(1.0)
        s.connect(("127.0.0.1", port))
        s.close()
        return True
    except:
        return False

def start_backend():
    if not is_port_open(8000):
        print("[SUPERVISOR] Starting FastAPI Backend on port 8000...")
        return subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"],
            cwd=ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    return None

def start_frontend():
    if not is_port_open(5173):
        print("[SUPERVISOR] Starting Vite Frontend on port 5173...")
        npx_cmd = "npx.cmd" if sys.platform == "win32" else "npx"
        return subprocess.Popen(
            [npx_cmd, "vite", "--host", "0.0.0.0", "--port", "5173"],
            cwd=FRONTEND_DIR,
            shell=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    return None

def run_tunnel():
    print("[SUPERVISOR] Starting localhost.run tunnel...")
    while True:
        try:
            # Wait for frontend to be up before initiating tunnel
            while not is_port_open(5173):
                time.sleep(1)
            
            proc = subprocess.Popen(
                ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=15", "-R", "80:127.0.0.1:5173", "nokey@localhost.run"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1
            )
            for line in iter(proc.stdout.readline, ""):
                print(line, end="")
                sys.stdout.flush()
                match = re.search(r"https://[a-zA-Z0-9.-]+\.lhr\.life", line)
                if match:
                    url = match.group(0).strip()
                    print(f"\n>>> ACTIVE PUBLIC TUNNEL URL: {url} <<<\n")
                    with open(os.path.join(ROOT, "tunnel_url.txt"), "w") as f:
                        f.write(url)
            proc.wait()
        except Exception as err:
            print("[SUPERVISOR] Tunnel exception:", err)
        time.sleep(2)

def supervisor():
    print("[SUPERVISOR] Initializing Gruha Anwesh & Cashflow AI Full-Stack Platform...")
    backend_proc = start_backend()
    frontend_proc = start_frontend()

    # Wait for services to respond
    for _ in range(20):
        if is_port_open(5173) and is_port_open(8000):
            break
        time.sleep(0.5)

    print(f"[SUPERVISOR] Backend Port 8000 status: {'UP' if is_port_open(8000) else 'STARTING'}")
    print(f"[SUPERVISOR] Frontend Port 5173 status: {'UP' if is_port_open(5173) else 'STARTING'}")

    # Launch tunnel loop (blocking in main thread)
    run_tunnel()

if __name__ == "__main__":
    supervisor()

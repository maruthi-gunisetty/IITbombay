import subprocess
import time
import re
import sys
import os
import threading
import datetime
import socket
import urllib.request
import psutil

ROOT = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(ROOT, "frontend")
LOCK_PORT = 29999

# Global socket to prevent duplicate supervisor instances
_lock_socket = None

def acquire_singleton_lock():
    global _lock_socket
    try:
        _lock_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        _lock_socket.bind(("127.0.0.1", LOCK_PORT))
        _lock_socket.listen(1)
        return True
    except OSError:
        return False

def is_port_open(port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.settimeout(1.0)
        s.connect(("127.0.0.1", port))
        s.close()
        return True
    except:
        return False

def drain_stream(stream):
    """Continuously drains stream to prevent OS pipe buffer deadlock."""
    try:
        for _ in iter(stream.readline, ""):
            pass
    except Exception:
        pass

def cleanup_stale_ssh():
    for p in psutil.process_iter(['pid', 'name']):
        try:
            if (p.info['name'] or '').lower() in ['ssh.exe', 'ssh']:
                p.kill()
        except Exception:
            pass

def monitor_services():
    """Continuously ensures backend and frontend are running."""
    while True:
        try:
            # 1. Check & Ensure Backend on Port 8000
            if not is_port_open(8000):
                print(f"[{datetime.datetime.now()}] [SUPERVISOR] Starting FastAPI Backend...", flush=True)
                subprocess.Popen(
                    [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"],
                    cwd=ROOT,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
                time.sleep(2)

            # 2. Check & Ensure Frontend on Port 5173
            if not is_port_open(5173):
                print(f"[{datetime.datetime.now()}] [SUPERVISOR] Starting Vite Frontend...", flush=True)
                npx_cmd = "npx.cmd" if sys.platform == "win32" else "npx"
                subprocess.Popen(
                    [npx_cmd, "vite", "--host", "0.0.0.0", "--port", "5173"],
                    cwd=FRONTEND_DIR,
                    shell=True,
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL
                )
                time.sleep(2)

        except Exception as e:
            print("[SUPERVISOR] Service monitor error:", e, flush=True)

        time.sleep(3)

def run_tunnel():
    """Maintains persistent single-session TLS tunnel via localhost.run."""
    while True:
        cleanup_stale_ssh()
        time.sleep(1)

        # Ensure frontend is listening before opening tunnel
        while not is_port_open(5173):
            time.sleep(1)

        print(f"[{datetime.datetime.now()}] [SUPERVISOR] Connecting tunnel via localhost.run...", flush=True)
        proc = None
        current_url = None
        try:
            DETACHED_FLAGS = 0x00000008 | 0x00000200 if sys.platform == "win32" else 0
            proc = subprocess.Popen(
                ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=20", "-R", "80:127.0.0.1:5173", "nokey@localhost.run"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                creationflags=DETACHED_FLAGS
            )
            
            for line in iter(proc.stdout.readline, ""):
                m = re.search(r"https://[a-zA-Z0-9.-]+\.lhr\.life", line)
                if m:
                    current_url = m.group(0).strip()
                    print(f"[{datetime.datetime.now()}] [TUNNEL_ACTIVE] {current_url}", flush=True)
                    with open(os.path.join(ROOT, "tunnel_url.txt"), "w") as f:
                        f.write(current_url)
                    with open(os.path.join(ROOT, "platform_status.txt"), "w") as f:
                        f.write(f"STATUS=ONLINE\nURL={current_url}\nTIMESTAMP={datetime.datetime.now()}\n")
                    break

            if current_url:
                # Start drain thread so ssh pipe never blocks
                drainer = threading.Thread(target=drain_stream, args=(proc.stdout,), daemon=True)
                drainer.start()

                # Wait 2 seconds for DNS / TLS propagation
                time.sleep(2)
                consecutive_fails = 0
                while proc.poll() is None:
                    time.sleep(12)
                    try:
                        req = urllib.request.Request(current_url, headers={'User-Agent': 'Mozilla/5.0'})
                        with urllib.request.urlopen(req, timeout=8) as resp:
                            if resp.status == 200:
                                consecutive_fails = 0
                            else:
                                consecutive_fails += 1
                    except Exception:
                        consecutive_fails += 1

                    if consecutive_fails >= 3:
                        print(f"[{datetime.datetime.now()}] [SUPERVISOR] Tunnel health check failed 3 times. Reconnecting...", flush=True)
                        break

            if proc and proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=3)
                except Exception:
                    proc.kill()

        except Exception as err:
            print("[SUPERVISOR] Tunnel error:", err, flush=True)
            if proc and proc.poll() is None:
                try:
                    proc.kill()
                except Exception:
                    pass

        time.sleep(2)

def main():
    if not acquire_singleton_lock():
        print(f"[{datetime.datetime.now()}] [SUPERVISOR] Another supervisor instance is already running on port {LOCK_PORT}. Exiting.", flush=True)
        sys.exit(0)

    print(f"[{datetime.datetime.now()}] [SUPERVISOR] Starting resilient self-healing supervisor...", flush=True)
    # Start service monitor in background thread
    t = threading.Thread(target=monitor_services, daemon=True)
    t.start()

    time.sleep(2)
    # Run tunnel in main thread (blocking with auto-reconnect)
    run_tunnel()

if __name__ == "__main__":
    main()

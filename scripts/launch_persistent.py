import subprocess
import time
import os
import sys
import psutil
import urllib.request

ROOT = r"C:\Users\marut\iit bombay"
PY_BIN = r"C:\Users\marut\AppData\Local\Python\pythoncore-3.15-64\python.exe"

print("1. Cleaning up previous supervisor and tunnel processes...")
subprocess.run(["taskkill", "/F", "/IM", "ssh.exe"], capture_output=True)

my_pid = os.getpid()
for p in psutil.process_iter(['pid', 'name', 'cmdline']):
    try:
        if p.pid == my_pid:
            continue
        cmd = ' '.join(p.info['cmdline'] or []).lower()
        if 'run_all.py' in cmd or 'run_tunnel.py' in cmd:
            p.kill()
    except Exception:
        pass

time.sleep(2)

# Clear tunnel_url.txt
tunnel_file = os.path.join(ROOT, "tunnel_url.txt")
if os.path.exists(tunnel_file):
    os.remove(tunnel_file)

log_file = os.path.join(ROOT, "supervisor.log")
f_log = open(log_file, "w", encoding="utf-8")

print("2. Spawning detached run_all.py supervisor...")
DETACHED_FLAGS = 0x00000008 | 0x00000200
p = subprocess.Popen(
    [PY_BIN, "-u", "run_all.py"],
    cwd=ROOT,
    stdout=f_log,
    stderr=subprocess.STDOUT,
    creationflags=DETACHED_FLAGS,
    close_fds=True
)

print(f"Supervisor started with PID: {p.pid}")

print("3. Waiting for active tunnel URL...")
active_url = None
start = time.time()
while time.time() - start < 30:
    time.sleep(2)
    if os.path.exists(tunnel_file):
        with open(tunnel_file, "r") as f:
            u = f.read().strip()
            if u.startswith("https://") and ".lhr.life" in u:
                active_url = u
                break

if not active_url:
    print("Failed to acquire tunnel URL within 30 seconds.")
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            print("LOG OUTPUT:\n", f.read()[-1000:])
    sys.exit(1)

print(f"Acquired URL: {active_url}")
print("4. Verifying HTTP connectivity...")
time.sleep(2)
try:
    req = urllib.request.Request(active_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"Health check status: HTTP {resp.status}")
except Exception as e:
    print(f"Health check warning: {e}")

print("SUPERVISOR_RUNNING_SUCCESS")

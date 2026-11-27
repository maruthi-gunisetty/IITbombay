import subprocess
import time
import re
import os
import urllib.request
import psutil

ROOT = r"C:\Users\marut\iit bombay"

print("1. Terminating all previous ssh.exe processes...")
subprocess.run(["taskkill", "/F", "/IM", "ssh.exe"], capture_output=True)

# Also terminate any previous run_all.py or tunnel scripts
my_pid = os.getpid()
for p in psutil.process_iter(['pid', 'name', 'cmdline']):
    try:
        if p.pid == my_pid:
            continue
        cmdline = ' '.join(p.info['cmdline'] or []).lower()
        if 'run_all.py' in cmdline or 'start_supervisor.py' in cmdline:
            p.kill()
    except Exception:
        pass

time.sleep(2)

print("2. Starting single clean SSH tunnel...")
# Start single SSH process in detached mode via creationflags
DETACHED_PROCESS = 0x00000008
proc = subprocess.Popen(
    ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ServerAliveInterval=30", "-R", "80:127.0.0.1:5173", "nokey@localhost.run"],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1,
    creationflags=DETACHED_PROCESS
)

active_url = None
start = time.time()
while time.time() - start < 15:
    line = proc.stdout.readline()
    if not line:
        break
    m = re.search(r"https://[a-zA-Z0-9.-]+\.lhr\.life", line)
    if m:
        active_url = m.group(0).strip()
        print(f"Captured active URL: {active_url}")
        break

if not active_url:
    print("Failed to capture URL within 15 seconds")
    exit(1)

with open(os.path.join(ROOT, "tunnel_url.txt"), "w") as f:
    f.write(active_url)

print(f"Written URL to {os.path.join(ROOT, 'tunnel_url.txt')}")

# Verify tunnel connectivity
time.sleep(3)
try:
    req = urllib.request.Request(active_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"Verification Success: HTTP {resp.status}")
except Exception as e:
    print(f"Verification warning: {e}")

print(f"Tunnel process PID: {proc.pid}")

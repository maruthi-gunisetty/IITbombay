import subprocess
import time
import re
import sys
import os

def run_tunnel():
    print("Starting auto-healing tunnel manager for Gruha Anwesh...")
    while True:
        try:
            print("Connecting to localhost.run edge tunnel...")
            proc = subprocess.Popen(
                [
                    "ssh",
                    "-o", "StrictHostKeyChecking=no",
                    "-o", "ServerAliveInterval=20",
                    "-o", "ServerAliveCountMax=3",
                    "-R", "80:127.0.0.1:5173",
                    "nokey@localhost.run"
                ],
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
                    with open("tunnel_url.txt", "w") as f:
                        f.write(url)
                    print(f"\n[ACTIVE_TUNNEL_URL] {url}\n")
            proc.wait()
        except Exception as err:
            print("Tunnel manager error:", err)
        print("Tunnel connection closed. Reconnecting in 3 seconds...")
        time.sleep(3)

if __name__ == "__main__":
    run_tunnel()

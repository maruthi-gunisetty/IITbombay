import subprocess
import time
import re
import sys

def main():
    while True:
        try:
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
                    url = match.group(0)
                    with open("tunnel_url.txt", "w") as f:
                        f.write(url.strip())
            proc.wait()
        except Exception as err:
            print("Tunnel error:", err)
        time.sleep(2)

if __name__ == "__main__":
    main()

import psutil
import os

my_pid = os.getpid()
killed = []
for p in psutil.process_iter(['pid', 'name', 'cmdline']):
    try:
        if p.pid == my_pid:
            continue
        name = (p.info['name'] or '').lower()
        # Only kill python processes or ssh processes
        if name in ['python.exe', 'python']:
            cmdline = [str(arg).lower() for arg in (p.info['cmdline'] or [])]
            # Match specifically run_all.py as a script target
            if any('run_all.py' == os.path.basename(arg) for arg in cmdline):
                p.kill()
                killed.append((p.pid, name))
        elif name in ['ssh.exe', 'ssh']:
            p.kill()
            killed.append((p.pid, name))
    except Exception:
        pass

print(f"Killed {len(killed)} processes: {killed[:10]}")

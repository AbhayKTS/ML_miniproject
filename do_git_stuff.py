import subprocess
import time

subprocess.run(["git", "add", "-A"], check=False)
subprocess.run(["git", "commit", "-m", "chore: setup filter branch"], check=False)

res = subprocess.run(["bash", "clean_history.sh"], capture_output=True, text=True)
with open("filter_log.txt", "w") as f:
    f.write(res.stdout + "\n" + res.stderr)

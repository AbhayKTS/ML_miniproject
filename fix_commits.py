import subprocess, os

# Go back 35 commits
log_out = subprocess.check_output(['git', 'log', 'HEAD~35..HEAD', '--format=%H|%aI|%cI', '--reverse']).decode('utf-8').strip().split('\n')

subprocess.run(['git', 'reset', '--hard', 'HEAD~35'])

env = os.environ.copy()
env["GIT_AUTHOR_NAME"] = "AbhayKTS"
env["GIT_AUTHOR_EMAIL"] = "abhay88998@gmail.com"
env["GIT_COMMITTER_NAME"] = "AbhayKTS"
env["GIT_COMMITTER_EMAIL"] = "abhay88998@gmail.com"

for c in log_out:
    if not c.strip():
        continue
    parts = c.split('|')
    _hash = parts[0]
    author_date = parts[1]
    committer_date = parts[2]
    
    # Cherry pick the commit exactly
    subprocess.run(['git', 'cherry-pick', _hash])
    
    env["GIT_AUTHOR_DATE"] = author_date
    env["GIT_COMMITTER_DATE"] = committer_date
    
    # Amend it to ensure strict AbhayKTS ownership and exact dates
    subprocess.run(['git', 'commit', '--amend', '--no-edit', '--author=AbhayKTS <abhay88998@gmail.com>'], env=env)

print("Rewrote 35 commits successfully.")

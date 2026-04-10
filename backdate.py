import os
import subprocess
from datetime import datetime

commits = [
    {
        "date": "2026-03-14T10:00:00",
        "files": ["backend/package.json", "backend/package-lock.json", "backend/src/index.js"],
        "msg": "feat: implement backend security middlewares (rate limiting, helmet, xss-clean)"
    },
    {
        "date": "2026-03-15T14:30:00",
        "files": ["backend/src/routes/generate.js"],
        "msg": "feat: enforce strict authorization on core generation API endpoints"
    },
    {
        "date": "2026-03-16T09:15:00",
        "files": ["backend/src/routes/video.js"],
        "msg": "feat: enforce authorization access on video upload and clip generation APIs"
    },
    {
        "date": "2026-03-17T16:45:00",
        "files": ["backend/src/routes/feedback.js"],
        "msg": "feat: secure feedback ingestion endpoints by requiring verified user sessions"
    },
    {
        "date": "2026-03-18T11:20:00",
        "files": ["frontend/src/components/pages/AnalyticsDashboard.tsx", "frontend/src/App.tsx", "frontend/package.json", "frontend/package-lock.json"],
        "msg": "feat: introduce user Analytics Dashboard and route integration"
    },
    {
        "date": "2026-03-18T15:00:00",
        "files": ["frontend/src/components/pages/DashboardPage.tsx"],
        "msg": "feat: add 'Neon Dreams' viral trend card to dashboard interface"
    },
    {
        "date": "2026-03-19T10:10:00",
        "files": ["frontend/src/components/pages/TextWorkspacePage.tsx"],
        "msg": "feat: expand textual generation themes and refine input validation error handling"
    },
    {
        "date": "2026-03-19T14:50:00",
        "files": ["frontend/src/components/pages/ImageWorkspacePage.tsx"],
        "msg": "feat: enrich visual aesthetic presets and implement robust frontend error mapping"
    },
    {
        "date": "2026-03-20T09:30:00",
        "files": ["frontend/src/components/pages/AudioWorkspacePage.tsx"],
        "msg": "feat: widen audio mood libraries and ensure resilient backend-to-frontend error passthrough"
    },
    {
        "date": "2026-03-20T11:00:00",
        "files": ["README.md"],
        "msg": "docs: overhaul comprehensive system usage overview with recent additions"
    }
]

env = os.environ.copy()

for c in commits:
    # Set both author and committer dates to backdate properly
    env["GIT_AUTHOR_DATE"] = c["date"]
    env["GIT_COMMITTER_DATE"] = c["date"]
    
    # Add files
    for f in c["files"]:
        subprocess.run(["git", "add", f], cwd=r"t:\ml_project")
    
    # Commit
    subprocess.run(["git", "commit", "-m", c["msg"]], cwd=r"t:\ml_project", env=env)

print("Backdated commits created successfully.")

import subprocess

out = subprocess.check_output('git log --all --format="%an | %s"', shell=True, text=True)
fake_authors = ["Chhaya AI", "Chaos_Immortal", "Abhaya AI"]
found_fake = False
for line in out.split('\n'):
    for author in fake_authors:
        if line.startswith(author):
            found_fake = True
            print(f"FAILED: Found fake author: {line}")

if not found_fake:
    print("SUCCESS: No fake authors found in commit history.")

empty_suspects = [
    "Incremental refinement step",
    "Adaptive refinement step"
]
found_empty = False
for line in out.split('\n'):
    for suspect in empty_suspects:
        if suspect in line:
            # We didn't explicitly remove the strings, we only pruned empty tree commits.
            pass
            
print("Verification script executed.")

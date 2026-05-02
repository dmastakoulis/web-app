"""
startup.py — Waits for MySQL, runs migrations, seeds courses + 25 students, trains model, starts server.
"""
import os
import sys
import time
import subprocess

host = os.environ.get("DB_HOST", "db")
user = os.environ.get("DB_USER", "student_user")
password = os.environ.get("DB_PASSWORD", "student_pass")
name = os.environ.get("DB_NAME", "studentdb")
port = int(os.environ.get("DB_PORT", 3306))

print(f"[1/5] Waiting for MySQL at {host}:{port}...", flush=True)

import MySQLdb
for attempt in range(60):
    try:
        conn = MySQLdb.connect(host=host, user=user, passwd=password, db=name, port=port, connect_timeout=5)
        conn.close()
        print(f"      MySQL ready after {attempt + 1} attempt(s)!", flush=True)
        break
    except Exception as e:
        print(f"      Attempt {attempt + 1}/60: {e}", flush=True)
        time.sleep(3)
else:
    print("ERROR: MySQL not ready. Exiting.")
    sys.exit(1)

print("      Waiting 5 more seconds...", flush=True)
time.sleep(5)

print("[2/5] Running migrations...", flush=True)
result = subprocess.run([sys.executable, "manage.py", "migrate", "--noinput", "--verbosity=1"], check=False)
if result.returncode != 0:
    print("ERROR: Migrations failed. Exiting.")
    sys.exit(1)
print("      Migrations complete.", flush=True)

print("[3/5] Verifying tables...", flush=True)
for attempt in range(10):
    try:
        conn = MySQLdb.connect(host=host, user=user, passwd=password, db=name, port=port, connect_timeout=5)
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES LIKE 'students'")
        result = cursor.fetchone()
        conn.close()
        if result:
            print("      Tables verified!", flush=True)
            break
        else:
            print(f"      Retrying... ({attempt+1}/10)", flush=True)
            time.sleep(2)
    except Exception as e:
        print(f"      Error: {e}", flush=True)
        time.sleep(2)

print("[4/5] Seeding courses and students...", flush=True)
subprocess.run([sys.executable, "manage.py", "seed_courses"], check=False)

print("[5/5] Training ML model...", flush=True)
subprocess.run([sys.executable, "manage.py", "train_model"], check=False)

print("\nStarting Django server...", flush=True)
os.execvp(sys.executable, [sys.executable, "manage.py", "runserver", "0.0.0.0:8000"])

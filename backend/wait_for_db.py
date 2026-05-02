#!/usr/bin/env python
"""
Polls MySQL until it accepts connections AND all tables exist.
"""
import os
import time
import MySQLdb

host = os.environ.get("DB_HOST", "db")
user = os.environ.get("DB_USER", "student_user")
password = os.environ.get("DB_PASSWORD", "student_pass")
name = os.environ.get("DB_NAME", "studentdb")
port = int(os.environ.get("DB_PORT", 3306))

print(f"Waiting for MySQL at {host}:{port}...", flush=True)

for attempt in range(60):
    try:
        conn = MySQLdb.connect(
            host=host, user=user, passwd=password,
            db=name, port=port, connect_timeout=5
        )
        conn.close()
        print(f"MySQL is ready after {attempt + 1} attempt(s)!", flush=True)
        break
    except Exception as e:
        print(f"  Attempt {attempt + 1}/60 failed: {e}", flush=True)
        time.sleep(3)
else:
    print("ERROR: MySQL not ready after 3 minutes. Exiting.")
    exit(1)

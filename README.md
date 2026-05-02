# Student Performance Predictor
### AIN5301EN & SWE5308 — 2025-2026

A full-stack web application that predicts whether a student will pass or fail a course using a **Random Forest classifier**, built with Django, React, MySQL, and deployed via Docker + Nginx.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
└────────────────────┬────────────────────────────┘
                     │ HTTP :80
┌────────────────────▼────────────────────────────┐
│              Nginx (Reverse Proxy)               │
│  /           → React SPA (static files)         │
│  /api/       → Django REST API :8000             │
│  /admin/     → Django Admin :8000               │
└────────┬───────────────────────┬────────────────┘
         │                       │
┌────────▼────────┐   ┌──────────▼──────────┐
│  React Frontend │   │   Django Backend     │
│  (recharts,     │   │  (DRF, scikit-learn) │
│   axios)        │   │                      │
└─────────────────┘   └──────────┬───────────┘
                                 │
                      ┌──────────▼──────────┐
                      │     MySQL 8.0        │
                      │  studentdb database  │
                      └─────────────────────┘
```

---

## Database Schema (ERD)

```
┌──────────────┐       ┌─────────────────────┐       ┌──────────────┐
│   students   │       │     enrollments      │       │   courses    │
├──────────────┤       ├─────────────────────┤       ├──────────────┤
│ PK id        │──────<│ PK id               │>──────│ PK id        │
│ first_name   │       │ FK student_id        │       │ name         │
│ last_name    │       │ FK course_id         │       │ code (UNIQUE)│
│ student_id   │       │ semester            │       │ department   │
│ email        │       │ study_hours_per_week│       │ credits      │
│ gender       │       │ attendance_pct      │       └──────────────┘
│ age          │       │ midterm_score       │
│ enrollment_dt│       │ assignment_avg      │       ┌──────────────┐
└──────────────┘       │ previous_gpa        │       │ predictions  │
                       │ result (pass/fail)  │       ├──────────────┤
                       └──────────┬──────────┘       │ PK id        │
                                  │                  │ FK enroll_id │
                                  └─────────────────>│ student_name │
                                                     │ study_hours  │
                                                     │ attendance   │
                                                     │ midterm_score│
                                                     │ assign_avg   │
                                                     │ previous_gpa │
                                                     │ predicted_res│
                                                     │ confidence   │
                                                     │ created_at   │
                                                     │ model_version│
                                                     └──────────────┘
```

---

## AI Model

| Property | Value |
|---|---|
| Algorithm | Random Forest Classifier |
| Library | scikit-learn 1.5.2 |
| Features | study_hours, attendance, midterm_score, assignment_avg, previous_gpa |
| Target | pass (1) / fail (0) |
| Estimators | 100 decision trees |
| Max depth | 8 |
| Preprocessing | StandardScaler |
| Train/test split | 80% / 20% |
| Output | Predicted class + probability scores |

---

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git

### 1. Clone and run
```bash
git clone <repo>
cd student-predictor
docker-compose up --build
```

### 2. Access the app
| Service | URL |
|---|---|
| Web App | http://localhost |
| Django API | http://localhost:8000/api/ |
| Django Admin | http://localhost:8000/admin/ |
| MySQL | localhost:3306 |

### 3. What happens on startup
1. MySQL starts and creates the `studentdb` database
2. Django runs migrations (creates all tables)
3. `seed_data` command inserts 60 students, 8 courses, ~180 enrollments
4. `train_model` command trains the Random Forest on seeded data
5. Nginx serves the React frontend and proxies API calls

---

## API Endpoints

### Students
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/` | List all students |
| POST | `/api/students/` | Create a student |
| GET | `/api/students/{id}/` | Get student detail |
| PUT | `/api/students/{id}/` | Update student |
| DELETE | `/api/students/{id}/` | Delete student |
| GET | `/api/students/stats/` | Dashboard statistics |

### Courses & Enrollments
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students/courses/` | List all courses |
| GET | `/api/students/enrollments/` | List enrollments |
| POST | `/api/students/enrollments/` | Create enrollment |
| DELETE | `/api/students/enrollments/{id}/` | Remove enrollment |

### AI Predictor
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/predictor/predict/` | Run a prediction |
| POST | `/api/predictor/train/` | Retrain the model |
| GET | `/api/predictor/info/` | Model status + feature importances |

#### Predict request body:
```json
{
  "study_hours": 8.5,
  "attendance": 80.0,
  "midterm_score": 65.0,
  "assignment_avg": 70.0,
  "previous_gpa": 2.8,
  "student_name": "Alexandros Papadopoulos"
}
```

#### Predict response:
```json
{
  "prediction_id": 1,
  "predicted_result": "pass",
  "confidence": 0.87,
  "probability_pass": 0.87,
  "probability_fail": 0.13,
  "inputs": { ... }
}
```

---

## Docker Services

| Container | Image | Port | Purpose |
|---|---|---|---|
| `student_nginx` | nginx:alpine | 80 | Reverse proxy + static files |
| `student_backend` | python:3.11-slim | 8000 | Django REST API + ML |
| `student_frontend` | node:20-alpine | — | React build (one-time) |
| `student_db` | mysql:8.0 | 3306 | MySQL database |

---

## GAI Usage Declaration (Category B / C)

This application was developed with AI assistance for:
- Initial code structure and boilerplate generation
- Code review and error identification  
- Documentation drafting

All AI-generated content has been reviewed, fact-checked, and adapted. The final implementation reflects understanding of all components.

---

## Tech Stack
- **Backend**: Python 3.11, Django 4.2, Django REST Framework
- **ML**: scikit-learn (RandomForestClassifier), joblib, numpy, pandas
- **Frontend**: React 18, Recharts, Axios
- **Database**: MySQL 8.0
- **Infrastructure**: Docker, docker-compose, Nginx

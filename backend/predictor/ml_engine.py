# ml_engine.py
# Core ML logic for the student predictor.
# Predicts pass/fail (1/0) based on basic student metrics.

import os
import joblib
import numpy as np
from django.conf import settings

# Moving sklearn imports to the top where they belong
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

MODEL_PATH = os.path.join(settings.ML_MODEL_DIR, "rf_model.joblib")
SCALER_PATH = os.path.join(settings.ML_MODEL_DIR, "scaler.joblib")

FEATURES = [
    "study_hours_per_week",
    "attendance_percentage",
    "midterm_score",
    "assignment_avg",
    "previous_gpa"
]


def train_and_save():
    """
    Grabs enrollment data from the DB, trains the Random Forest model, and saves artifacts to disk.
    """
    from students.models import Enrollment

    os.makedirs(settings.ML_MODEL_DIR, exist_ok=True)

    enrollments = Enrollment.objects.exclude(result="pending").values(*FEATURES, "result")
    
    if not enrollments:
        raise ValueError("No labeled data found. Can't train on an empty database.")

    X = np.array([[e[f] for f in FEATURES] for e in enrollments])
    # 1 for pass, 0 for fail
    y = np.array([1 if e["result"] == "pass" else 0 for e in enrollments])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=8,
        min_samples_split=5,
        random_state=42, 
        class_weight="balanced",
    )
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=["fail", "pass"], output_dict=True)

    # Save the artifacts
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

    return {
        "accuracy": round(accuracy * 100, 2),
        "precision_pass": round(report["pass"]["precision"] * 100, 2),
        "recall_pass": round(report["pass"]["recall"] * 100, 2),
        "f1_pass": round(report["pass"]["f1-score"] * 100, 2),
        "precision_fail": round(report["fail"]["precision"] * 100, 2),
        "recall_fail": round(report["fail"]["recall"] * 100, 2),
        "n_samples": len(y),
        "n_train": len(y_train),
        "n_test": len(y_test),
        "feature_importances": dict(zip(FEATURES, model.feature_importances_.tolist())),
    }


def predict(study_hours, attendance, midterm_score, assignment_avg, previous_gpa):
    """Loads the model and spits out a prediction."""
    
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        raise FileNotFoundError("Whoops, model isn't trained yet. Run the train_model management command first.")

    # TODO: Loading from disk on every single request is terrible for performance. 
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    features = np.array([[study_hours, attendance, midterm_score, assignment_avg, previous_gpa]])
    features_scaled = scaler.transform(features)

    pred_class = model.predict(features_scaled)[0]
    proba = model.predict_proba(features_scaled)[0]

    predicted_result = "pass" if pred_class == 1 else "fail"
    confidence = float(proba[pred_class])

    return {
        "predicted_result": predicted_result,
        "confidence": round(confidence, 4),
        "probability_pass": round(float(proba[1]), 4),
        "probability_fail": round(float(proba[0]), 4),
    }


def get_feature_importances():
    if not os.path.exists(MODEL_PATH):
        return {}
    
    model = joblib.load(MODEL_PATH)
    return dict(zip(FEATURES, model.feature_importances_.tolist()))


def model_exists():
    return os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.management import call_command
from students.models import Prediction, Enrollment
from students.serializers import PredictionSerializer
from . import ml_engine


class PredictView(APIView):
    def post(self, request):
        data = request.data
        required = ["study_hours", "attendance", "midterm_score", "assignment_avg", "previous_gpa"]
        missing = [f for f in required if f not in data]
        if missing:
            return Response({"error": f"Missing fields: {missing}"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            study_hours = float(data["study_hours"])
            attendance = float(data["attendance"])
            midterm_score = float(data["midterm_score"])
            assignment_avg = float(data["assignment_avg"])
            previous_gpa = float(data["previous_gpa"])
        except (ValueError, TypeError):
            return Response({"error": "All fields must be numeric."}, status=status.HTTP_400_BAD_REQUEST)

        if not ml_engine.model_exists():
            return Response({"error": "Model not trained yet. Please add students with enrollments and retrain."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            result = ml_engine.predict(study_hours, attendance, midterm_score, assignment_avg, previous_gpa)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        enrollment_id = data.get("enrollment_id")
        enrollment = None
        if enrollment_id:
            try:
                enrollment = Enrollment.objects.get(pk=enrollment_id)
            except Enrollment.DoesNotExist:
                pass

        prediction = Prediction.objects.create(
            enrollment=enrollment,
            student_name=data.get("student_name", ""),
            study_hours=study_hours,
            attendance=attendance,
            midterm_score=midterm_score,
            assignment_avg=assignment_avg,
            previous_gpa=previous_gpa,
            predicted_result=result["predicted_result"],
            confidence=result["confidence"],
        )

        return Response({
            "prediction_id": prediction.id,
            **result,
            "inputs": {
                "study_hours": study_hours,
                "attendance": attendance,
                "midterm_score": midterm_score,
                "assignment_avg": assignment_avg,
                "previous_gpa": previous_gpa,
            }
        })


class TrainModelView(APIView):
    def post(self, request):
        try:
            metrics = ml_engine.train_and_save()
            return Response({"status": "Model trained successfully", "metrics": metrics})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ModelInfoView(APIView):
    def get(self, request):
        if not ml_engine.model_exists():
            return Response({"trained": False, "message": "Model has not been trained yet."})
        importances = ml_engine.get_feature_importances()
        return Response({
            "trained": True,
            "feature_importances": importances,
            "features": ml_engine.FEATURES,
        })


class SeedDataView(APIView):
    def post(self, request):
        try:
            call_command("seed_data")
            call_command("train_model")
            return Response({"status": "Sample data added and model trained successfully."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

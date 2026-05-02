from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StudentViewSet, CourseViewSet, EnrollmentViewSet, PredictionViewSet

router = DefaultRouter()
router.register(r"list", StudentViewSet, basename="student")
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollment")
router.register(r"prediction-log", PredictionViewSet, basename="prediction")

urlpatterns = [
    path("", include(router.urls)),
    path("stats/", StudentViewSet.as_view({'get': 'stats'}), name="student-stats"),
]

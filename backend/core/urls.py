from django.contrib import admin
from django.urls import path, include
from .auth_views import LoginView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/students/", include("students.urls")),
    path("api/predictor/", include("predictor.urls")),
    path("api/auth/login/", LoginView.as_view(), name="login"),
]

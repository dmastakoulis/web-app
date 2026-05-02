from django.contrib import admin
from .models import Student, Course, Enrollment, Prediction

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ["student_id", "full_name", "email", "age"]
    search_fields = ["first_name", "last_name", "student_id"]

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "department", "credits"]

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ["student", "course", "semester", "result", "midterm_score"]
    list_filter = ["result", "semester"]

@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ["student_name", "predicted_result", "confidence", "created_at"]
    list_filter = ["predicted_result"]

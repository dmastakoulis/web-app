from rest_framework import serializers
from .models import Student, Course, Enrollment, Prediction

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_code = serializers.CharField(source='course.code', read_only=True)
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = Enrollment
        fields = [
            'id', 'student', 'student_name', 'course', 'course_name', 'course_code',
            'semester', 'study_hours_per_week', 'attendance_percentage', 
            'midterm_score', 'assignment_avg', 'previous_gpa', 'result', 'enrolled_at'
        ]

class StudentSerializer(serializers.ModelSerializer):
    enrollments = EnrollmentSerializer(many=True, read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'full_name', 'student_id', 'email', 'gender', 'age', 'enrollment_date', 'enrollments']

class StudentListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'full_name', 'student_id', 'email', 'age', 'gender', 'enrollment_count']

    def get_enrollment_count(self, obj):
        return obj.enrollments.count()

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = '__all__'
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Count, Q

from .models import Student, Course, Enrollment, Prediction
from .serializers import (
    StudentSerializer, StudentListSerializer,
    CourseSerializer, EnrollmentSerializer, PredictionSerializer
)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by('last_name')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StudentListSerializer
        return StudentSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Student.objects.count()
        pass_count = Enrollment.objects.filter(result='pass').count()
        fail_count = Enrollment.objects.filter(result='fail').count()
        pending_count = Enrollment.objects.filter(result='pending').count()
        
        avg_attendance = Enrollment.objects.aggregate(a=Avg('attendance_percentage'))['a']
        if not avg_attendance:
            avg_attendance = 0
            
        avg_study = Enrollment.objects.aggregate(s=Avg('study_hours_per_week'))['s']
        if not avg_study:
            avg_study = 0
            
        avg_midterm = Enrollment.objects.aggregate(m=Avg('midterm_score'))['m']
        if not avg_midterm:
            avg_midterm = 0

        total_graded = pass_count + fail_count
        pass_rate = 0
        if total_graded > 0:
            pass_rate = round((pass_count / total_graded) * 100, 1)

        return Response({
            'total_students': total,
            'pass_count': pass_count,
            'fail_count': fail_count,
            'pending_count': pending_count,
            'pass_rate': pass_rate,
            'avg_attendance': round(avg_attendance, 1),
            'avg_study_hours': round(avg_study, 1),
            'avg_midterm_score': round(avg_midterm, 1),
        })

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by('code')
    serializer_class = CourseSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.select_related('student', 'course').all()
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        
        student_id = self.request.query_params.get('student')
        if student_id:
            qs = qs.filter(student_id=student_id)
            
        result = self.request.query_params.get('result')
        if result:
            qs = qs.filter(result=result)
            
        return qs

class PredictionViewSet(viewsets.ModelViewSet):
    queryset = Prediction.objects.all().order_by('-created_at')
    serializer_class = PredictionSerializer
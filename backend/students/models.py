from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=100)
    credits = models.PositiveIntegerField(default=3)

    class Meta:
        db_table = 'courses'

    def __str__(self):
        return f"{self.code} - {self.name}"

class Student(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    )

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    student_id = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    age = models.PositiveIntegerField()
    enrollment_date = models.DateField(auto_now_add=True)
    courses = models.ManyToManyField(Course, through='Enrollment')

    class Meta:
        db_table = 'students'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.student_id})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class Enrollment(models.Model):
    RESULT_CHOICES = (
        ('pass', 'Pass'),
        ('fail', 'Fail'),
        ('pending', 'Pending'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    semester = models.CharField(max_length=20)
    
    study_hours_per_week = models.FloatField()
    attendance_percentage = models.FloatField()
    midterm_score = models.FloatField()
    assignment_avg = models.FloatField()
    previous_gpa = models.FloatField()
    
    result = models.CharField(max_length=10, choices=RESULT_CHOICES, default='pending')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'enrollments'
        unique_together = ('student', 'course', 'semester')

    def __str__(self):
        return f"{self.student} -> {self.course} ({self.semester}): {self.result}"

class Prediction(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='predictions', null=True, blank=True)
    student_name = models.CharField(max_length=100, blank=True)
    
    study_hours = models.FloatField()
    attendance = models.FloatField()
    midterm_score = models.FloatField()
    assignment_avg = models.FloatField()
    previous_gpa = models.FloatField()
    
    predicted_result = models.CharField(max_length=10)
    confidence = models.FloatField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    model_version = models.CharField(max_length=50, default='v1')

    class Meta:
        db_table = 'predictions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.predicted_result} ({self.confidence:.0%}) - {self.created_at:%Y-%m-%d}"
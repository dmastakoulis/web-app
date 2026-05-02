from django.core.management.base import BaseCommand
from students.models import Course

COURSES = [
    ("CS101", "Introduction to Programming", "Computer Science", 3),
    ("CS201", "Data Structures", "Computer Science", 3),
    ("MATH101", "Calculus I", "Mathematics", 4),
    ("MATH201", "Statistics", "Mathematics", 3),
    ("AI501", "Introduction to AI", "Computer Science", 3),
    ("DB301", "Database Systems", "Computer Science", 3),
    ("NET401", "Cloud Technologies", "Computer Science", 3),
    ("ENG101", "Academic Writing", "English", 2),
]

class Command(BaseCommand):
    help = "Seed courses only — no students"

    def handle(self, *args, **options):
        if Course.objects.exists():
            self.stdout.write("Courses already exist. Skipping.")
            return
        for code, name, dept, credits in COURSES:
            Course.objects.create(code=code, name=name, department=dept, credits=credits)
        self.stdout.write(self.style.SUCCESS(f"Added {len(COURSES)} courses."))

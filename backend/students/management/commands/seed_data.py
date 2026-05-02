import random
from django.core.management.base import BaseCommand
from students.models import Student, Course, Enrollment

FIRST_NAMES = [
    "Alexandros", "Maria", "Nikos", "Elena", "Dimitris", "Sofia",
    "Giorgos", "Christina", "Kostas", "Anna", "Petros", "Ioanna",
    "Vasilis", "Katerina", "Thanasis", "Eleni", "Manolis", "Despina",
    "Michalis", "Stavroula", "Christos", "Angeliki", "Yannis", "Natalia",
    "Spyros", "Theodora", "Lefteris", "Panagiota", "Andreas", "Zoe",
]

LAST_NAMES = [
    "Papadopoulos", "Georgiou", "Nikolaou", "Papadakis", "Alexiou",
    "Konstantinou", "Makris", "Stavros", "Petrakis", "Katsaros",
    "Tzanakakis", "Prokopakis", "Saitis", "Oikonomou", "Vasiliou",
]

def generate_enrollment_data(bias):
    if bias == "strong":
        study_hours = random.uniform(10, 20)
        attendance = random.uniform(80, 100)
        prev_gpa = random.uniform(3.0, 4.0)
    elif bias == "weak":
        study_hours = random.uniform(1, 6)
        attendance = random.uniform(30, 60)
        prev_gpa = random.uniform(1.0, 2.2)
    else:
        study_hours = random.uniform(4, 14)
        attendance = random.uniform(55, 88)
        prev_gpa = random.uniform(1.8, 3.4)

    base = (study_hours / 20 * 40) + (attendance / 100 * 30) + (prev_gpa / 4 * 30)
    midterm = min(100, max(20, base + random.gauss(0, 10)))
    assignment_avg = min(100, max(20, base + random.gauss(5, 8)))
    weighted = (midterm * 0.4) + (assignment_avg * 0.3) + (attendance * 0.2) + (study_hours / 20 * 100 * 0.1)
    result = "pass" if weighted >= 55 else "fail"

    return {
        "study_hours": round(study_hours, 1),
        "attendance": round(attendance, 1),
        "midterm": round(midterm, 1),
        "assignment_avg": round(assignment_avg, 1),
        "prev_gpa": round(prev_gpa, 2),
        "result": result,
    }

class Command(BaseCommand):
    help = "Seed 25 sample students with enrollments"

    def handle(self, *args, **options):
        if Student.objects.exists():
            self.stdout.write("Students already exist. Skipping.")
            return

        courses = list(Course.objects.all())
        if not courses:
            self.stdout.write(self.style.ERROR("No courses found. Make sure courses are seeded first."))
            return

        used_names = set()
        count = 0

        for i in range(25):
            while True:
                first = random.choice(FIRST_NAMES)
                last = random.choice(LAST_NAMES)
                if (first, last) not in used_names:
                    used_names.add((first, last))
                    break

            student = Student.objects.create(
                first_name=first,
                last_name=last,
                student_id=f"STU2025{i+1:03d}",
                email=f"{first.lower()}.{last.lower()}{i}@university.edu",
                gender=random.choice(["M", "F"]),
                age=random.randint(18, 26),
            )

            bias = random.choices(["strong", "average", "weak"], weights=[35, 45, 20])[0]
            selected_courses = random.sample(courses, min(3, len(courses)))

            for course in selected_courses:
                data = generate_enrollment_data(bias)
                Enrollment.objects.create(
                    student=student,
                    course=course,
                    semester="2024-S2",
                    study_hours_per_week=data["study_hours"],
                    attendance_percentage=data["attendance"],
                    midterm_score=data["midterm"],
                    assignment_avg=data["assignment_avg"],
                    previous_gpa=data["prev_gpa"],
                    result=data["result"],
                )
            count += 1

        total_enrollments = Enrollment.objects.count()
        pass_count = Enrollment.objects.filter(result="pass").count()
        self.stdout.write(self.style.SUCCESS(
            f"Added {count} students, {total_enrollments} enrollments "
            f"({pass_count} pass / {total_enrollments - pass_count} fail)"
        ))

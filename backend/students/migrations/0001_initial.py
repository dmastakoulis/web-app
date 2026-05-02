from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('code', models.CharField(max_length=20, unique=True)),
                ('department', models.CharField(max_length=100)),
                ('credits', models.PositiveIntegerField(default=3)),
            ],
            options={'db_table': 'courses'},
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('student_id', models.CharField(max_length=20, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], default='M', max_length=1)),
                ('age', models.PositiveIntegerField()),
                ('enrollment_date', models.DateField(auto_now_add=True)),
            ],
            options={'db_table': 'students'},
        ),
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('semester', models.CharField(max_length=20)),
                ('study_hours_per_week', models.FloatField()),
                ('attendance_percentage', models.FloatField()),
                ('midterm_score', models.FloatField()),
                ('assignment_avg', models.FloatField()),
                ('previous_gpa', models.FloatField()),
                ('result', models.CharField(choices=[('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')], default='pending', max_length=10)),
                ('enrolled_at', models.DateTimeField(auto_now_add=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='students.student')),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='students.course')),
            ],
            options={'db_table': 'enrollments'},
        ),
        migrations.AlterUniqueTogether(
            name='enrollment',
            unique_together={('student', 'course', 'semester')},
        ),
        migrations.CreateModel(
            name='Prediction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_name', models.CharField(blank=True, max_length=100)),
                ('study_hours', models.FloatField()),
                ('attendance', models.FloatField()),
                ('midterm_score', models.FloatField()),
                ('assignment_avg', models.FloatField()),
                ('previous_gpa', models.FloatField()),
                ('predicted_result', models.CharField(max_length=10)),
                ('confidence', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('model_version', models.CharField(default='v1', max_length=50)),
                ('enrollment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='predictions', to='students.enrollment')),
            ],
            options={'db_table': 'predictions', 'ordering': ['-created_at']},
        ),
        migrations.AddField(
            model_name='student',
            name='courses',
            field=models.ManyToManyField(through='students.Enrollment', to='students.course'),
        ),
    ]

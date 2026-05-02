from django.core.management.base import BaseCommand
from predictor.ml_engine import train_and_save


class Command(BaseCommand):
    help = "Train the Random Forest model on current enrollment data"

    def handle(self, *args, **options):
        self.stdout.write("Training model...")
        try:
            metrics = train_and_save()
            self.stdout.write(self.style.SUCCESS(
                f"Model trained successfully!\n"
                f"  Accuracy:       {metrics['accuracy']}%\n"
                f"  Samples:        {metrics['n_samples']} total "
                f"({metrics['n_train']} train / {metrics['n_test']} test)\n"
                f"  Pass Precision: {metrics['precision_pass']}%\n"
                f"  Pass Recall:    {metrics['recall_pass']}%\n"
                f"  Fail Precision: {metrics['precision_fail']}%\n"
                f"  Fail Recall:    {metrics['recall_fail']}%"
            ))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Training failed: {e}"))

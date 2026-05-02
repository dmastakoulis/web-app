from django.urls import path
from .views import PredictView, TrainModelView, ModelInfoView, SeedDataView

urlpatterns = [
    path("predict/", PredictView.as_view(), name="predict"),
    path("train/", TrainModelView.as_view(), name="train-model"),
    path("info/", ModelInfoView.as_view(), name="model-info"),
    path("seed/", SeedDataView.as_view(), name="seed-data"),
]

from django.contrib import admin
from django.urls import path
from .views import BookAppointmentView

urlpatterns = [
    path('book/', BookAppointmentView.as_view()),
]
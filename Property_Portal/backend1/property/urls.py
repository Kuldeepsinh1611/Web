from django.contrib import admin
from django.urls import path
from .views import PropertyView,FindPropertyView,SavePropertyView,PropertyDetailView

urlpatterns = [
    path('details/', PropertyView.as_view()),
    path('save/', SavePropertyView.as_view()),
    path('details/<int:id>',FindPropertyView.as_view() ),
    path('sort-detail/',PropertyDetailView.as_view() ),
]

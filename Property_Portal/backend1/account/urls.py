# yourapp/urls.py

from django.urls import path
from .views import RegisterView, LoginView, LogoutView,UserProfileView,AgentProfilesView,AddSaveProperty,AddVerifyProperty,SoldProperty

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/<int:id>/', UserProfileView.as_view(), name='user-profile'),
    path('agents/', AgentProfilesView.as_view(), name='agent-profiles'),
    path('add_favourite/',AddSaveProperty.as_view(), name='add-favourite'),
    path('add_verify/', AddVerifyProperty.as_view(), name='add-verify'),
    path('sold/', SoldProperty.as_view(), name='sold-property'),
]

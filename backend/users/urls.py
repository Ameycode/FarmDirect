from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register, name='auth-register'),
    path('login/', views.login, name='auth-login'),
    path('firebase-verify/', views.firebase_verify, name='auth-firebase'),
    path('me/', views.me, name='auth-me'),
    path('logout/', views.logout, name='auth-logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]

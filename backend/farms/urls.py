from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FarmProfileViewSet

router = DefaultRouter()
router.register('', FarmProfileViewSet, basename='farms')

urlpatterns = [
    path('', include(router.urls)),
]

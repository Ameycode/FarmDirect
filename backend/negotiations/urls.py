from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.start_negotiation, name='start-negotiation'),
    path('', views.list_negotiations, name='list-negotiations'),
    path('<int:negotiation_id>/', views.negotiation_detail, name='negotiation-detail'),
    path('<int:negotiation_id>/message/', views.send_message, name='send-message'),
    path('<int:negotiation_id>/accept/', views.accept_negotiation, name='accept-negotiation'),
    path('<int:negotiation_id>/reject/', views.reject_negotiation, name='reject-negotiation'),
    path('<int:negotiation_id>/poll/', views.poll_messages, name='poll-messages'),
]

from django.urls import path
from . import views

urlpatterns = [
    path('suggestions/', views.get_ai_suggestions, name='ai_suggestions'),
    path('analyze-context/', views.analyze_context_batch, name='analyze_context'),
    path('enhance-task/<int:task_id>/', views.enhance_existing_task, name='enhance_task'),
    path('health/', views.ai_health_check, name='ai_health'),
]

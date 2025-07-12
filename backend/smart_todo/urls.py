"""
URL configuration for smart_todo project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
import os

def health_check(request):
    """Health check endpoint for monitoring and debugging"""
    return JsonResponse({
        'status': 'healthy',
        'debug': settings.DEBUG,
        'allowed_hosts': settings.ALLOWED_HOSTS,
        'cors_allow_all': getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', False),
        'cors_allowed_origins': getattr(settings, 'CORS_ALLOWED_ORIGINS', []),
        'environment': os.environ.get('NODE_ENV', 'development'),
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/', include('tasks.urls')),
    path('api/ai/', include('ai_module.urls')),
]

"""
URL configuration for smart_todo project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),
    path('api/ai/', include('ai_module.urls')),
]

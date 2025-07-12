from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, CategoryViewSet, ContextEntryViewSet, SubtaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'contexts', ContextEntryViewSet)
router.register(r'subtasks', SubtaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

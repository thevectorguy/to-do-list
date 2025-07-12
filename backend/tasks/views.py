from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Task, Category, ContextEntry, Subtask
from .serializers import (
    TaskSerializer, TaskCreateSerializer, CategorySerializer, 
    ContextEntrySerializer, AITaskSuggestionSerializer, SubtaskSerializer
)


class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for managing tasks with filtering and search"""
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'category', 'ai_enhanced']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['priority', 'deadline', 'created_at', 'updated_at']
    ordering = ['-priority', 'deadline']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TaskCreateSerializer
        return TaskSerializer
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get all overdue tasks"""
        from django.utils import timezone
        overdue_tasks = self.queryset.filter(
            deadline__lt=timezone.now(),
            status__in=['todo', 'in_progress']
        )
        serializer = self.get_serializer(overdue_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def high_priority(self, request):
        """Get high priority tasks"""
        high_priority_tasks = self.queryset.filter(priority__gte=75)
        serializer = self.get_serializer(high_priority_tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get task statistics"""
        from django.utils import timezone
        total_tasks = self.queryset.count()
        completed_tasks = self.queryset.filter(status='done').count()
        pending_tasks = self.queryset.filter(status__in=['todo', 'in_progress']).count()
        overdue_tasks = self.queryset.filter(
            deadline__lt=timezone.now(),
            status__in=['todo', 'in_progress']
        ).count()
        
        return Response({
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'overdue_tasks': overdue_tasks,
            'completion_rate': round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 2)
        })


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing task categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most used categories"""
        popular_categories = self.queryset.filter(usage_count__gt=0)[:10]
        serializer = self.get_serializer(popular_categories, many=True)
        return Response(serializer.data)


class ContextEntryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing daily context entries"""
    queryset = ContextEntry.objects.all()
    serializer_class = ContextEntrySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['source', 'processed']
    search_fields = ['content']
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent context entries for AI processing"""
        limit = request.query_params.get('limit', 10)
        recent_entries = self.queryset[:int(limit)]
        serializer = self.get_serializer(recent_entries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Create multiple context entries at once"""
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubtaskViewSet(viewsets.ModelViewSet):
    """ViewSet for managing subtasks"""
    queryset = Subtask.objects.all()
    serializer_class = SubtaskSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['task', 'completed']
    ordering_fields = ['order', 'created_at']
    ordering = ['order', 'created_at']

    @action(detail=True, methods=['patch'])
    def toggle_completed(self, request, pk=None):
        """Toggle subtask completion status"""
        subtask = self.get_object()
        subtask.completed = not subtask.completed
        subtask.save()
        serializer = self.get_serializer(subtask)
        return Response(serializer.data)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from tasks.models import Task, Category, ContextEntry
from tasks.serializers import AITaskSuggestionSerializer
from .ai_processor import ai_processor
import json


@api_view(['POST'])
def get_ai_suggestions(request):
    """
    Get AI-powered task suggestions including priority, deadline, categories, and enhanced description
    
    Expected payload:
    {
        "task_data": {
            "title": "Task title",
            "description": "Task description",
            "priority": 0,
            "deadline": null
        },
        "context_limit": 10,
        "include_categories": true,
        "user_preferences": {}
    }
    """
    serializer = AITaskSuggestionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    task_data = data.get('task_data', {})
    context_limit = data.get('context_limit', 10)
    include_categories = data.get('include_categories', True)
    
    try:
        # Get recent context entries
        recent_contexts = ContextEntry.objects.all()[:context_limit]
        context_entries = [
            {
                'content': entry.content,
                'source': entry.source,
                'created_at': entry.created_at.isoformat()
            }
            for entry in recent_contexts
        ]
        
        # Analyze context
        context_analysis = ai_processor.analyze_context(context_entries)
        
        # Get existing categories if requested
        existing_categories = []
        if include_categories:
            existing_categories = list(Category.objects.values_list('name', flat=True))
        
        # Generate AI suggestions
        suggestions = {}
        
        if task_data:
            # Priority suggestion
            suggested_priority = ai_processor.suggest_task_priority(task_data, context_analysis)
            suggestions['priority'] = suggested_priority
            
            # Deadline suggestion
            suggested_deadline = ai_processor.suggest_deadline(task_data, context_analysis)
            suggestions['deadline'] = suggested_deadline
            
            # Category and tags suggestion
            category_tags = ai_processor.suggest_categories_and_tags(task_data, existing_categories)
            suggestions['category'] = category_tags['category']
            suggestions['tags'] = category_tags['tags']
            
            # Enhanced description
            enhanced_description = ai_processor.enhance_task_description(task_data, context_analysis)
            suggestions['enhanced_description'] = enhanced_description
        
        return Response({
            'context_analysis': context_analysis,
            'suggestions': suggestions,
            'existing_categories': existing_categories,
            'context_entries_used': len(context_entries)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'AI processing failed: {str(e)}',
            'fallback_suggestions': {
                'priority': task_data.get('priority', 50),
                'category': 'General',
                'tags': ['task'],
                'enhanced_description': task_data.get('description', '')
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def analyze_context_batch(request):
    """
    Analyze multiple context entries and return insights
    
    Expected payload:
    {
        "context_entries": [
            {"content": "...", "source": "email"},
            {"content": "...", "source": "whatsapp"}
        ]
    }
    """
    context_entries = request.data.get('context_entries', [])
    
    if not context_entries:
        return Response({
            'error': 'No context entries provided'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        analysis = ai_processor.analyze_context(context_entries)
        
        return Response({
            'analysis': analysis,
            'entries_processed': len(context_entries)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Context analysis failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def enhance_existing_task(request, task_id):
    """
    Enhance an existing task with AI suggestions
    """
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response({
            'error': 'Task not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    try:
        # Get recent context
        recent_contexts = ContextEntry.objects.all()[:10]
        context_entries = [
            {
                'content': entry.content,
                'source': entry.source,
                'created_at': entry.created_at.isoformat()
            }
            for entry in recent_contexts
        ]
        
        context_analysis = ai_processor.analyze_context(context_entries)
        
        task_data = {
            'title': task.title,
            'description': task.description,
            'priority': task.priority,
            'deadline': task.deadline.isoformat() if task.deadline else None
        }
        
        # Generate suggestions
        suggested_priority = ai_processor.suggest_task_priority(task_data, context_analysis)
        enhanced_description = ai_processor.enhance_task_description(task_data, context_analysis)
        
        # Update task if requested
        if request.data.get('apply_suggestions', False):
            if not task.ai_enhanced:
                task.original_description = task.description
            
            task.priority = suggested_priority
            task.description = enhanced_description
            task.ai_enhanced = True
            task.save()
        
        return Response({
            'task_id': task_id,
            'suggestions': {
                'priority': suggested_priority,
                'enhanced_description': enhanced_description
            },
            'applied': request.data.get('apply_suggestions', False),
            'context_analysis': context_analysis
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Task enhancement failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def ai_health_check(request):
    """Check AI service health and configuration"""
    health_status = {
        'openai_configured': bool(ai_processor.openai_api_key),
        'local_llm_configured': bool(ai_processor.local_llm_url),
        'status': 'healthy'
    }
    
    # Test AI connection
    try:
        test_messages = [
            {'role': 'user', 'content': 'Hello, this is a test. Please respond with "OK".'}
        ]
        response = ai_processor._make_ai_request(test_messages)
        health_status['ai_responsive'] = True
        health_status['test_response'] = response[:100]  # First 100 chars
    except Exception as e:
        health_status['ai_responsive'] = False
        health_status['error'] = str(e)
        health_status['status'] = 'degraded'
    
    return Response(health_status)

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
        
        # Analyze context (this should always work with fallback)
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
        
        # Determine if we used AI or fallback
        ai_status = 'fallback' if ai_processor.rate_limited else 'success'
        message = 'Smart fallback suggestions generated' if ai_processor.rate_limited else 'AI suggestions generated successfully'
        
        return Response({
            'context_analysis': context_analysis,
            'suggestions': suggestions,
            'existing_categories': existing_categories,
            'context_entries_used': len(context_entries),
            'ai_status': ai_status,
            'message': message
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        error_msg = str(e)
        
        # Provide user-friendly error messages
        if "rate limit" in error_msg.lower() or "429" in error_msg:
            user_error = "AI service is temporarily busy. Using smart fallback suggestions."
            status_code = status.HTTP_200_OK  # Still return suggestions, just not AI-powered
        elif "timeout" in error_msg.lower():
            user_error = "AI service timeout. Using smart fallback suggestions."
            status_code = status.HTTP_200_OK
        else:
            user_error = "AI service unavailable. Using smart fallback suggestions."
            status_code = status.HTTP_200_OK
        
        # Ensure we have basic variables even if the try block failed early
        if 'context_analysis' not in locals():
            context_analysis = {'summary': 'No context available', 'key_themes': [], 'urgency_indicators': [], 'time_constraints': [], 'mood_tone': 'neutral'}
        if 'existing_categories' not in locals():
            existing_categories = list(Category.objects.values_list('name', flat=True)) if include_categories else []
        if 'context_entries' not in locals():
            context_entries = []
        
        # Generate smart fallback suggestions
        fallback_suggestions = {}
        if task_data:
            # Use the AI processor's fallback methods
            fallback_suggestions['priority'] = ai_processor.suggest_task_priority(task_data, context_analysis)
            category_tags = ai_processor.suggest_categories_and_tags(task_data, existing_categories)
            fallback_suggestions['category'] = category_tags['category']
            fallback_suggestions['tags'] = category_tags['tags']
            fallback_suggestions['enhanced_description'] = ai_processor.enhance_task_description(task_data, context_analysis)
            fallback_suggestions['deadline'] = None  # No smart deadline fallback
        
        return Response({
            'context_analysis': context_analysis,
            'suggestions': fallback_suggestions,
            'existing_categories': existing_categories,
            'context_entries_used': len(context_entries),
            'ai_status': 'fallback',
            'message': user_error
        }, status=status_code)


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
    """Check AI service health and configuration by actually testing connectivity"""
    import requests
    
    health_status = {
        'openai_api_key_present': bool(ai_processor.openai_api_key),
        'status': 'healthy'
    }
    
    # Test OpenAI connection
    openai_working = False
    openai_error = None
    try:
        if ai_processor.openai_client and ai_processor.openai_api_key:
            test_messages = [
                {'role': 'user', 'content': 'Hello, this is a test. Please respond with "OK".'}
            ]
            response = ai_processor._call_openai(test_messages)
            openai_working = True
            health_status['openai_test_response'] = response[:100]  # First 100 chars
        else:
            if not ai_processor.openai_api_key:
                openai_error = "OpenAI API key not configured"
            else:
                openai_error = "OpenAI client failed to initialize"
    except Exception as e:
        openai_error = f"OpenAI connection failed: {str(e)}"
    
    health_status['openai_configured'] = openai_working
    if openai_error:
        health_status['openai_error'] = openai_error
    
    # Test Local LLM connection (only if URL is configured and not default)
    local_llm_working = False
    local_llm_error = None
    if (ai_processor.local_llm_url and 
        ai_processor.local_llm_url.strip() and 
        ai_processor.local_llm_url != 'http://127.0.0.1:1234/v1/chat/completions'):  # Skip default placeholder
        try:
            # Test if the local LLM endpoint is reachable
            test_url = ai_processor.local_llm_url.replace('/v1/chat/completions', '/v1/models')
            response = requests.get(test_url, timeout=3)
            if response.status_code == 200:
                local_llm_working = True
            else:
                local_llm_error = f"Local LLM returned status {response.status_code}"
        except requests.exceptions.ConnectionError:
            local_llm_error = "Local LLM endpoint not reachable"
        except requests.exceptions.Timeout:
            local_llm_error = "Local LLM endpoint timeout"
        except Exception as e:
            local_llm_error = f"Local LLM test failed: {str(e)}"
    else:
        local_llm_error = "Local LLM not configured (using default placeholder)"
    
    health_status['local_llm_configured'] = local_llm_working
    if local_llm_error:
        health_status['local_llm_error'] = local_llm_error
    
    # Overall AI responsiveness
    health_status['ai_responsive'] = openai_working or local_llm_working
    
    # Overall status
    if not openai_working and not local_llm_working:
        health_status['status'] = 'degraded'
        health_status['error'] = "No AI services are working"
    elif openai_working:
        health_status['test_response'] = health_status.get('openai_test_response', 'OK')
    
    return Response(health_status)

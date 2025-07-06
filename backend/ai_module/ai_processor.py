import os
import json
import requests
import backoff
from datetime import datetime, timedelta
from django.conf import settings
from typing import Dict, List, Optional, Any
import openai


class AIProcessor:
    """AI processing module for task management with OpenAI and local LLM support"""
    
    def __init__(self):
        self.openai_api_key = getattr(settings, 'OPENAI_API_KEY', '')
        self.local_llm_url = getattr(settings, 'LOCAL_LLM_URL', '')
        self.model = 'gpt-3.5-turbo'
        self.openai_client = openai.OpenAI(api_key=self.openai_api_key) if self.openai_api_key else None
    
    @backoff.on_exception(backoff.expo, Exception, max_tries=3, max_time=60)
    def _call_openai(self, messages: List[Dict]) -> str:
        """Call OpenAI API with retry logic using the new openai>=1.0.0 client"""
        if not self.openai_api_key or not self.openai_client:
            raise ValueError("OpenAI API key not configured")
        response = self.openai_client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=1000
        )
        return response.choices[0].message.content
    
    @backoff.on_exception(backoff.expo, Exception, max_tries=3, max_time=60)
    def _call_local_llm(self, messages: List[Dict]) -> str:
        """Call local LLM (LM Studio) with retry logic"""
        if not self.local_llm_url:
            raise ValueError("Local LLM URL not configured")
        
        data = {
            'messages': messages,
            'temperature': 0.7,
            'max_tokens': 1000
        }
        
        response = requests.post(
            self.local_llm_url,
            json=data,
            timeout=30
        )
        response.raise_for_status()
        
        result = response.json()
        return result['choices'][0]['message']['content']
    
    def _make_ai_request(self, messages: List[Dict]) -> str:
        """Make AI request with fallback from OpenAI to local LLM"""
        try:
            if self.openai_api_key:
                return self._call_openai(messages)
            elif self.local_llm_url:
                return self._call_local_llm(messages)
            else:
                raise ValueError("No AI backend configured. Please set OPENAI_API_KEY or LOCAL_LLM_URL")
        except Exception as e:
            # Try fallback if primary method fails
            if self.openai_api_key and self.local_llm_url:
                try:
                    return self._call_local_llm(messages)
                except:
                    pass
            raise e
    
    def analyze_context(self, context_entries: List[Dict]) -> Dict[str, Any]:
        """Analyze daily context entries to extract insights"""
        if not context_entries:
            return {'summary': 'No context available', 'key_themes': [], 'urgency_indicators': []}
        
        context_text = "\n".join([
            f"[{entry.get('source', 'unknown')}] {entry.get('content', '')}"
            for entry in context_entries
        ])
        
        messages = [
            {
                'role': 'system',
                'content': '''You are an AI assistant that analyzes daily context to help with task management. 
                Analyze the provided context and return a JSON response with:
                - summary: Brief summary of the context
                - key_themes: List of main themes/topics
                - urgency_indicators: List of urgent items mentioned
                - time_constraints: Any mentioned deadlines or time-sensitive items
                - mood_tone: Overall mood/tone (positive, neutral, stressed, etc.)'''
            },
            {
                'role': 'user',
                'content': f"Analyze this daily context:\n\n{context_text}"
            }
        ]
        
        try:
            response = self._make_ai_request(messages)
            # Try to parse as JSON, fallback to structured text
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                return {
                    'summary': response,
                    'key_themes': [],
                    'urgency_indicators': [],
                    'time_constraints': [],
                    'mood_tone': 'neutral'
                }
        except Exception as e:
            return {
                'summary': f'Error analyzing context: {str(e)}',
                'key_themes': [],
                'urgency_indicators': [],
                'time_constraints': [],
                'mood_tone': 'neutral'
            }
    
    def suggest_task_priority(self, task_data: Dict, context_analysis: Dict) -> int:
        """Suggest task priority based on task details and context"""
        messages = [
            {
                'role': 'system',
                'content': '''You are an AI assistant that helps prioritize tasks. 
                Based on the task details and context analysis, suggest a priority score from 0-100:
                - 0-25: Low priority
                - 26-50: Medium-Low priority  
                - 51-75: Medium-High priority
                - 76-100: High priority
                
                Consider factors like deadlines, urgency indicators from context, task complexity, and dependencies.
                Return only the numeric priority score.'''
            },
            {
                'role': 'user',
                'content': f"""Task: {task_data.get('title', '')}
                Description: {task_data.get('description', '')}
                Current Priority: {task_data.get('priority', 0)}
                Deadline: {task_data.get('deadline', 'None')}
                
                Context Analysis: {json.dumps(context_analysis, indent=2)}
                
                What priority score (0-100) would you assign?"""
            }
        ]
        
        try:
            response = self._make_ai_request(messages)
            # Extract numeric value from response
            import re
            numbers = re.findall(r'\d+', response)
            if numbers:
                priority = int(numbers[0])
                return max(0, min(100, priority))  # Clamp between 0-100
            return task_data.get('priority', 0)  # Return original if parsing fails
        except Exception:
            return task_data.get('priority', 0)
    
    def suggest_deadline(self, task_data: Dict, context_analysis: Dict) -> Optional[str]:
        """Suggest realistic deadline for a task"""
        messages = [
            {
                'role': 'system',
                'content': '''You are an AI assistant that suggests realistic deadlines for tasks.
                Based on the task details and context, suggest a deadline in ISO format (YYYY-MM-DDTHH:MM:SS).
                Consider task complexity, current workload indicators from context, and any mentioned time constraints.
                If no specific deadline can be determined, return "flexible".'''
            },
            {
                'role': 'user',
                'content': f"""Task: {task_data.get('title', '')}
                Description: {task_data.get('description', '')}
                Current Deadline: {task_data.get('deadline', 'None')}
                
                Context Analysis: {json.dumps(context_analysis, indent=2)}
                
                What would be a realistic deadline for this task?"""
            }
        ]
        
        try:
            response = self._make_ai_request(messages)
            if 'flexible' in response.lower() or 'no deadline' in response.lower():
                return None
            
            # Try to extract ISO date from response
            import re
            iso_pattern = r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}'
            matches = re.findall(iso_pattern, response)
            if matches:
                return matches[0]
            
            # Try to extract date and add default time
            date_pattern = r'\d{4}-\d{2}-\d{2}'
            matches = re.findall(date_pattern, response)
            if matches:
                return f"{matches[0]}T17:00:00"  # Default to 5 PM
            
            return None
        except Exception:
            return None
    
    def suggest_categories_and_tags(self, task_data: Dict, existing_categories: List[str]) -> Dict[str, List[str]]:
        """Suggest categories and tags for a task"""
        messages = [
            {
                'role': 'system',
                'content': f'''You are an AI assistant that categorizes tasks and suggests tags.
                Based on the task details, suggest:
                1. A category from existing ones or propose a new one
                2. Up to 5 relevant tags
                
                Existing categories: {', '.join(existing_categories) if existing_categories else 'None'}
                
                Return response as JSON with "category" and "tags" fields.'''
            },
            {
                'role': 'user',
                'content': f"""Task: {task_data.get('title', '')}
                Description: {task_data.get('description', '')}
                
                Suggest category and tags for this task."""
            }
        ]
        
        try:
            response = self._make_ai_request(messages)
            try:
                result = json.loads(response)
                return {
                    'category': result.get('category', ''),
                    'tags': result.get('tags', [])[:5]  # Limit to 5 tags
                }
            except json.JSONDecodeError:
                # Fallback parsing
                lines = response.split('\n')
                category = ''
                tags = []
                
                for line in lines:
                    if 'category' in line.lower():
                        category = line.split(':')[-1].strip()
                    elif 'tag' in line.lower():
                        tags.extend([tag.strip() for tag in line.split(':')[-1].split(',')])
                
                return {'category': category, 'tags': tags[:5]}
        except Exception:
            return {'category': '', 'tags': []}
    
    def enhance_task_description(self, task_data: Dict, context_analysis: Dict) -> str:
        """Enhance task description with context-aware details"""
        messages = [
            {
                'role': 'system',
                'content': '''You are an AI assistant that enhances task descriptions.
                Based on the original task and context analysis, provide an enhanced description that:
                1. Clarifies the task objective
                2. Adds relevant context from the analysis
                3. Suggests potential steps or considerations
                4. Keeps it concise but informative
                
                Return only the enhanced description text.'''
            },
            {
                'role': 'user',
                'content': f"""Original Task: {task_data.get('title', '')}
                Original Description: {task_data.get('description', '')}
                
                Context Analysis: {json.dumps(context_analysis, indent=2)}
                
                Provide an enhanced description for this task."""
            }
        ]
        
        try:
            response = self._make_ai_request(messages)
            return response.strip()
        except Exception:
            return task_data.get('description', '')


# Global instance
ai_processor = AIProcessor()

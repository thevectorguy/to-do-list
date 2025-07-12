from rest_framework import serializers
from .models import Task, Category, ContextEntry, Subtask


class CategorySerializer(serializers.ModelSerializer):
    task_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'usage_count', 'task_count', 'created_at']
    
    def get_task_count(self, obj):
        return obj.tasks.count()

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'title', 'completed', 'order', 'created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    priority_label = serializers.CharField(read_only=True)
    is_overdue = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'category_name',
            'priority', 'priority_label', 'deadline', 'status', 'tags',
            'ai_enhanced', 'original_description', 'is_overdue',
            'created_at', 'updated_at'
        ]
    
    def create(self, validated_data):
        # Increment category usage count
        category = validated_data.get('category')
        if category:
            category.usage_count += 1
            category.save()
        return super().create(validated_data)


class TaskCreateSerializer(serializers.ModelSerializer):
    """Simplified serializer for task creation with AI suggestions"""
    category_name = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Task
        fields = [
            'title', 'description', 'category_name', 'priority', 
            'deadline', 'status', 'tags'
        ]
    
    def create(self, validated_data):
        category_name = validated_data.pop('category_name', None)
        if category_name:
            category, created = Category.objects.get_or_create(name=category_name)
            validated_data['category'] = category
        return Task.objects.create(**validated_data)


class ContextEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextEntry
        fields = [
            'id', 'content', 'source', 'insights', 'processed', 'created_at'
        ]


class AITaskSuggestionSerializer(serializers.Serializer):
    """Serializer for AI task suggestion requests"""
    task_data = serializers.DictField(required=False)
    context_limit = serializers.IntegerField(default=10, min_value=1, max_value=50)
    include_categories = serializers.BooleanField(default=True)
    user_preferences = serializers.DictField(required=False)

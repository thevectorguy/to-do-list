from django.contrib import admin
from .models import Task, Category, ContextEntry, Subtask


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'usage_count', 'created_at']
    search_fields = ['name']
    readonly_fields = ['usage_count', 'created_at']

class SubtaskInline(admin.TabularInline):
    model = Subtask
    extra = 0
    fields = ['title', 'completed', 'order']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'status', 'deadline', 'created_at']
    list_filter = ['status', 'priority', 'category', 'ai_enhanced', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    inlines = [SubtaskInline]


@admin.register(Subtask)
class SubtaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'task', 'completed', 'order', 'created_at']
    list_filter = ['completed', 'created_at']
    search_fields = ['title', 'task__title']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(ContextEntry)
class ContextEntryAdmin(admin.ModelAdmin):
    list_display = ['source', 'content_preview', 'processed', 'created_at']
    list_filter = ['source', 'processed', 'created_at']
    search_fields = ['content']
    readonly_fields = ['created_at']
    
    def content_preview(self, obj):
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Content Preview'

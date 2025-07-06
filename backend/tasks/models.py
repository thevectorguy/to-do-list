from django.db import models
from django.utils import timezone


class Category(models.Model):
    """Task categories for organization"""
    name = models.CharField(max_length=50, unique=True)
    usage_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['-usage_count', 'name']
    
    def __str__(self):
        return self.name


class Task(models.Model):
    """Main task model with AI-enhanced features"""
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]
    
    PRIORITY_CHOICES = [
        (0, 'Low'),
        (25, 'Medium-Low'),
        (50, 'Medium'),
        (75, 'Medium-High'),
        (100, 'High'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='tasks'
    )
    priority = models.IntegerField(default=0, choices=PRIORITY_CHOICES)
    deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    tags = models.JSONField(default=list, blank=True)
    ai_enhanced = models.BooleanField(default=False)
    original_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-priority', 'deadline', '-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def is_overdue(self):
        if self.deadline and self.status != 'done':
            return timezone.now() > self.deadline
        return False
    
    @property
    def priority_label(self):
        return dict(self.PRIORITY_CHOICES).get(self.priority, 'Unknown')


class ContextEntry(models.Model):
    """Daily context entries for AI processing"""
    SOURCE_CHOICES = [
        ('email', 'Email'),
        ('whatsapp', 'WhatsApp'),
        ('note', 'Note'),
        ('meeting', 'Meeting'),
        ('other', 'Other'),
    ]
    
    content = models.TextField()
    source = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    insights = models.JSONField(null=True, blank=True)
    processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Context Entries"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.source}: {self.content[:50]}..."

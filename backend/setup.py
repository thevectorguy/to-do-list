#!/usr/bin/env python3
"""
Setup script for Smart Todo List backend
"""

import os
import sys
import subprocess
import django
from django.core.management import execute_from_command_line

def setup_backend():
    """Setup the Django backend"""
    print("🚀 Setting up Smart Todo List Backend...")
    
    # Set Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_todo.settings')
    
    try:
        # Initialize Django
        django.setup()
        
        print("📦 Creating database migrations...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        
        print("🗄️ Applying database migrations...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("✅ Backend setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Create a superuser: python manage.py createsuperuser")
        print("2. Start the server: python manage.py runserver")
        print("3. Visit http://localhost:8000/admin to access admin panel")
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    setup_backend()

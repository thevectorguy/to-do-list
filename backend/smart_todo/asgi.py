"""
ASGI config for smart_todo project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_todo.settings')

application = get_asgi_application()

#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection
from io import StringIO
from django.core.management import call_command

print("=" * 60)
print("Testing Database Connection and Generating Models")
print("=" * 60)

# Test connection
print("\n1. Checking database tables...")
try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
        tables = cursor.fetchall()
        if tables:
            print(f"   Found {len(tables)} tables:")
            for table in tables:
                print(f"     - {table[0]}")
        else:
            print("   No tables found!")
except Exception as e:
    print(f"   ERROR: {e}")
    sys.exit(1)

# Run inspectdb
print("\n2. Running inspectdb command...")
try:
    out = StringIO()
    call_command('inspectdb', stdout=out)
    output = out.getvalue()
    print(f"   Generated {len(output)} characters of models")
    
    # Write to workspace models
    print("\n3. Saving models to workspace/models.py...")
    with open('workspace/models.py', 'w') as f:
        f.write(output)
    print("   ✓ Models saved successfully!")
    
    # Show first few lines
    print("\n4. Preview of generated models:")
    lines = output.split('\n')[:20]
    for line in lines:
        print(f"   {line}")
    
except Exception as e:
    print(f"   ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n" + "=" * 60)
print("NEXT STEPS:")
print("=" * 60)
print("1. Register models in workspace/admin.py")
print("2. Run: python manage.py runserver")
print("=" * 60)

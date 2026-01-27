from django.http import JsonResponse
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt 
from django.db import connection
import hashlib

def ping(request):
    return JsonResponse({'status':"okay"})


@csrf_exempt
def login_view(request):
    if request.method!="POST":
        return JsonResponse({"error":"POST only"},status=405)

    body=json.loads(request.body)
    username=body.get("username")
    password=body.get("password")

    hashed_password=hashlib.sha256(password.encode()).hexdigest()

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM Users where username=%s and password=%s"
        ,[username,hashed_password])

        row=cursor.fetchone()

        if row:
            return JsonResponse({"success":True,"user_id":row[0]})
        else:
             return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

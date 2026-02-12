from django.http import JsonResponse
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt 
from django.db import connection
import hashlib
import jwt,datetime
from django.conf import settings

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
            payload={"user_id":row[0],
                     "exp":datetime.datetime.utcnow()+datetime.timedelta(hours=2),
                     "iat":datetime.datetime.utcnow()
                     }
            token=jwt.encode(payload,settings.SECRET_KEY,algorithm="HS256")
            print(token)
            return JsonResponse({
                                "success": True,
                                "token": token
                                })
        else:
             return JsonResponse({"success": False, "message": "Invalid credentials"}, status=401)

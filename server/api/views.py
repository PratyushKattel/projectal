from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import connection
from .serializers import RegisterSerializers,LoginSerializer
from .utils import hash_password,compare_password
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterApi(APIView):

    def post(self,request):
        serializer= RegisterSerializers(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

        name = serializer.validated_data['name']
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        hashed_pass = hash_password(password)

        print(f" after serializers and all got the data {name}, {email} and org pass is {password} and hashed one is {hashed_pass}")

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                            INSERT INTO users (name, email, password)
                            VALUES (%s, %s, %s)
                            RETURNING id;
                        """, [name, email, hashed_pass])
                
                user_id = cursor.fetchone()[0]
                
            return Response({
                'message': 'User registered successfully',
                'user_id':user_id
            }, status=status.HTTP_201_CREATED)

        except Exception:
            return Response({
                "error": "Email already exists",
            }, status=status.HTTP_400_BAD_REQUEST)


class LoginApi(APIView):

    def post(self,request):

        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, name, password
                FROM users
                WHERE email = %s;
            """, [email])

            user = cursor.fetchone()

        if not user:
            return Response({
                "error": "Invalid email or password"
            }, status=status.HTTP_401_UNAUTHORIZED)

        user_id, name, hashed_password = user

        if not compare_password(password, hashed_password):
            return Response({
                "error": "Invalid email or password"
            }, status=status.HTTP_401_UNAUTHORIZED)


        user,created = User.objects.get_or_create(
            username=email,
            defaults={"email":email}
        )

        refresh = RefreshToken.for_user(user)

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            "message":"Login Successful",
            "user":{
                "id":user_id,
                "name":name,
                "email":email
            }
        },status=status.HTTP_200_OK)

        response.set_cookie(key="access",
                            value=access_token,
                            httponly=True,
                            secure=False, #true in prod
                            samesite="Lax"
        )

        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            secure=False, 
            samesite="Lax"
        )

        return response

class ProfileView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        return Response({
                'message': 'Hello, this is protected',
                'user_id': request.user.id
            })

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializers,LoginSerializer
from django.contrib.auth import authenticate
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

        if User.objects.filter(email=email).exists():
            return Response({
                "error":"email already exists"
            },status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
                    username=email,
                    email=email,
                    first_name=name
                )

        user.set_password(password)
        user.save()

        return Response({
                'message': 'User registered successfully',
                'user_id':user.id
            }, status=status.HTTP_201_CREATED)


class LoginApi(APIView):

    permission_classes = []
    authentication_classes = []

    def post(self,request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(username=email,password=password)

        if not user:
            return Response({"error":"invalid email or password"},status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response(
            {
                "message": "Login Successful",
                "user": {
                    "id": user.id,
                    "name": user.first_name,
                    "email": user.email
                }
            },
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=False,
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
            "message": "Hello, this is protected",
            "user": {
                "id":request.user.id,
                "email":request.user.email,
                "name":request.user.first_name
            }
        })
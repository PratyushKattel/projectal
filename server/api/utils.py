from django.contrib.auth.hashers import make_password,check_password
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework.response import Response
from rest_framework import status

def hash_password(password):
    return make_password(password)

def compare_password(password,hashedpassword):
    return check_password(password,hashedpassword)



class CookieTokenRefreshView(TokenRefreshView):
    
    def post(self,request,*args,**kwargs):
        refresh = request.COOKIES.get("refresh")

        if not refresh:
            return Response({
               "error" :"refresh token not found",
            },status=status.HTTP_401_UNAUTHORIZED)

        serializer = TokenRefreshSerializer(data={"refresh": refresh})
       
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        access_token = serializer.validated_data["access"]

        response = Response({"message": "token refreshed"})

        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax"
        )

        return response





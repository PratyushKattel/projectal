from django.urls import path
from .views import RegisterApi,LoginApi,ProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # path('ping/',ping),
    # path('login/',login_view)
    path("register/",RegisterApi.as_view(),name="register"),
    path("login/",LoginApi.as_view(),name="login"),
    path("profile/",ProfileView.as_view(),name="profile"),
    path("token/refresh",TokenRefreshView.as_view(),name="token_refresh")
]

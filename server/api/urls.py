from django.urls import path
from .views import *

urlpatterns = [
    path('ping/',ping),
    path('login/',login_view)
]

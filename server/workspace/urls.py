from django.urls import path
from .views import WorkSpaceApi 

# apis for workspace + members + roles
urlpatterns = [
    path("workspaces/",WorkSpaceApi.as_view(),name="workspace_api"),
]

from django.urls import path
from .views import WorkSpaceApi,WorkSpaceDetailsApi

# apis for workspace + members + roles
urlpatterns = [
    path("workspaces/",WorkSpaceApi.as_view(),name="workspace_api"),
    path("workspaces/<int:ws_id>/",WorkSpaceDetailsApi.as_view(),name="workspace_api")
]

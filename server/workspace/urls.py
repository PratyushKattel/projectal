from django.urls import path
from .views import WorkSpaceApi,WorkSpaceDetailsApi
from .invitationviews import invite_page,AcceptInviteApi,WorkspaceMemberInviteApi
from .memberviews import WorkSpaceMemberView, WorkSpaceMemberListApi

# apis for workspace + members + roles
urlpatterns = [
    path("workspaces/",WorkSpaceApi.as_view(),name="workspace_api"),
    path("workspaces/<int:ws_id>/",WorkSpaceDetailsApi.as_view(),name="workspace_api"),

    #adding the member into workspace
    path("workspaces/<int:ws_id>/members/invite/",WorkspaceMemberInviteApi.as_view(),name="workspace_member_apis"),
    path("invite/<uuid:token>/", invite_page),
    path("invite/<uuid:token>/accept/",AcceptInviteApi.as_view()),

    #updating and deleting members from workspace 
    path("workspaces/<int:ws_id>/members/<int:user_id>/",WorkSpaceMemberView.as_view(),name="workspace_api"),
    path("workspaces/<int:ws_id>/members/", WorkSpaceMemberListApi.as_view(),name="workspace_member_list_api"),

    # GET /api/workspaces/{ws_id}/roles/ — List all roles defined in the workspace
    # POST /api/workspaces/{ws_id}/roles/ — Create a custom role
    # DELETE /api/workspaces/{ws_id}/roles/{role_id}/ — Delete a role
]

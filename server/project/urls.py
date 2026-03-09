from django.urls import path
from .views import ProjectAPI,ProjectWorkspaceAPI
from .taskview import TaskListCreateApi,TaskDetailApi

urlpatterns = [
    path("workspaces/<int:ws_id>/projects",ProjectWorkspaceAPI.as_view(),name="project_workspace_apis"),
    path("workspaces/projects/<int:proj_id>",ProjectAPI.as_view(),name="project_apis"),
    path("projects/<int:proj_id>/tasks",TaskListCreateApi.as_view(),name="taskcreateapis"),
    path("tasks/<int:task_id>/",TaskDetailApi.as_view(),name="taskdetailapis")
]
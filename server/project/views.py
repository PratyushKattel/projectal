from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import connection,transaction
from rest_framework import status
from .serializer import ProjectBody


class ProjectWorkspaceAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, ws_id):
        serializer = ProjectBody(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        name = validated_data.get("name")
        description = validated_data.get("description", "")

        user_id = request.user.id

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT ws_id FROM workspace 
                        WHERE ws_id = %s
                    """, [ws_id])
                    workspace = cursor.fetchone()
                    if not workspace:
                        return Response({"error": "Workspace not found"}, status=status.HTTP_404_NOT_FOUND)

                    cursor.execute("""
                        INSERT INTO projects (ws_id, created_by, name, description)
                        VALUES (%s, %s, %s, %s)
                        RETURNING proj_id, created_at;
                    """, [ws_id, user_id, name, description])

                    proj_row = cursor.fetchone()
                    proj_id = proj_row[0]
                    created_at = proj_row[1]

                return Response({
                    "message": "Project created successfully",
                    "proj_id": proj_id,
                    "name": name,
                    "description": description,
                    "created_at": created_at
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, ws_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT ws_id FROM workspace WHERE ws_id = %s
                """, [ws_id])
                workspace = cursor.fetchone()
                if not workspace:
                    return Response({"error": "Workspace not found"}, status=status.HTTP_404_NOT_FOUND)

                cursor.execute("""
                    SELECT proj_id, name, description, created_by, created_at
                    FROM projects
                    WHERE ws_id = %s
                    ORDER BY created_at DESC
                """, [ws_id])

                projects = [
                    {
                        "proj_id": row[0],
                        "name": row[1],
                        "description": row[2],
                        "created_by": row[3],
                        "created_at": row[4],
                    } 
                    for row in cursor.fetchall()
                ]

            return Response({"projects": projects}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 
            

class ProjectAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, proj_id):
        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT proj_id, ws_id, name, description, created_by, created_at
                    FROM projects
                    WHERE proj_id = %s
                """, [proj_id])
                project = cursor.fetchone()
                if not project:
                    return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

                proj_data = {
                    "proj_id": project[0],
                    "ws_id": project[1],
                    "name": project[2],
                    "description": project[3],
                    "created_by": project[4],
                    "created_at": project[5],
                }

                cursor.execute("""
                    SELECT task_id, title, status, priority, assigned_to, created_by, created_at, due_date
                    FROM tasks
                    WHERE proj_id = %s
                    ORDER BY created_at DESC
                """, [proj_id])

                tasks = [
                    {
                        "task_id": row[0],
                        "title": row[1],
                        "status": row[2],
                        "priority": row[3],
                        "assigned_to": row[4],
                        "created_by": row[5],
                        "created_at": row[6],
                        "due_date": row[7],
                    }
                    for row in cursor.fetchall()
                ]

            proj_data["tasks"] = tasks
            return Response({"project": proj_data}, status=status.HTTP_200_OK)

        except Exception as e:
             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, proj_id):
        serializer = ProjectBody(data=request.data, partial=True)  # partial=True allows partial updates
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        name = validated_data.get("name")
        description = validated_data.get("description")

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT proj_id, ws_id FROM projects WHERE proj_id = %s
                    """, [proj_id])
                    project = cursor.fetchone()
                    if not project:
                        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

                    fields = []
                    values = []

                    if name is not None:
                        fields.append("name = %s")
                        values.append(name)
                    if description is not None:
                        fields.append("description = %s")
                        values.append(description)

                    if not fields:
                        return Response({"error": "No fields provided for update"}, status=status.HTTP_400_BAD_REQUEST)

                    values.append(proj_id)
                    sql = f"UPDATE projects SET {', '.join(fields)} WHERE proj_id = %s RETURNING proj_id, name, description;"
                    cursor.execute(sql, values)
                    updated_project = cursor.fetchone()

            return Response({
                "message": "Project updated successfully",
                "proj_id": updated_project[0],
                "name": updated_project[1],
                "description": updated_project[2]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, proj_id):
        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("SELECT proj_id FROM projects WHERE proj_id = %s", [proj_id])
                    project = cursor.fetchone()
                    if not project:
                        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

                    cursor.execute("DELETE FROM projects WHERE proj_id = %s", [proj_id])

            return Response({"message": "Project deleted successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST) 

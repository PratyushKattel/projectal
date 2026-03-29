from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import connection,transaction
from rest_framework import status
from .serializer import ProjectBody,TaskBody

class TaskListCreateApi(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, proj_id):
        serializer = TaskBody(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        title = validated_data.get("title")
        description = validated_data.get("description", "")
        status_value = validated_data.get("status", "Todo")
        priority = validated_data.get("priority", "Medium")
        assigned_to = validated_data.get("assigned_to")
        due_date = validated_data.get("due_date")

        user_id = request.user.id

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT r.name, w.owner_id
                        FROM projects p
                        JOIN workspace w ON p.ws_id = w.ws_id
                        LEFT JOIN ws_member m ON w.ws_id = m.ws_id
                        LEFT JOIN role r ON m.role_id = r.role_id
                        WHERE p.proj_id = %s
                        AND (w.owner_id = %s OR m.user_id = %s)
                        LIMIT 1
                    """, [proj_id, user_id, user_id])

                    row = cursor.fetchone()

                    if not row:
                        return Response(
                            {"error": "Access denied or project not found"},
                            status=status.HTTP_403_FORBIDDEN
                        )
                    
                    role_name, owner_id = row
                    if owner_id != user_id and role_name != 'Admin':
                         return Response(
                            {"error": "Only Owner or Admin can create tasks"},
                            status=status.HTTP_403_FORBIDDEN
                        )

                    cursor.execute("""
                        INSERT INTO tasks 
                            (proj_id, created_by, title, description, status, priority, assigned_to, due_date)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING task_id, created_at;
                    """, [proj_id, user_id, title, description, status_value, priority, assigned_to, due_date])

                    task_row = cursor.fetchone()
                    task_id = task_row[0]
                    created_at = task_row[1]

            return Response({
                "message": "Task created successfully",
                "task_id": task_id,
                "title": title,
                "description": description,
                "status": status_value,
                "priority": priority,
                "assigned_to": assigned_to,
                "due_date": due_date,
                "created_at": created_at
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, proj_id):
        status_filter = request.query_params.get("status")
        priority_filter = request.query_params.get("priority")
        assigned_to_filter = request.query_params.get("assigned_to")

        try:
            with connection.cursor() as cursor:
                user_id = request.user.id

                cursor.execute("""
                    SELECT 1
                    FROM projects p
                    JOIN workspace w ON p.ws_id = w.ws_id
                    LEFT JOIN ws_member m ON w.ws_id = m.ws_id
                    WHERE p.proj_id = %s
                    AND (w.owner_id = %s OR m.user_id = %s)
                    LIMIT 1
                """, [proj_id, user_id, user_id])

                project = cursor.fetchone()

                if not project:
                    return Response(
                        {"error": "Access denied or project not found"},
                        status=status.HTTP_403_FORBIDDEN
                    )

                # Build dynamic query for filters
                query = "SELECT task_id, title, description, status, priority, assigned_to, created_by, created_at, due_date FROM tasks WHERE proj_id = %s"
                values = [proj_id]

                if status_filter:
                    query += " AND status = %s"
                    values.append(status_filter)
                if priority_filter:
                    query += " AND priority = %s"
                    values.append(priority_filter)
                if assigned_to_filter:
                    query += " AND assigned_to = %s"
                    values.append(assigned_to_filter)

                query += " ORDER BY created_at DESC"
                cursor.execute(query, values)

                tasks = [
                    {
                        "task_id": row[0],
                        "title": row[1],
                        "description": row[2],
                        "status": row[3],
                        "priority": row[4],
                        "assigned_to": row[5],
                        "created_by": row[6],
                        "created_at": row[7],
                        "due_date": row[8]
                    }
                    for row in cursor.fetchall()
                ]

            return Response({"tasks": tasks}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class TaskDetailApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        try:
            with connection.cursor() as cursor:
                user_id = request.user.id

                cursor.execute("""
                    SELECT t.task_id, t.proj_id, t.title, t.description, t.status, t.priority,
                        t.assigned_to, t.created_by, t.created_at, t.due_date
                    FROM tasks t
                    JOIN projects p ON t.proj_id = p.proj_id
                    JOIN workspace w ON p.ws_id = w.ws_id
                    LEFT JOIN ws_member m ON w.ws_id = m.ws_id
                    WHERE t.task_id = %s
                    AND (w.owner_id = %s OR m.user_id = %s)
                """, [task_id, user_id, user_id])
                task = cursor.fetchone()
                if not task:
                    return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

            task_data = {
                "task_id": task[0],
                "proj_id": task[1],
                "title": task[2],
                "description": task[3],
                "status": task[4],
                "priority": task[5],
                "assigned_to": task[6],
                "created_by": task[7],
                "created_at": task[8],
                "due_date": task[9]
            }

            return Response({"task": task_data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def patch(self, request, task_id):
        serializer = TaskBody(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    user_id = request.user.id

                    cursor.execute("""
                        SELECT t.task_id, r.name, w.owner_id
                        FROM tasks t
                        JOIN projects p ON t.proj_id = p.proj_id
                        JOIN workspace w ON p.ws_id = w.ws_id
                        LEFT JOIN ws_member m ON w.ws_id = m.ws_id
                        LEFT JOIN role r ON m.role_id = r.role_id
                        WHERE t.task_id = %s
                        AND (w.owner_id = %s OR m.user_id = %s)
                    """, [task_id, user_id, user_id])

                    row = cursor.fetchone()

                    if not row:
                        return Response(
                            {"error": "Access denied or task not found"},
                            status=status.HTTP_403_FORBIDDEN
                        )
                    
                    role_name, owner_id = row[1], row[2]

                    fields = []
                    values = []

                    allowed_fields = ["title", "description", "status", "priority", "assigned_to", "due_date"]
                    
                    # If Member, only allow 'status' update
                    if owner_id != user_id and role_name not in ('Owner', 'Admin'):
                        if any(f in validated_data and f != 'status' for f in allowed_fields):
                            return Response({"error": "Members can only update task status"}, status=status.HTTP_403_FORBIDDEN)
                        allowed_fields = ["status"]

                    for field in allowed_fields:
                        if field in validated_data:
                            fields.append(f"{field} = %s")
                            values.append(validated_data[field])

                    if not fields:
                        return Response({"error": "No fields provided for update"}, status=status.HTTP_400_BAD_REQUEST)

                    values.append(task_id)
                    sql = f"UPDATE tasks SET {', '.join(fields)} WHERE task_id = %s RETURNING task_id, title, description, status, priority, assigned_to, due_date;"
                    cursor.execute(sql, values)
                    updated_task = cursor.fetchone()

            return Response({
                "message": "Task updated successfully",
                "task_id": updated_task[0],
                "title": updated_task[1],
                "description": updated_task[2],
                "status": updated_task[3],
                "priority": updated_task[4],
                "assigned_to": updated_task[5],
                "due_date": updated_task[6]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, task_id):
        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    user_id = request.user.id

                    cursor.execute("""
                        SELECT t.task_id, r.name, w.owner_id
                        FROM tasks t
                        JOIN projects p ON t.proj_id = p.proj_id
                        JOIN workspace w ON p.ws_id = w.ws_id
                        LEFT JOIN ws_member m ON w.ws_id = m.ws_id
                        LEFT JOIN role r ON m.role_id = r.role_id
                        WHERE t.task_id = %s
                        AND (w.owner_id = %s OR m.user_id = %s)
                    """, [task_id, user_id, user_id])

                    row = cursor.fetchone()

                    if not row:
                        return Response(
                            {"error": "Access denied or task not found"},
                            status=status.HTTP_403_FORBIDDEN
                        )
                    
                    role_name, owner_id = row[1], row[2]
                    if owner_id != user_id and role_name != 'Admin':
                         return Response(
                            {"error": "Only Owner or Admin can delete tasks"},
                            status=status.HTTP_403_FORBIDDEN
                        )

                    cursor.execute("DELETE FROM tasks WHERE task_id = %s", [task_id])

            return Response({"message": "Task deleted successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


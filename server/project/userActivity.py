from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import connection
from rest_framework import status

class UserTaskActivityAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_id = request.user.id

            with connection.cursor() as cursor:

                cursor.execute("""
                    SELECT DISTINCT t.task_id, t.title, t.status, t.priority,
                                    t.assigned_to, t.created_by, t.created_at
                    FROM tasks t
                    JOIN projects p ON t.proj_id = p.proj_id
                    JOIN workspace w ON p.ws_id = w.ws_id
                    LEFT JOIN ws_member m ON w.ws_id = m.ws_id
                    WHERE 
                        t.assigned_to = %s
                        OR t.created_by = %s
                        OR m.user_id = %s
                """, [user_id, user_id, user_id])

                tasks = cursor.fetchall()

                result = []

                for task in tasks:
                    task_id = task[0]

                    cursor.execute("""
                        SELECT 
                            m.message_id,
                            m.sender_id,
                            u.username,
                            m.content,
                            m.created_at
                        FROM messages m
                        JOIN auth_user u ON m.sender_id = u.id
                        WHERE m.task_id = %s
                        ORDER BY m.created_at DESC
                    """, [task_id])

                    messages = cursor.fetchall()

                    message_list = [
                        {
                            "message_id": msg[0],
                            "sender_id": msg[1],
                            "sender_name": msg[2],
                            "content": msg[3],
                            "created_at": msg[4]
                        }
                        for msg in messages
                    ]

                    result.append({
                        "task_id": task[0],
                        "title": task[1],
                        "status": task[2],
                        "priority": task[3],
                        "assigned_to": task[4],
                        "created_by": task[5],
                        "created_at": task[6],
                        "messages": message_list
                    })

            return Response({"activities": result}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
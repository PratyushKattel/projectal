from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import connection,transaction
from django.utils import timezone

class MessageListCreateApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id):
        try:
            user_id = request.user.id
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT t.task_id
                    FROM tasks t
                    JOIN projects p ON t.proj_id = p.proj_id
                    JOIN workspace w ON p.ws_id = w.ws_id
                    LEFT JOIN ws_member m ON w.ws_id = m.ws_id
                    WHERE t.task_id = %s
                    AND (w.owner_id = %s OR m.user_id = %s)
                """, [task_id, user_id, user_id])
                
                if not cursor.fetchone():
                    return Response({"error": "Task not found or access denied"}, status=status.HTTP_404_NOT_FOUND)

                cursor.execute("""
                    SELECT message_id, task_id, sender_id, content, created_at
                    FROM messages
                    WHERE task_id = %s
                    ORDER BY created_at ASC
                """, [task_id])
                
                messages = cursor.fetchall()
                message_list = [
                    {
                        "message_id": msg[0],
                        "task_id": msg[1],
                        "sender_id": msg[2],
                        "content": msg[3],
                        "created_at": msg[4],
                    } for msg in messages
                ]

            return Response({"messages": message_list}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, task_id):
        try:
            user_id = request.user.id
            content = request.data.get("content")
            if not content:
                return Response({"error": "Content is required"}, status=status.HTTP_400_BAD_REQUEST)

            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT t.task_id
                    FROM tasks t
                    JOIN projects p ON t.proj_id = p.proj_id
                    JOIN workspace w ON p.ws_id = w.ws_id
                    LEFT JOIN ws_member m ON w.ws_id = m.ws_id
                    WHERE t.task_id = %s
                    AND (w.owner_id = %s OR m.user_id = %s)
                """, [task_id, user_id, user_id])
                
                if not cursor.fetchone():
                    return Response({"error": "Task not found or access denied"}, status=status.HTTP_404_NOT_FOUND)

                # Insert new message
                cursor.execute("""
                    INSERT INTO messages (task_id, sender_id, content, created_at)
                    VALUES (%s, %s, %s, %s)
                    RETURNING message_id, task_id, sender_id, content, created_at
                """, [task_id, user_id, content, timezone.now()])
                
                message = cursor.fetchone()
                message_data = {
                    "message_id": message[0],
                    "task_id": message[1],
                    "sender_id": message[2],
                    "content": message[3],
                    "created_at": message[4],
                }

            return Response({"message": message_data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class MessageDetailApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, message_id):
        try:
            user_id = request.user.id
            with connection.cursor() as cursor:
                # Check if user has access to the message via task
                cursor.execute("""
                    SELECT m.message_id, m.task_id, m.sender_id, m.content, m.created_at
                    FROM messages m
                    JOIN tasks t ON m.task_id = t.task_id
                    JOIN projects p ON t.proj_id = p.proj_id
                    JOIN workspace w ON p.ws_id = w.ws_id
                    LEFT JOIN ws_member wm ON w.ws_id = wm.ws_id
                    WHERE m.message_id = %s
                    AND (w.owner_id = %s OR wm.user_id = %s)
                """, [message_id, user_id, user_id])
                
                message = cursor.fetchone()
                if not message:
                    return Response({"error": "Message not found or access denied"}, status=status.HTTP_404_NOT_FOUND)

                message_data = {
                    "message_id": message[0],
                    "task_id": message[1],
                    "sender_id": message[2],
                    "content": message[3],
                    "created_at": message[4],
                }

            return Response({"message": message_data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, message_id):
        try:
            user_id = request.user.id
            with connection.cursor() as cursor:
                # Only sender or workspace owner can delete
                cursor.execute("""
                    SELECT m.message_id
                    FROM messages m
                    JOIN tasks t ON m.task_id = t.task_id
                    JOIN projects p ON t.proj_id = p.proj_id
                    JOIN workspace w ON p.ws_id = w.ws_id
                    LEFT JOIN ws_member wm ON w.ws_id = wm.ws_id
                    WHERE m.message_id = %s
                    AND (m.sender_id = %s OR w.owner_id = %s)
                """, [message_id, user_id, user_id])
                
                if not cursor.fetchone():
                    return Response({"error": "Not authorized to delete"}, status=status.HTTP_403_FORBIDDEN)

                cursor.execute("DELETE FROM messages WHERE message_id = %s", [message_id])

            return Response({"success": "Message deleted"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, message_id):
        try:
            user_id = request.user.id
            content = request.data.get("content")
            if not content:
                return Response({"error": "Content is required"}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                with connection.cursor() as cursor:
                    # Only sender can update the message
                    cursor.execute("""
                        SELECT message_id
                        FROM messages
                        WHERE message_id = %s AND sender_id = %s
                    """, [message_id, user_id])

                    if not cursor.fetchone():
                        return Response({"error": "Not authorized to update"}, status=status.HTTP_403_FORBIDDEN)

                    cursor.execute("""
                        UPDATE messages
                        SET content = %s
                        WHERE message_id = %s
                        RETURNING message_id, task_id, sender_id, content, created_at
                    """, [content, message_id])

                    updated_message = cursor.fetchone()

            return Response({"message": {
                "message_id": updated_message[0],
                "task_id": updated_message[1],
                "sender_id": updated_message[2],
                "content": updated_message[3],
                "created_at": updated_message[4],
            }}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
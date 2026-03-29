from  rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .serializer import RoleSerializer
from django.db import connection,transaction

class WorkSpaceMemberView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, ws_id, user_id):
        requester_id = request.user.id
        target_user_id = user_id

        serialized_data = RoleSerializer(data=request.data)

        if not serialized_data.is_valid():
            return Response({
                "error":"invalid role"
            },status=status.HTTP_400_BAD_REQUEST)

        new_role = serialized_data.validated_data["role"]

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT w.owner_id, r.name
                        FROM workspace w
                        JOIN ws_member m ON w.ws_id = m.ws_id
                        JOIN role r ON r.role_id = m.role_id
                        WHERE w.ws_id = %s AND m.user_id = %s;
                    """, [ws_id, requester_id])
                    row = cursor.fetchone()
                    if not row:
                        return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)
                    
                    ws_owner_id, requester_role = row
                    if ws_owner_id != requester_id:
                        return Response({"error": "Only the workspace owner can update roles"}, status=status.HTTP_403_FORBIDDEN)

                    cursor.execute("""
                        SELECT m.member_id, r.role_id
                        FROM ws_member m
                        JOIN role r ON r.role_id = m.role_id
                        WHERE m.ws_id = %s AND m.user_id = %s;
                    """, [ws_id, target_user_id])
                    member_row = cursor.fetchone()
                    if not member_row:
                        return Response({"error": "Member not found"}, status=status.HTTP_404_NOT_FOUND)

                    member_id, current_role_id = member_row

                    cursor.execute("""
                        SELECT role_id FROM role
                        WHERE ws_id = %s AND name = %s;
                    """, [ws_id, new_role])
                    role_row = cursor.fetchone()
                    if not role_row:
                        return Response({"error": "Role does not exist"}, status=status.HTTP_404_NOT_FOUND)

                    new_role_id = role_row[0]

                    cursor.execute("""
                        UPDATE ws_member
                        SET role_id = %s
                        WHERE member_id = %s;
                    """, [new_role_id, member_id])

            return Response({"message": "Member role updated successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, ws_id, user_id):
        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT owner_id
                        FROM workspace
                        WHERE ws_id = %s;
                    """, [ws_id])
                    row = cursor.fetchone()
                    if not row:
                        return Response({"error": "Workspace not found"}, status=status.HTTP_404_NOT_FOUND)

                    owner_id = row[0]
                    if request.user.id != owner_id:
                        return Response({"error": "Only the workspace owner can remove members"}, status=status.HTTP_403_FORBIDDEN)

                    cursor.execute("""
                        SELECT member_id
                        FROM ws_member
                        WHERE ws_id = %s AND user_id = %s;
                    """, [ws_id, user_id])
                    member_row = cursor.fetchone()
                    if not member_row:
                        return Response({"error": "Member not found"}, status=status.HTTP_404_NOT_FOUND)

                    member_id = member_row[0]

                    cursor.execute("""
                        DELETE FROM ws_member
                        WHERE member_id = %s;
                    """, [member_id])

            return Response({"message": "Member removed successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WorkSpaceMemberListApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, ws_id):
        try:
            with connection.cursor() as cursor:

                # ✅ Check if user is part of workspace
                cursor.execute("""
                    SELECT 1
                    FROM ws_member
                    WHERE ws_id = %s AND user_id = %s;
                """, [ws_id, request.user.id])

                if not cursor.fetchone():
                    return Response(
                        {"error": "Access denied"},
                        status=status.HTTP_403_FORBIDDEN
                    )

                # ✅ Get all members
                cursor.execute("""
                    SELECT 
                        u.id,
                        u.username,
                        u.email,
                        r.name AS role,
                        wm.joined_at
                    FROM ws_member wm
                    JOIN auth_user u ON u.id = wm.user_id
                    LEFT JOIN role r ON r.role_id = wm.role_id
                    WHERE wm.ws_id = %s
                    ORDER BY wm.joined_at;
                """, [ws_id])

                rows = cursor.fetchall()

                # ✅ Format response
                members = []
                for row in rows:
                    members.append({
                        "id": row[0],
                        "username": row[1],
                        "email": row[2],
                        "role": row[3],
                        "joined_at": row[4]
                    })

                return Response(members, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
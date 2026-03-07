from django.shortcuts import render
from django.db import connection
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db import connection,transaction
from rest_framework.response import Response
from rest_framework import status
from .serilalizer import InviteSerializer
from .utils import send_invite_email
from django.db import connection, transaction
import uuid


def invite_page(request, token):

    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT w.name, wi.email
            FROM workspace_invite wi
            JOIN workspace w ON w.ws_id = wi.ws_id
            WHERE wi.token = %s
        """, [token])

        row = cursor.fetchone()

    if not row:
        return render(request, "email/invite_invalid.html")

    workspace_name = row[0]

    return render(request, "email/invitation.html", {
        "workspace": workspace_name,
        "token": token
    })

class AcceptInviteApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token):

        user_id = request.user.id

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:

                    cursor.execute("""
                        SELECT ws_id, email
                        FROM workspace_invite
                        WHERE token = %s
                    """, [token])

                    row = cursor.fetchone()

                    if not row:
                        return Response(
                            {"error": "Invalid invite"},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    ws_id, email = row

                    if email != request.user.email:
                        return Response(
                            {"error": "This invite is not for your email"},
                            status=status.HTTP_403_FORBIDDEN
                        )

                    cursor.execute("""
                        SELECT role_id
                        FROM role
                        WHERE ws_id = %s AND name = 'Member'
                        LIMIT 1
                    """, [ws_id])
                    role_row = cursor.fetchone()

                    if role_row:
                        role_id = role_row[0]
                    else:
                        cursor.execute("""
                            INSERT INTO role (name, ws_id)
                            VALUES ('Member', %s)
                            RETURNING role_id
                        """, [ws_id])
                        role_id = cursor.fetchone()[0]

                    cursor.execute("""
                        INSERT INTO ws_member (user_id, ws_id, role_id)
                        VALUES (%s, %s, %s)
                    """, [user_id, ws_id, role_id])

                    cursor.execute("""
                        DELETE FROM workspace_invite WHERE token = %s
                    """, [token])

                    return Response({
                        "message": "Workspace joined successfully with Member role"
                    })

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class WorkspaceMemberInviteApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, ws_id):
        serializer = InviteSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                "error": "Invalid email"
            }, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data["email"]
        user_id = request.user.id

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:

                    cursor.execute("""
                        SELECT ws_id, name, owner_id
                        FROM workspace
                        WHERE ws_id = %s;
                    """, [ws_id])
                    row = cursor.fetchone()

                    if not row:
                        return Response(
                            {"error": "Workspace not found"},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    columns = [col[0] for col in cursor.description]
                    workspace = dict(zip(columns, row))

                    cursor.execute("""
                        SELECT r.name
                        FROM ws_member wm
                        JOIN role r ON wm.role_id = r.role_id
                        WHERE wm.ws_id = %s AND wm.user_id = %s;
                    """, [ws_id, user_id])

                    role_row = cursor.fetchone()
                    role_name = role_row[0] if role_row else None

                    print(f"user is {user_id}, his role is {role_name}")
                    print(f"workspace is {workspace}")

                    if user_id != workspace["owner_id"] and role_name != "Admin":
                        return Response(
                            {"error": "Only Owner or Admin can invite users"},
                            status=status.HTTP_403_FORBIDDEN
                        )

                    token = str(uuid.uuid4())
                    cursor.execute("""
                        INSERT INTO workspace_invite (email, ws_id, token, invited_by)
                        VALUES (%s, %s, %s, %s)
                    """, [email, ws_id, token, user_id])

                    invite_link = f"http://127.0.0.1:8000/api/invite/{token}/"

                    send_invite_email(
                        email=email,
                        workspace_name=workspace["name"],
                        invited_by=request.user.username,
                        invite_link=invite_link
                    )

                    return Response(
                        {"message": f"Invitation sent to {email}"},
                        status=status.HTTP_200_OK
                    )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
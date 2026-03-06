from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import connection, transaction


class WorkSpaceApi(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        name = request.data.get("name")

        if not name:
            return Response({
                "error": "workspace name is required",
            }, status=status.HTTP_400_BAD_REQUEST)

        user_id = request.user.id

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:

                    cursor.execute("""
                        INSERT INTO workspace (name, owner_id)
                        VALUES (%s, %s)
                        RETURNING ws_id, created_at;
                    """, [name, user_id])

                    ws_row = cursor.fetchone()
                    ws_id = ws_row[0]
                    ws_created_at = ws_row[1]

                    print(f"ws id is {ws_id}")

                    cursor.execute("""
                        INSERT INTO role (name, ws_id)
                        VALUES 
                            ('Owner',  %s),
                            ('Admin',  %s),
                            ('Member', %s)
                        RETURNING role_id, name;
                    """, [ws_id, ws_id, ws_id])

                    role_map = {
                        role_name: role_id
                        for role_id, role_name in cursor.fetchall()
                    }

                    owner_role_id = role_map.get("Owner")

                    cursor.execute("""
                        INSERT INTO ws_member (user_id, ws_id, role_id)
                        VALUES (%s, %s, %s);
                    """, [user_id, ws_id, owner_role_id])

                return Response({
                    "message": "Workspace created successfully",
                    "ws_id": ws_id,
                    "name": name,
                    "created_at": ws_created_at,
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def get(self, request):
        user_id = request.user.id

        try:
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        w.ws_id,
                        w.name,
                        w.owner_id,
                        u.first_name AS owner_name,
                        r.name AS role,
                        w.created_at
                    FROM workspace w
                    JOIN ws_member m  ON w.ws_id = m.ws_id
                    JOIN role r       ON r.role_id = m.role_id
                    JOIN auth_user u      ON u.id = w.owner_id
                    WHERE m.user_id = %s
                    ORDER BY w.created_at DESC;
                """, [user_id])

                    
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]

            workspaces = [dict(zip(columns, row)) for row in rows]

            return Response(workspaces, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class WorkSpaceDetailsApi(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request,ws_id):
        user_id = request.user.id

        try:
                with connection.cursor() as cursor:

                    cursor.execute("""
                        SELECT 
                            w.ws_id,
                            w.name,
                            w.owner_id,
                            u.first_name AS owner_name,
                            r.name AS role,
                            w.created_at
                        FROM workspace w
                        JOIN ws_member m ON w.ws_id = m.ws_id
                        JOIN role r ON r.role_id = m.role_id
                        JOIN auth_user u ON u.id = w.owner_id
                        WHERE w.ws_id = %s AND m.user_id = %s;
                    """, [ws_id, user_id])

                    row = cursor.fetchone()

                    print(f"row fetched is {row}")

                    if not row:
                        return Response(
                            {"error": "Workspace not found or access denied"},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    print(f"cursor description is {cursor.description}")
                    columns = [col[0] for col in cursor.description]
                    workspace = dict(zip(columns, row))

                return Response(workspace, status=status.HTTP_200_OK)

        except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

    def patch(self, request, ws_id):
        user_id = request.user.id
        new_name = request.data.get("name")

        if not new_name:
            return Response(
                {"error": "New workspace name is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

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
                        return Response(
                            {"error": "Workspace not found"},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    owner_id = row[0]
                    if owner_id != user_id:
                        return Response(
                            {"error": "Only the workspace owner can update the workspace"},
                            status=status.HTTP_403_FORBIDDEN
                        )

                    cursor.execute("""
                        UPDATE workspace
                        SET name = %s
                        WHERE ws_id = %s
                        RETURNING ws_id, name, created_at;
                    """, [new_name, ws_id])
                    updated_row = cursor.fetchone()
                    columns = [col[0] for col in cursor.description]
                    updated_workspace = dict(zip(columns, updated_row))

                    return Response(
                    {"message": "Workspace updated successfully", **updated_workspace},
                    status=status.HTTP_200_OK
                        )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    def delete(self, request, ws_id):
        user_id = request.user.id

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
                        return Response(
                            {"error": "Workspace not found"},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    owner_id = row[0]
                    if owner_id != user_id:
                        return Response(
                            {"error": "Only the workspace owner can delete the workspace"},
                            status=status.HTTP_403_FORBIDDEN
                        )
                    cursor.execute("""
                        DELETE FROM workspace
                        WHERE ws_id = %s;
                    """, [ws_id])

            return Response(
                {"message": "Workspace deleted successfully"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 









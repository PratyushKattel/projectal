from rest_framework import serializers
from enum import Enum

class InviteSerializer(serializers.Serializer):
    email = serializers.EmailField()

class RoleEnum(Enum):
    OWNER = "Owner"
    ADMIN = "Admin"
    MEMBER = "Member"
    VIEWER = "Viewer"

class RoleSerializer(serializers.Serializer):
    role = serializers.ChoiceField(
        choices=[(role.value, role.name) for role in RoleEnum]
    )

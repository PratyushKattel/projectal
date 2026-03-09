from rest_framework import serializers

class ProjectBody(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    description = serializers.CharField()

class TaskBody(serializers.Serializer):
    title = serializers.CharField(max_length=150, required=True)
    description = serializers.CharField(required=False, allow_blank=True, default="")
    status = serializers.ChoiceField(
        choices=['Todo', 'InProgress', 'Completed', 'Blocked'], 
        required=False, 
        default='Todo'
    )
    priority = serializers.ChoiceField(
        choices=['Low', 'Medium', 'High', 'Critical'],
        required=False,
        default='Medium'
    )
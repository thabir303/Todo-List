from rest_framework import serializers
from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.id')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Todo
        fields = ['id', 'user', 'username', 'title', 'description', 'completed', 'created_at', 'updated_at']
        read_only_fields = ['user', 'username', 'created_at', 'updated_at']
        
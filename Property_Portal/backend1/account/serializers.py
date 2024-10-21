# yourapp/serializers.py

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser,Agent,Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id','user', 'favourite_property', 'sell_property']

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id','user', 'inquiry_property', 'active_property']


class UserSerializer(serializers.ModelSerializer):
    client_details = serializers.SerializerMethodField()
    agent_details = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username','password', 'client_details', 'agent_details')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

    def get_client_details(self, obj):
        if hasattr(obj, 'client'):
            return ClientSerializer(obj.client).data
        return None

    def get_agent_details(self, obj):
        if hasattr(obj, 'agent'):
            return AgentSerializer(obj.agent).data
        return None


class AuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Invalid credentials")
        return user

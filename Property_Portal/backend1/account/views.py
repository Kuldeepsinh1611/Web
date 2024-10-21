# yourapp/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from .serializers import UserSerializer, AuthSerializer
from .models import CustomUser, Agent, Client
from property.models import Property
from rest_framework_simplejwt.tokens import RefreshToken
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        type = request.data.get('type')  # Expecting 'role' to be either 'client' or 'agent'

        if serializer.is_valid():
            user = serializer.save()
            
            if type == 'client':
                Client.objects.create(user=user)
            elif type == 'agent':
                Agent.objects.create(user=user)
            else:
                return Response({'error': 'Invalid role specified'}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'email': user.email, 'username': user.username}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = AuthSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            auth_login(request, user)

            # Create refresh and access tokens
            refresh = RefreshToken.for_user(user)

            client=Client.objects.filter(user=user.id)
            agent=Agent.objects.filter(user=user.id)
            if client:
                user_type='client'
            if agent:
                user_type='agent'
            print(user)
            return Response({
                'id': user.id,
                'user_type':user_type,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):

    def post(self, request):
        try:
            # Blacklist the refresh token if using the token blacklist feature
            refresh_token = request.data.get("token")
            token = RefreshToken(refresh_token)
            token.blacklist()  # Blacklist the refresh token

            auth_logout(request)
            return Response({'message': 'Logout successful'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):

    def get(self, request, id):
        try:
            user = CustomUser.objects.get(pk=id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user)
        return Response(serializer.data)

class AddSaveProperty(APIView):
    def post(self, request):
        try:
            print(request.data)
            client = Client.objects.get(user=request.data['id'])
            property=Property.objects.get(pk=request.data['property_id'])
            client.favourite_property.add(property)
            return Response({'message':'Property Added Successful'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class AddVerifyProperty(APIView):
    def post(self, request):
        try:
            print(request.data)
            agent = Agent.objects.get(user=request.data['id'])
            property=Property.objects.get(pk=request.data['property_id'])
            agent.inquiry_property.remove(property)
            property.is_verified=True
            property.save()
            agent.active_property.add(property)
            return Response({'message':'Property Verified Successful'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class SoldProperty(APIView):
    def post(self, request):
        try:
            print(request.data)
            agent = Agent.objects.get(user=request.data['id'])
            property=Property.objects.get(pk=request.data['property_id'])
            agent.active_property.remove(property)
            property.is_available=False
            property.save()
            return Response({'message':'Property Unavailable'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class AgentProfilesView(APIView):

    def get(self, request):
        # Retrieve agent profiles by filtering users based on Agent model
        agent_user_ids = Agent.objects.values_list('user', flat=True)
        users = CustomUser.objects.filter(id__in=agent_user_ids)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

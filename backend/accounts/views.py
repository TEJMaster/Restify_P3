from django.shortcuts import render

from django.contrib.auth import authenticate
from .serializers import UserSerializer, LogInSerializer, ProfileSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken


from accounts.models import CustomUser

# Create your views here.


class UserSignUpAPIView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    
    def get(self, request, *args, **kwargs):
        message = "This is the sign-up page"
        return Response(message)


class UserLoginAPIView(APIView):
    serializer_class = LogInSerializer
    
    def get(self, request):
        return Response({'message': 'This is the login page.'})
    
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            response = Response({
                'message': 'Login successful! Welcome ' + username + '!',
                'refresh_token': str(refresh),
                'access_token': str(refresh.access_token),
            })

            # Set the access and refresh token cookies
            response.set_cookie('refresh_token', str(refresh), httponly=True)
            response.set_cookie('access_token', str(refresh.access_token), httponly=True)

            # Set the JWT authentication header
            jwt_token = str(refresh.access_token)
            response['Authorization'] = 'Bearer ' + jwt_token

            return response
        else:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
    

class UserLogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            # Get the refresh token from the request's header
            token_value = request.META.get('HTTP_X_REFRESH_TOKEN', '')

            # Blacklist the refresh and access tokens
            token = RefreshToken(token_value)
            token.blacklist()

            # Clear the access and refresh token cookies
            response = Response({'message': 'User is successfully logged out.'})
            response.delete_cookie('refresh_token')
            response.delete_cookie('access_token')

            return response

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)







class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.username == request.user.username


class UserProfileAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)
    serializer_class = ProfileSerializer
    
    def get_object(self, username):
        return get_object_or_404(CustomUser, username=username)
    
    def get(self, request, *args, **kwargs):
        user = self.get_object(request.user.username)
        return Response({
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'avatar': user.avatar.url if user.avatar else None,
            'phone_number': str(user.phone_number),
        })
    
    def put(self, request, *args, **kwargs):
        user = self.get_object(request.user.username)
        serializer = ProfileSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from .models import User
from .serializers import (
    UserSerializer, RegisterSerializer, UpdateProfileSerializer,
    TokenResponseSerializer
)


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Dev mode: Register with phone + name + role (no OTP in dev).
    Production: Replace with Firebase verify endpoint.
    """
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    phone = serializer.validated_data['phone']
    name = serializer.validated_data.get('name', '')
    role = serializer.validated_data['role']

    user, created = User.objects.get_or_create(phone=phone)
    user.name = name or user.name
    user.role = role
    user.is_verified = True
    user.save()

    return Response(get_tokens(user), status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Dev mode login: phone only. Production: Firebase OTP."""
    phone = request.data.get('phone', '').strip()
    if not phone:
        return Response({'error': 'Phone is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(phone=phone)
    except User.DoesNotExist:
        return Response({'error': 'No account found. Please register first.'}, status=status.HTTP_404_NOT_FOUND)

    return Response(get_tokens(user))


@api_view(['POST'])
@permission_classes([AllowAny])
def firebase_verify(request):
    """
    Production auth: Verify Firebase ID token and issue JWT.
    For MVP dev, this is a passthrough that creates users by phone.
    """
    phone = request.data.get('phone', '').strip()
    name = request.data.get('name', '')
    role = request.data.get('role', 'BUYER')

    if not phone:
        return Response({'error': 'Phone is required'}, status=status.HTTP_400_BAD_REQUEST)

    user, created = User.objects.get_or_create(phone=phone)
    if created or not user.name:
        user.name = name
        user.role = role
        user.is_verified = True
        user.save()

    return Response(get_tokens(user), status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def me(request):
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)

    serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(UserSerializer(request.user).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception:
        pass
    return Response({'message': 'Logged out successfully'})

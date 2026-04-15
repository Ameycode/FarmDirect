from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'phone', 'name', 'role', 'language', 'avatar', 'is_verified', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_verified']


class RegisterSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=['FARMER', 'BUYER'])

    def validate_phone(self, value):
        # Normalize phone number
        return value.strip().replace(' ', '')


class LoginSerializer(serializers.Serializer):
    """For dev/testing — in production replace with Firebase OTP verify"""
    phone = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)


class FirebaseVerifySerializer(serializers.Serializer):
    id_token = serializers.CharField()
    role = serializers.ChoiceField(choices=['FARMER', 'BUYER'], required=False, default='BUYER')
    name = serializers.CharField(max_length=100, required=False, allow_blank=True)


class TokenResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserSerializer()

    @staticmethod
    def get_tokens(user):
        refresh = RefreshToken.for_user(user)
        return {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name', 'language', 'avatar']

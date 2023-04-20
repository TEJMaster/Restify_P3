
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser
from django.core.files import File



class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_repeat = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)
    phone_number = serializers.CharField(required=False, allow_null=True)


    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password_repeat', 'first_name', 'last_name', 'phone_number')

    def validate_password_length(self, value):
        """
        Check that the password has a length of at least 8 characters
        """
        if len(value) < 8:
            raise serializers.ValidationError("The password must be at least 8 characters long.")
        return value

    def validate_passwords(self, data):
        if data['password'] != data['password_repeat']:
            raise serializers.ValidationError("Two pass words didn't match")
        return data
    
    
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        if validated_data.get('first_name'):
            user.first_name = validated_data['first_name']
        if validated_data.get('last_name'):
            user.last_name = validated_data['last_name']
        if validated_data.get('phone_number'):
            user.phone_number = validated_data['phone_number']
        user.save()
        return user



class LogInSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError(
                'A user with this username and password was not found.'
            )

        data = super().validate(attrs)
        return data


class ProfileSerializer(UserSerializer):
    new_password = serializers.CharField(write_only=True, required=False)
    confirm_new_password = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=False)

    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name', 'new_password', 'confirm_new_password', 'avatar', 'phone_number')

    def validate(self, data):
        new_password = data.get('new_password')
        confirm_new_password = data.get('confirm_new_password')

        if new_password and not confirm_new_password:
            raise serializers.ValidationError("Please confirm the new password.")

        if confirm_new_password and not new_password:
            raise serializers.ValidationError("Please provide a new password.")

        if new_password != confirm_new_password:
            raise serializers.ValidationError("New passwords do not match.")

        if new_password is not None and len(new_password) < 8:
            raise serializers.ValidationError("The password must be at least 8 characters long.")

        data.pop('confirm_new_password', None)

        return super().validate(data)



    def update(self, instance, validated_data):
        if validated_data.get('email'):
            instance.email = validated_data['email']
        if validated_data.get('new_password'):
            instance.set_password(validated_data['new_password'])
        if validated_data.get('first_name'):
            instance.first_name = validated_data['first_name']
        if validated_data.get('last_name'):
            instance.last_name = validated_data['last_name']
        if validated_data.get('avatar'):
            instance.avatar = validated_data['avatar']
        if validated_data.get('phone_number'):
            instance.phone_number = validated_data['phone_number']
        instance.save()
        return instance

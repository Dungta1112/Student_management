from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'role',
            'student_code',
            'date_of_birth',
            'phone_number',
            'enrollment_date',
            'is_active',
            'date_joined',
            'password',
        ]
        read_only_fields = ['date_joined']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def validate(self, attrs):
        if self.instance is None and not attrs.get('password'):
            raise serializers.ValidationError(
                {'password': 'Mật khẩu là bắt buộc khi tạo tài khoản.'}
            )
        if attrs.get('student_code') == '':
            attrs['student_code'] = None
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

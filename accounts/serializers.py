from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'password', 'student_code', 'full_name', 'date_of_birth', 'phone_number', 'enrollment_date']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            role=validated_data.get('role', 'student'),
            password=validated_data['password'],
            student_code=validated_data.get('student_code'),
            full_name=validated_data.get('full_name'),
            date_of_birth=validated_data.get('date_of_birth'),
            phone_number=validated_data.get('phone_number'),
            enrollment_date=validated_data.get('enrollment_date')
        )
        return user

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
        ('student', 'Student'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    
    # Extra profile fields directly on User model
    student_code = models.CharField(max_length=20, unique=True, null=True, blank=True, verbose_name="Mã học sinh")
    full_name = models.CharField(max_length=255, null=True, blank=True, verbose_name="Họ và tên")
    date_of_birth = models.DateField(null=True, blank=True, verbose_name="Ngày sinh")
    phone_number = models.CharField(max_length=15, null=True, blank=True, verbose_name="Số điện thoại")
    enrollment_date = models.DateField(null=True, blank=True, verbose_name="Ngày nhập học")

    def __str__(self):
        return f"{self.username} - {self.full_name or self.get_role_display()}"

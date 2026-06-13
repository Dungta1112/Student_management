from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'role', 'student_code', 'full_name', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Profile Fields', {'fields': ('role', 'student_code', 'full_name', 'date_of_birth', 'phone_number', 'enrollment_date')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Profile Fields', {'fields': ('role', 'student_code', 'full_name', 'date_of_birth', 'phone_number', 'enrollment_date')}),
    )

admin.site.register(User, CustomUserAdmin)

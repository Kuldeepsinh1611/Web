# account/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import CustomUser,Agent,Client

class UserAdmin(DefaultUserAdmin):
    model = CustomUser
    list_display = ('email', 'is_staff', 'is_active')  # Fields to display in the user list
    list_filter = ('is_staff', 'is_active')  # Filters to apply on the user list

    # Define the fieldsets for the user detail view
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Define the fields to use in the 'add user' view
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )

    # No need for 'groups' and 'user_permissions' if not using them
    filter_horizontal = ()

    # Define the form fields used for creating users
    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return super().get_fieldsets(request, obj)
        return (
            (None, {'fields': ('email', 'password')}),
            ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
            ('Important dates', {'fields': ('last_login', 'date_joined')}),
        )

    def get_add_fieldsets(self, request):
        return (
            (None, {
                'classes': ('wide',),
                'fields': ('email', 'password1', 'password2')}
            ),
        )

# Register the custom UserAdmin
admin.site.register(CustomUser, UserAdmin)

admin.site.register(Client)
admin.site.register(Agent)

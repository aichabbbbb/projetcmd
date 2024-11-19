from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .models import Profile, ProfilePicture

User = get_user_model()

# Unregister the existing User model
admin.site.unregister(User)

# Register the User model again, using the UserAdmin class
admin.site.register(User, UserAdmin)
admin.site.register(Profile)
admin.site.register(ProfilePicture)


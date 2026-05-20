from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from .models import User as CustomUser

class EmailOrMobileBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = CustomUser.objects.get(Q(email=username) | Q(mobile=username))
        except CustomUser.DoesNotExist:
            return None
        
        if user and user.check_password(password):
            return user
        return None
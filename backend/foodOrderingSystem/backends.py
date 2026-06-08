from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from .models import User as CustomUser

class EmailOrMobileBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username:
            return None
            
        try:
            # Clean up the input string
            username_str = str(username).strip()
            
            # Check if the input could be a mobile number (only contains digits)
            if username_str.isdigit():
                user = CustomUser.objects.get(mobile=username_str)
            else:
                # If it's text, only look up via email address
                user = CustomUser.objects.get(email=username_str)
                
        except CustomUser.DoesNotExist:
            return None
        
        if user and user.check_password(password):
            return user
        return None
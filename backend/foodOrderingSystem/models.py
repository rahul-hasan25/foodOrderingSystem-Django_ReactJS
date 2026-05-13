from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    email      = models.EmailField(max_length=50, unique=True)
    mobile     = models.BigIntegerField()
    password   = models.CharField(max_length=50)
    reg_date   = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
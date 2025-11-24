from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='users/avatars/', blank=True, null=True)

    def __str__(self):
        return self.username

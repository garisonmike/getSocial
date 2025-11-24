from django.db import models
from apps.posts.models import Post

class Analytics(models.Model):
    post = models.OneToOneField(Post, on_delete=models.CASCADE, related_name='analytics')
    views = models.PositiveIntegerField(default=0)
    likes_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Analytics for Post {self.post.id}"

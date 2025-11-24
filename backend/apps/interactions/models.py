from django.db import models
from django.conf import settings
from apps.posts.models import Post

class Interaction(models.Model):
    INTERACTION_TYPES = [
        ('like', 'Like'),
        ('share', 'Share'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='interactions')
    interaction_type = models.CharField(max_length=10, choices=INTERACTION_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensures a user can only have one 'like' or one 'share' per post
        unique_together = ('user', 'post', 'interaction_type')

    def __str__(self):
        return f"{self.user} {self.interaction_type}d Post {self.post.id}"

from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


class UserProfile(models.Model):
    """Extended user profile with social media features"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(
        upload_to='profiles/avatars/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    cover_photo = models.ImageField(
        upload_to='profiles/covers/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(max_length=200, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)
    posts_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"Profile of {self.user.username}"


class Follow(models.Model):
    """Follow relationship between users"""
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='following'
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='followers'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'core_follows'
        unique_together = ('follower', 'following')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['follower', '-created_at']),
            models.Index(fields=['following', '-created_at']),
        ]

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"

    def save(self, *args, **kwargs):
        # Prevent users from following themselves
        if self.follower == self.following:
            raise ValueError("Users cannot follow themselves")
        super().save(*args, **kwargs)


class Post(models.Model):
    """Social media post with enhanced features"""
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('followers', 'Followers Only'),
        ('private', 'Private'),
    ]

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='core_posts'
    )
    content = models.TextField(max_length=2200)
    image = models.ImageField(
        upload_to='posts/images/%Y/%m/%d/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    video = models.FileField(
        upload_to='posts/videos/%Y/%m/%d/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi'])]
    )
    visibility = models.CharField(
        max_length=10,
        choices=VISIBILITY_CHOICES,
        default='public'
    )
    is_published = models.BooleanField(default=True)
    is_pinned = models.BooleanField(default=False)
    likes_count = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    shares_count = models.PositiveIntegerField(default=0)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_posts'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['author', '-created_at']),
            models.Index(fields=['is_published', '-created_at']),
            models.Index(fields=['-likes_count']),
        ]

    def __str__(self):
        return f"Post {self.pk} by {self.author.username}"


class Comment(models.Model):
    """Comments and replies with nested structure"""
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='core_comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='core_comments'
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    content = models.TextField(max_length=1000)
    likes_count = models.PositiveIntegerField(default=0)
    replies_count = models.PositiveIntegerField(default=0)
    is_edited = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'core_comments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['parent', '-created_at']),
        ]

    def __str__(self):
        return f"Comment {self.id} by {self.author.username}" # pyright: ignore[reportAttributeAccessIssue]

    @property
    def is_reply(self):
        return self.parent is not None


class Like(models.Model):
    """Generic like model for posts and comments"""
    CONTENT_TYPE_CHOICES = [
        ('post', 'Post'),
        ('comment', 'Comment'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='core_likes'
    )
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='likes',
        null=True,
        blank=True
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='likes',
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'core_likes'
        unique_together = [
            ('user', 'post'),
            ('user', 'comment'),
        ]
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['comment', '-created_at']),
        ]

    def __str__(self):
        target = self.post if self.post else self.comment
        return f"{self.user.username} likes {self.content_type} {target.id}" # type: ignore


class Share(models.Model):
    """Post sharing/reposting functionality"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='shares'
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name='shared_by'
    )
    caption = models.TextField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'core_shares'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['post', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} shared post {self.post.pk}"

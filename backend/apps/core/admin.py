from django.contrib import admin
from .models import UserProfile, Follow, Post, Comment, Like, Share


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_verified', 'is_private', 'followers_count', 'following_count', 'posts_count')
    list_filter = ('is_verified', 'is_private', 'created_at')
    search_fields = ('user__username', 'user__email', 'location')
    readonly_fields = ('followers_count', 'following_count', 'posts_count', 'created_at', 'updated_at')


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('follower', 'following', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('follower__username', 'following__username')
    date_hierarchy = 'created_at'


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'visibility', 'is_published', 'is_pinned', 'likes_count', 'comments_count', 'created_at')
    list_filter = ('visibility', 'is_published', 'is_pinned', 'created_at')
    search_fields = ('author__username', 'content')
    readonly_fields = ('likes_count', 'comments_count', 'shares_count', 'views_count', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'post', 'parent', 'is_reply', 'likes_count', 'replies_count', 'created_at')
    list_filter = ('is_edited', 'created_at')
    search_fields = ('author__username', 'content')
    readonly_fields = ('likes_count', 'replies_count', 'created_at', 'updated_at')


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'content_type', 'post', 'comment', 'created_at')
    list_filter = ('content_type', 'created_at')
    search_fields = ('user__username',)


@admin.register(Share)
class ShareAdmin(admin.ModelAdmin):
    list_display = ('user', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'caption')
    date_hierarchy = 'created_at'

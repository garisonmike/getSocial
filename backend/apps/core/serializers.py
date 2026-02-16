from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, Follow, Post, Comment, Like, Share

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    """User profile serializer with nested user data"""
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'username', 'bio', 'avatar', 'cover_photo',
            'location', 'website', 'date_of_birth', 'is_verified',
            'is_private', 'followers_count', 'following_count',
            'posts_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'username', 'is_verified', 'followers_count',
            'following_count', 'posts_count', 'created_at', 'updated_at'
        ]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    class Meta:
        model = UserProfile
        fields = [
            'bio', 'avatar', 'cover_photo', 'location',
            'website', 'date_of_birth', 'is_private'
        ]


class FollowSerializer(serializers.ModelSerializer):
    """Follow relationship serializer"""
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)
    follower_username = serializers.CharField(source='follower.username', read_only=True)
    following_username = serializers.CharField(source='following.username', read_only=True)
    
    class Meta:
        model = Follow
        fields = [
            'id', 'follower', 'following', 'follower_username',
            'following_username', 'created_at'
        ]
        read_only_fields = ['id', 'follower', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    """Post serializer with author details"""
    author = UserSerializer(read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_profile = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'author', 'author_username', 'author_profile',
            'content', 'image', 'video', 'visibility', 'is_published',
            'is_pinned', 'likes_count', 'comments_count', 'shares_count',
            'views_count', 'is_liked', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'author', 'author_username', 'author_profile',
            'likes_count', 'comments_count', 'shares_count',
            'views_count', 'is_liked', 'created_at', 'updated_at'
        ]
    
    def get_author_profile(self, obj):
        """Get author's profile summary"""
        try:
            return {
                'avatar': obj.author.profile.avatar.url if obj.author.profile.avatar else None,
                'is_verified': obj.author.profile.is_verified,
            }
        except:
            return None
    
    def get_is_liked(self, obj):
        """Check if current user has liked this post"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(
                user=request.user,
                post=obj,
                content_type='post'
            ).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating posts"""
    class Meta:
        model = Post
        fields = [
            'content', 'image', 'video', 'visibility', 'is_published'
        ]
    
    def validate(self, data):
        """Ensure content is not empty if no media is provided"""
        if not data.get('content') and not data.get('image') and not data.get('video'):
            raise serializers.ValidationError(
                "Post must have either content, image, or video."
            )
        return data


class CommentSerializer(serializers.ModelSerializer):
    """Comment serializer with author details and nested replies"""
    author = UserSerializer(read_only=True)
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_avatar = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = [
            'id', 'post', 'author', 'author_username', 'author_avatar',
            'parent', 'content', 'likes_count', 'replies_count',
            'is_edited', 'is_reply', 'is_liked', 'replies',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'author', 'author_username', 'author_avatar',
            'likes_count', 'replies_count', 'is_edited', 'is_reply',
            'is_liked', 'replies', 'created_at', 'updated_at'
        ]
    
    def get_author_avatar(self, obj):
        """Get author's avatar URL"""
        try:
            return obj.author.profile.avatar.url if obj.author.profile.avatar else None
        except:
            return None
    
    def get_is_liked(self, obj):
        """Check if current user has liked this comment"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(
                user=request.user,
                comment=obj,
                content_type='comment'
            ).exists()
        return False
    
    def get_replies(self, obj):
        """Get replies to this comment (only if it's not a reply itself)"""
        if obj.parent is None:
            # Only show replies for top-level comments to avoid deep nesting
            replies = obj.replies.all()[:5]  # Limit to 5 recent replies
            return CommentSerializer(replies, many=True, context=self.context).data
        return []


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating comments"""
    class Meta:
        model = Comment
        fields = ['post', 'parent', 'content']
    
    def validate(self, data):
        """Validate parent comment belongs to same post"""
        if data.get('parent'):
            if data['parent'].post != data['post']:
                raise serializers.ValidationError(
                    "Parent comment must belong to the same post."
                )
        return data


class LikeSerializer(serializers.ModelSerializer):
    """Like serializer"""
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Like
        fields = [
            'id', 'user', 'username', 'content_type',
            'post', 'comment', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'username', 'created_at']
    
    def validate(self, data):
        """Ensure either post or comment is provided, not both"""
        if data.get('content_type') == 'post' and not data.get('post'):
            raise serializers.ValidationError("Post is required when content_type is 'post'")
        if data.get('content_type') == 'comment' and not data.get('comment'):
            raise serializers.ValidationError("Comment is required when content_type is 'comment'")
        if data.get('post') and data.get('comment'):
            raise serializers.ValidationError("Cannot like both post and comment simultaneously")
        return data


class LikeCreateSerializer(serializers.Serializer):
    """Simplified serializer for creating likes"""
    post_id = serializers.IntegerField(required=False, allow_null=True)
    comment_id = serializers.IntegerField(required=False, allow_null=True)
    
    def validate(self, data):
        """Ensure either post_id or comment_id is provided"""
        if not data.get('post_id') and not data.get('comment_id'):
            raise serializers.ValidationError(
                "Either post_id or comment_id must be provided."
            )
        if data.get('post_id') and data.get('comment_id'):
            raise serializers.ValidationError(
                "Cannot like both post and comment simultaneously."
            )
        return data


class ShareSerializer(serializers.ModelSerializer):
    """Share serializer with post and user details"""
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    post_data = PostSerializer(source='post', read_only=True)
    
    class Meta:
        model = Share
        fields = [
            'id', 'user', 'username', 'post', 'post_data',
            'caption', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'username', 'post_data', 'created_at']


class ShareCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating shares"""
    class Meta:
        model = Share
        fields = ['post', 'caption']


# Summary serializers for list views
class PostListSerializer(serializers.ModelSerializer):
    """Lightweight post serializer for feed lists"""
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_avatar = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = [
            'id', 'author_username', 'author_avatar', 'content',
            'image', 'video', 'visibility', 'likes_count',
            'comments_count', 'shares_count', 'is_liked', 'created_at'
        ]
    
    def get_author_avatar(self, obj):
        try:
            return obj.author.profile.avatar.url if obj.author.profile.avatar else None
        except:
            return None
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(
                user=request.user,
                post=obj,
                content_type='post'
            ).exists()
        return False

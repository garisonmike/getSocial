from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.db.models import Q, Prefetch
from django.shortcuts import get_object_or_404

from .models import UserProfile, Follow, Post, Comment, Like, Share
from .serializers import (
    UserSerializer, UserProfileSerializer, UserProfileUpdateSerializer,
    FollowSerializer, PostSerializer, PostCreateSerializer, PostListSerializer,
    CommentSerializer, CommentCreateSerializer, LikeSerializer,
    LikeCreateSerializer, ShareSerializer, ShareCreateSerializer
)

User = get_user_model()


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user profiles
    
    list: Get all user profiles
    retrieve: Get a specific user profile
    update: Update current user's profile
    partial_update: Partially update current user's profile
    """
    queryset = UserProfile.objects.select_related('user').all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserProfileUpdateSerializer
        return UserProfileSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter private profiles unless it's the user's own profile
        if self.request.user.is_authenticated:
            return queryset.filter(
                Q(is_private=False) | Q(user=self.request.user)
            )
        return queryset.filter(is_private=False)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        profile = get_object_or_404(UserProfile, user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def followers(self, request, pk=None):
        """Get list of followers for a user profile"""
        profile = self.get_object()
        followers = Follow.objects.filter(following=profile.user).select_related(
            'follower', 'follower__profile'
        )
        serializer = FollowSerializer(followers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def following(self, request, pk=None):
        """Get list of users that this profile is following"""
        profile = self.get_object()
        following = Follow.objects.filter(follower=profile.user).select_related(
            'following', 'following__profile'
        )
        serializer = FollowSerializer(following, many=True)
        return Response(serializer.data)


class FollowViewSet(viewsets.ModelViewSet):
    """
    ViewSet for follow relationships
    
    list: Get all follows
    create: Follow a user
    destroy: Unfollow a user
    """
    queryset = Follow.objects.select_related(
        'follower', 'following',
        'follower__profile', 'following__profile'
    ).all()
    serializer_class = FollowSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Only show follows related to the current user
        return self.queryset.filter(
            Q(follower=self.request.user) | Q(following=self.request.user)
        )
    
    def create(self, request, *args, **kwargs):
        """Follow a user"""
        following_id = request.data.get('following_id')
        
        if not following_id:
            return Response(
                {'error': 'following_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            following_user = User.objects.get(id=following_id)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already following
        if Follow.objects.filter(
            follower=request.user,
            following=following_user
        ).exists():
            return Response(
                {'error': 'Already following this user'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if trying to follow self
        if request.user == following_user:
            return Response(
                {'error': 'Cannot follow yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create follow
        follow = Follow.objects.create(
            follower=request.user,
            following=following_user
        )
        
        serializer = self.get_serializer(follow)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def unfollow(self, request):
        """Unfollow a user"""
        following_id = request.data.get('following_id')
        
        if not following_id:
            return Response(
                {'error': 'following_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            follow = Follow.objects.get(
                follower=request.user,
                following_id=following_id
            )
            follow.delete()
            return Response(
                {'message': 'Successfully unfollowed user'},
                status=status.HTTP_200_OK
            )
        except Follow.DoesNotExist:
            return Response(
                {'error': 'You are not following this user'},
                status=status.HTTP_404_NOT_FOUND
            )


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for posts
    
    list: Get all posts
    create: Create a new post
    retrieve: Get a specific post
    update: Update a post
    partial_update: Partially update a post
    destroy: Delete a post
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Post.objects.select_related(
            'author', 'author__profile'
        ).prefetch_related('likes', 'core_comments').all()
        
        # Filter based on visibility
        if self.request.user.is_authenticated:
            # Show user's own posts + public posts + follower-only from people they follow
            following_users = Follow.objects.filter(
                follower=self.request.user
            ).values_list('following', flat=True)
            
            queryset = queryset.filter(
                Q(author=self.request.user) |  # Own posts
                Q(visibility='public') |  # Public posts
                Q(visibility='followers', author__in=following_users)  # Followers-only from following
            )
        else:
            # Anonymous users: only public posts
            queryset = queryset.filter(visibility='public')
        
        return queryset.filter(is_published=True).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PostCreateSerializer
        elif self.action == 'list':
            return PostListSerializer
        return PostSerializer
    
    def perform_create(self, serializer):
        """Set the author to the current user when creating a post"""
        serializer.save(author=self.request.user)
    
    def perform_update(self, serializer):
        """Ensure users can only update their own posts"""
        if serializer.instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own posts")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Ensure users can only delete their own posts"""
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own posts")
        instance.delete()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def feed(self, request):
        """
        Get personalized feed: posts from users the current user follows
        """
        # Get users that the current user follows
        following_users = Follow.objects.filter(
            follower=request.user
        ).values_list('following', flat=True)
        
        # Get posts from followed users
        feed_posts = Post.objects.filter(
            author__in=following_users,
            is_published=True
        ).filter(
            Q(visibility='public') | Q(visibility='followers')
        ).select_related(
            'author', 'author__profile'
        ).prefetch_related('likes').order_by('-created_at')
        
        # Paginate the feed
        page = self.paginate_queryset(feed_posts)
        if page is not None:
            serializer = PostListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = PostListSerializer(feed_posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get all comments for a post"""
        post = self.get_object()
        comments = Comment.objects.filter(
            post=post,
            parent=None  # Only top-level comments
        ).select_related('author', 'author__profile').prefetch_related('replies')
        
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """
        Like a post
        """
        post = self.get_object()
        
        # Check if already liked
        existing_like = Like.objects.filter(
            user=request.user,
            post=post,
            content_type='post'
        ).first()
        
        if existing_like:
            return Response(
                {'error': 'You have already liked this post'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create like
        like = Like.objects.create(
            user=request.user,
            post=post,
            content_type='post'
        )
        
        serializer = LikeSerializer(like, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request, pk=None):
        """
        Unlike a post
        """
        post = self.get_object()
        
        try:
            like = Like.objects.get(
                user=request.user,
                post=post,
                content_type='post'
            )
            like.delete()
            return Response(
                {'message': 'Post unliked successfully'},
                status=status.HTTP_200_OK
            )
        except Like.DoesNotExist:
            return Response(
                {'error': 'You have not liked this post'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_posts(self, request):
        """Get current user's posts"""
        posts = Post.objects.filter(
            author=request.user
        ).select_related('author', 'author__profile').order_by('-created_at')
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = PostListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = PostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def share(self, request, pk=None):
        """Share a post"""
        post = self.get_object()
        caption = request.data.get('caption', '')
        
        # Check if already shared
        if Share.objects.filter(user=request.user, post=post).exists():
            return Response(
                {'error': 'You have already shared this post'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        share = Share.objects.create(
            user=request.user,
            post=post,
            caption=caption
        )
        
        serializer = ShareSerializer(share, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for comments
    
    list: Get all comments
    create: Create a new comment
    retrieve: Get a specific comment
    update: Update a comment
    partial_update: Partially update a comment
    destroy: Delete a comment
    """
    queryset = Comment.objects.select_related(
        'post', 'author', 'author__profile', 'parent'
    ).all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by post if provided
        post_id = self.request.query_params.get('post_id')
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        
        # Filter by parent if provided (get replies)
        parent_id = self.request.query_params.get('parent_id')
        if parent_id:
            queryset = queryset.filter(parent_id=parent_id)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Set the author to the current user when creating a comment"""
        serializer.save(author=self.request.user)
    
    def perform_update(self, serializer):
        """Ensure users can only update their own comments"""
        if serializer.instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own comments")
        serializer.save()
    
    def perform_destroy(self, instance):
        """Ensure users can only delete their own comments"""
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own comments")
        instance.delete()
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        """Like a comment"""
        comment = self.get_object()
        
        # Check if already liked
        if Like.objects.filter(
            user=request.user,
            comment=comment,
            content_type='comment'
        ).exists():
            return Response(
                {'error': 'You have already liked this comment'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create like
        like = Like.objects.create(
            user=request.user,
            comment=comment,
            content_type='comment'
        )
        
        serializer = LikeSerializer(like, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unlike(self, request, pk=None):
        """Unlike a comment"""
        comment = self.get_object()
        
        try:
            like = Like.objects.get(
                user=request.user,
                comment=comment,
                content_type='comment'
            )
            like.delete()
            return Response(
                {'message': 'Comment unliked successfully'},
                status=status.HTTP_200_OK
            )
        except Like.DoesNotExist:
            return Response(
                {'error': 'You have not liked this comment'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def replies(self, request, pk=None):
        """Get all replies to a comment"""
        comment = self.get_object()
        replies = Comment.objects.filter(
            parent=comment
        ).select_related('author', 'author__profile')
        
        serializer = self.get_serializer(replies, many=True)
        return Response(serializer.data)


class LikeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for likes (read-only list and detail)
    Use post.like() and comment.like() actions to create likes
    """
    queryset = Like.objects.select_related('user', 'post', 'comment').all()
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by post if provided
        post_id = self.request.query_params.get('post_id')
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        
        # Filter by comment if provided
        comment_id = self.request.query_params.get('comment_id')
        if comment_id:
            queryset = queryset.filter(comment_id=comment_id)
        
        return queryset.order_by('-created_at')


class ShareViewSet(viewsets.ModelViewSet):
    """
    ViewSet for shares
    
    list: Get all shares
    create: Share a post
    retrieve: Get a specific share
    destroy: Unshare a post
    """
    queryset = Share.objects.select_related(
        'user', 'user__profile', 'post', 'post__author'
    ).all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ShareCreateSerializer
        return ShareSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by user if provided
        user_id = self.request.query_params.get('user_id')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Filter by post if provided
        post_id = self.request.query_params.get('post_id')
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Set the user to the current user when sharing"""
        serializer.save(user=self.request.user)
    
    def perform_destroy(self, instance):
        """Ensure users can only delete their own shares"""
        if instance.user != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own shares")
        instance.delete()

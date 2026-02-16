from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import UserProfile, Follow, Post, Comment, Like, Share

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Automatically create profile when user is created"""
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=Follow)
def update_follow_counts_on_create(sender, instance, created, **kwargs):
    """Update follower/following counts when follow is created"""
    if created:
        # Update follower's following count
        follower_profile = instance.follower.profile
        follower_profile.following_count += 1
        follower_profile.save(update_fields=['following_count'])

        # Update followed user's followers count
        following_profile = instance.following.profile
        following_profile.followers_count += 1
        following_profile.save(update_fields=['followers_count'])


@receiver(post_delete, sender=Follow)
def update_follow_counts_on_delete(sender, instance, **kwargs):
    """Update follower/following counts when follow is deleted"""
    try:
        # Update follower's following count
        follower_profile = instance.follower.profile
        follower_profile.following_count = max(0, follower_profile.following_count - 1)
        follower_profile.save(update_fields=['following_count'])

        # Update followed user's followers count
        following_profile = instance.following.profile
        following_profile.followers_count = max(0, following_profile.followers_count - 1)
        following_profile.save(update_fields=['followers_count'])
    except UserProfile.DoesNotExist:
        pass


@receiver(post_save, sender=Post)
def update_posts_count_on_create(sender, instance, created, **kwargs):
    """Update user's posts count when post is created"""
    if created and instance.is_published:
        profile = instance.author.profile
        profile.posts_count += 1
        profile.save(update_fields=['posts_count'])


@receiver(post_delete, sender=Post)
def update_posts_count_on_delete(sender, instance, **kwargs):
    """Update user's posts count when post is deleted"""
    try:
        profile = instance.author.profile
        profile.posts_count = max(0, profile.posts_count - 1)
        profile.save(update_fields=['posts_count'])
    except UserProfile.DoesNotExist:
        pass


@receiver(post_save, sender=Comment)
def update_comment_counts_on_create(sender, instance, created, **kwargs):
    """Update post and parent comment counts when comment is created"""
    if created:
        # Update post comments count
        instance.post.comments_count += 1
        instance.post.save(update_fields=['comments_count'])

        # Update parent comment replies count if it's a reply
        if instance.parent:
            instance.parent.replies_count += 1
            instance.parent.save(update_fields=['replies_count'])


@receiver(post_delete, sender=Comment)
def update_comment_counts_on_delete(sender, instance, **kwargs):
    """Update post and parent comment counts when comment is deleted"""
    try:
        # Update post comments count
        instance.post.comments_count = max(0, instance.post.comments_count - 1)
        instance.post.save(update_fields=['comments_count'])

        # Update parent comment replies count if it's a reply
        if instance.parent:
            instance.parent.replies_count = max(0, instance.parent.replies_count - 1)
            instance.parent.save(update_fields=['replies_count'])
    except (Post.DoesNotExist, Comment.DoesNotExist):
        pass


@receiver(post_save, sender=Like)
def update_like_counts_on_create(sender, instance, created, **kwargs):
    """Update like counts when like is created"""
    if created:
        if instance.post:
            instance.post.likes_count += 1
            instance.post.save(update_fields=['likes_count'])
        elif instance.comment:
            instance.comment.likes_count += 1
            instance.comment.save(update_fields=['likes_count'])


@receiver(post_delete, sender=Like)
def update_like_counts_on_delete(sender, instance, **kwargs):
    """Update like counts when like is deleted"""
    try:
        if instance.post:
            instance.post.likes_count = max(0, instance.post.likes_count - 1)
            instance.post.save(update_fields=['likes_count'])
        elif instance.comment:
            instance.comment.likes_count = max(0, instance.comment.likes_count - 1)
            instance.comment.save(update_fields=['likes_count'])
    except (Post.DoesNotExist, Comment.DoesNotExist):
        pass


@receiver(post_save, sender=Share)
def update_share_count_on_create(sender, instance, created, **kwargs):
    """Update post share count when share is created"""
    if created:
        instance.post.shares_count += 1
        instance.post.save(update_fields=['shares_count'])


@receiver(post_delete, sender=Share)
def update_share_count_on_delete(sender, instance, **kwargs):
    """Update post share count when share is deleted"""
    try:
        instance.post.shares_count = max(0, instance.post.shares_count - 1)
        instance.post.save(update_fields=['shares_count'])
    except Post.DoesNotExist:
        pass


@receiver(pre_save, sender=Comment)
def track_comment_edits(sender, instance, **kwargs):
    """Track if comment has been edited"""
    if instance.pk:
        try:
            old_instance = Comment.objects.get(pk=instance.pk)
            if old_instance.content != instance.content:
                instance.is_edited = True
        except Comment.DoesNotExist:
            pass

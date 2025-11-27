from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.posts.models import Post
from apps.interactions.models import Interaction
from .models import Analytics

@receiver(post_save, sender=Post)
def create_post_analytics(sender, instance, created, **kwargs):
    if created:
        Analytics.objects.create(post=instance)

@receiver(post_save, sender=Interaction)
def update_analytics_on_interaction_save(sender, instance, created, **kwargs):
    if created:
        try:
            analytics = instance.post.analytics
            if instance.interaction_type == 'like':
                analytics.likes_count += 1
            elif instance.interaction_type == 'share':
                analytics.shares_count += 1
            analytics.save()
        except Analytics.DoesNotExist:
            pass

@receiver(post_delete, sender=Interaction)
def update_analytics_on_interaction_delete(sender, instance, **kwargs):
    try:
        analytics = instance.post.analytics
        if instance.interaction_type == 'like':
            # Ensure we don't go below zero
            analytics.likes_count = max(0, analytics.likes_count - 1)
        elif instance.interaction_type == 'share':
            analytics.shares_count = max(0, analytics.shares_count - 1)
        analytics.save()
    except Analytics.DoesNotExist:
        pass

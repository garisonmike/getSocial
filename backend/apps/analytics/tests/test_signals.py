import pytest
from apps.posts.models import Post
from apps.interactions.models import Interaction
from apps.analytics.models import Analytics
from django.contrib.auth import get_user_model

@pytest.mark.django_db
def test_analytics_signals():
    # Setup
    user = get_user_model().objects.create_user(username='user', password='password')
    author = get_user_model().objects.create_user(username='author', password='password')
    
    # 1. Create Post -> Should create Analytics automatically via signal
    post = Post.objects.create(author=author, content='Test Post')
    assert Analytics.objects.filter(post=post).exists()
    
    analytics = Analytics.objects.get(post=post)
    assert analytics.likes_count == 0
    
    # 2. Create Like Interaction -> Should increment likes_count
    Interaction.objects.create(user=user, post=post, interaction_type='like')
    
    analytics.refresh_from_db()
    assert analytics.likes_count == 1
    
    # 3. Create Share Interaction -> Should increment shares_count
    Interaction.objects.create(user=user, post=post, interaction_type='share')
    
    analytics.refresh_from_db()
    assert analytics.shares_count == 1

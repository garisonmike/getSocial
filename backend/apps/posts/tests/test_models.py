import pytest
from apps.posts.models import Post, Comment
from django.contrib.auth import get_user_model

@pytest.mark.django_db
def test_post_model():
    user = get_user_model().objects.create_user(username='author', password='password')
    post = Post.objects.create(author=user, content='Test Content')
    
    assert str(post) == f"Post {post.id} by {user}"
    assert post.content == 'Test Content'

@pytest.mark.django_db
def test_comment_model():
    user = get_user_model().objects.create_user(username='commenter', password='password')
    author = get_user_model().objects.create_user(username='author', password='password')
    post = Post.objects.create(author=author, content='Post Content')
    
    comment = Comment.objects.create(post=post, author=user, content='Nice post!')
    
    assert comment.post == post
    assert comment.author == user
    assert str(comment) == f"Comment {comment.id} by {user.username}"

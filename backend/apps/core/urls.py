from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet,
    FollowViewSet,
    PostViewSet,
    CommentViewSet,
    LikeViewSet,
    ShareViewSet
)

app_name = 'core'

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'follows', FollowViewSet, basename='follow')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'shares', ShareViewSet, basename='share')

urlpatterns = [
    path('', include(router.urls)),
]

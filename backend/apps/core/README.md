# Core App - Database Schema Documentation

## Overview
The `core` app provides the foundational database schema for the getSocial social media application. It includes models for user profiles, posts, comments, likes, follows, and shares.

## Models

### 1. UserProfile
Extended user profile with social media features.

**Fields:**
- `user` (OneToOne) - Link to Django User model
- `bio` (TextField) - User biography (max 500 chars)
- `avatar` (ImageField) - Profile picture
- `cover_photo` (ImageField) - Cover/banner photo
- `location` (CharField) - User's location
- `website` (URLField) - Personal website
- `date_of_birth` (DateField) - Birth date
- `is_verified` (BooleanField) - Verification badge
- `is_private` (BooleanField) - Private account setting
- `followers_count` (PositiveIntegerField) - Number of followers
- `following_count` (PositiveIntegerField) - Number of people following
- `posts_count` (PositiveIntegerField) - Number of posts created
- `created_at` / `updated_at` - Timestamps

**Features:**
- Automatically created when a new user registers (via signals)
- Counts are automatically updated via signals
- Supports profile visibility (public/private)

---

### 2. Follow
Represent following relationships between users.

**Fields:**
- `follower` (ForeignKey) - User who is following
- `following` (ForeignKey) - User being followed
- `created_at` - When the follow occurred

**Features:**
- Prevents self-following (validation in save method)
- Unique constraint on (follower, following) pair
- Automatically updates follower/following counts via signals
- Indexed for performance on both follower and following lookups

**Relationships:**
- User.following - Returns all users this user is following
- User.followers - Returns all users following this user

---

### 3. Post
Social media posts with rich media support.

**Fields:**
- `author` (ForeignKey) - Post creator
- `content` (TextField) - Post text content (max 2200 chars)
- `image` (ImageField) - Optional image attachment
- `video` (FileField) - Optional video attachment
- `visibility` (CharField) - public/followers/private
- `is_published` (BooleanField) - Publication status
- `is_pinned` (BooleanField) - Pin to profile
- `likes_count` (PositiveIntegerField) - Total likes
- `comments_count` (PositiveIntegerField) - Total comments
- `shares_count` (PositiveIntegerField) - Total shares
- `views_count` (PositiveIntegerField) - View count
- `created_at` / `updated_at` - Timestamps

**Features:**
- Supports both images and videos
- Three visibility levels for privacy control
- Engagement metrics automatically updated via signals
- Indexed for feed queries and author lookups

**Media Storage:**
- Images: `posts/images/YYYY/MM/DD/`
- Videos: `posts/videos/YYYY/MM/DD/`

---

### 4. Comment
Comments and nested replies on posts.

**Fields:**
- `post` (ForeignKey) - Parent post
- `author` (ForeignKey) - Comment author
- `parent` (ForeignKey self) - Parent comment (for replies)
- `content` (TextField) - Comment text (max 1000 chars)
- `likes_count` (PositiveIntegerField) - Comment likes
- `replies_count` (PositiveIntegerField) - Number of replies
- `is_edited` (BooleanField) - Edit tracking
- `created_at` / `updated_at` - Timestamps

**Features:**
- Supports nested replies (self-referential FK)
- Automatically tracks edits via pre_save signal
- Updates post and parent comment counts via signals
- `is_reply` property to check if it's a reply

**Relationships:**
- `comment.replies` - Get all replies to a comment
- `post.core_comments` - Get all comments on a post

---

### 5. Like
Universal like system for posts and comments.

**Fields:**
- `user` (ForeignKey) - User who liked
- `content_type` (CharField) - 'post' or 'comment'
- `post` (ForeignKey) - Liked post (optional)
- `comment` (ForeignKey) - Liked comment (optional)
- `created_at` - When the like occurred

**Features:**
- Single model for both post and comment likes
- Prevents duplicate likes (unique constraints)
- Automatically updates like counts via signals
- Indexed for performance

**Constraints:**
- Unique together: (user, post)
- Unique together: (user, comment)

---

### 6. Share
Post sharing/reposting functionality.

**Fields:**
- `user` (ForeignKey) - User who shared
- `post` (ForeignKey) - Shared post
- `caption` (TextField) - Optional caption (max 500 chars)
- `created_at` - When shared

**Features:**
- Allows users to reshare posts to their followers
- Optional caption for adding context
- Automatically updates post share count via signals
- Indexed for user timeline queries

---

## Database Relationships

```
User (from auth)
  ├── OneToOne → UserProfile
  ├── ForeignKey ← Post (author)
  ├── ForeignKey ← Comment (author)
  ├── ForeignKey ← Like (user)
  ├── ForeignKey ← Share (user)
  ├── ForeignKey ← Follow (follower)
  └── ForeignKey ← Follow (following)

Post
  ├── ForeignKey → User (author)
  ├── ForeignKey ← Comment (post)
  ├── ForeignKey ← Like (post)
  └── ForeignKey ← Share (post)

Comment
  ├── ForeignKey → Post (post)
  ├── ForeignKey → User (author)
  ├── ForeignKey → Comment (parent - self ref)
  └── ForeignKey ← Like (comment)
```

## Signals

All count fields are automatically maintained through Django signals:

1. **UserProfile Signals:**
   - Auto-create profile on user registration
   - Update followers/following counts on Follow create/delete
   - Update posts count on Post create/delete

2. **Post Signals:**
   - Update author's post count on create/delete

3. **Comment Signals:**
   - Update post comment count on create/delete
   - Update parent comment reply count on create/delete
   - Track edits via pre_save signal

4. **Like Signals:**
   - Update post/comment like counts on create/delete

5. **Share Signals:**
   - Update post share count on create/delete

## Indexes

Performance indexes are created on:
- Follow: (follower, created_at), (following, created_at)
- Post: (author, created_at), (is_published, created_at), likes_count
- Comment: (post, created_at), (parent, created_at)
- Like: (post, created_at), (comment, created_at)
- Share: (user, created_at), (post, created_at)

## Usage Examples

### Create a post
```python
from apps.core.models import Post
from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.get(username='john')

post = Post.objects.create(
    author=user,
    content="Hello, getSocial!",
    visibility='public'
)
```

### Follow a user
```python
from apps.core.models import Follow

follower = User.objects.get(username='alice')
following = User.objects.get(username='bob')

follow = Follow.objects.create(
    follower=follower,
    following=following
)
# follower and following counts automatically updated
```

### Comment on a post
```python
from apps.core.models import Comment

comment = Comment.objects.create(
    post=post,
    author=user,
    content="Great post!"
)
# post.comments_count automatically incremented

# Reply to comment
reply = Comment.objects.create(
    post=post,
    author=another_user,
    parent=comment,
    content="I agree!"
)
# comment.replies_count automatically incremented
```

### Like a post
```python
from apps.core.models import Like

like = Like.objects.create(
    user=user,
    content_type='post',
    post=post
)
# post.likes_count automatically incremented
```

## Migration Commands

To create and apply the migrations:

```bash
# Create migrations
python manage.py makemigrations core

# Apply migrations
python manage.py migrate core

# Create a superuser to access admin
python manage.py createsuperuser
```

## Admin Interface

All models are registered in the Django admin with:
- List displays showing key fields
- Filters for dates and status fields
- Search functionality
- Read-only fields for auto-calculated counts

Access at: `http://localhost:8000/admin/`

## Notes

- All timestamps are in UTC
- Media files require `MEDIA_ROOT` and `MEDIA_URL` configuration in settings
- Pillow is required for image field support
- The schema is optimized for read-heavy social media workloads
- Consider adding caching for frequently accessed data (user profiles, popular posts)

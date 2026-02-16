# Quick Start Guide - Core API Endpoints

## Setup

1. **Install dependencies:**
```bash
cd /home/spiderman/Projects/getSocial
source venv/bin/activate
pip install djangorestframework django-filter
```

2. **Apply migrations:**
```bash
cd backend
python manage.py migrate
```

3. **Create a test user:**
```bash
python manage.py createsuperuser
# Follow prompts to create username/password
```

4. **Start the server:**
```bash
python manage.py runserver
```

---

## Your Three Required Endpoints

### 1. Creating a Post ✅

**Endpoint:** `POST /api/posts/`

**Authentication:** Required

**Request:**
```bash
curl -X POST http://localhost:8000/api/posts/ \
  -u username:password \
  -H "Content-Type: application/json" \
  -d '{
    "content": "My first post on getSocial!",
    "visibility": "public",
    "is_published": true
  }'
```

**With Image:**
```bash
curl -X POST http://localhost:8000/api/posts/ \
  -u username:password \
  -F "content=Check out this photo!" \
  -F "image=@/path/to/photo.jpg" \
  -F "visibility=public"
```

**Response:**
```json
{
  "id": 1,
  "author": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "author_username": "john",
  "author_profile": {
    "avatar": null,
    "is_verified": false
  },
  "content": "My first post on getSocial!",
  "image": null,
  "video": null,
  "visibility": "public",
  "is_published": true,
  "is_pinned": false,
  "likes_count": 0,
  "comments_count": 0,
  "shares_count": 0,
  "views_count": 0,
  "is_liked": false,
  "created_at": "2026-02-16T10:30:00Z",
  "updated_at": "2026-02-16T10:30:00Z"
}
```

---

### 2. Fetching User's Feed ✅

**Endpoint:** `GET /api/posts/feed/`

**Authentication:** Required

**Description:** Returns posts from users you follow, ordered by most recent.

**Request:**
```bash
curl -X GET http://localhost:8000/api/posts/feed/ \
  -u username:password
```

**With Pagination:**
```bash
curl -X GET "http://localhost:8000/api/posts/feed/?page=1" \
  -u username:password
```

**Response:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/posts/feed/?page=2",
  "previous": null,
  "results": [
    {
      "id": 15,
      "author_username": "alice",
      "author_avatar": "http://localhost:8000/media/profiles/avatars/alice.jpg",
      "content": "Just finished a great workout! 💪",
      "image": "http://localhost:8000/media/posts/images/2026/02/16/workout.jpg",
      "video": null,
      "visibility": "public",
      "likes_count": 42,
      "comments_count": 7,
      "shares_count": 3,
      "is_liked": false,
      "created_at": "2026-02-16T09:15:00Z"
    },
    {
      "id": 14,
      "author_username": "bob",
      "author_avatar": "http://localhost:8000/media/profiles/avatars/bob.jpg",
      "content": "Beautiful sunset today 🌅",
      "image": null,
      "video": null,
      "visibility": "followers",
      "likes_count": 18,
      "comments_count": 2,
      "shares_count": 1,
      "is_liked": true,
      "created_at": "2026-02-16T08:45:00Z"
    }
  ]
}
```

**Note:** Feed only shows posts from users you follow. First, follow some users to see content in your feed.

---

### 3. Liking a Post ✅

**Endpoint:** `POST /api/posts/{post_id}/like/`

**Authentication:** Required

**Request:**
```bash
# Like post with ID 15
curl -X POST http://localhost:8000/api/posts/15/like/ \
  -u username:password
```

**Response:**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "username": "john",
  "content_type": "post",
  "post": 15,
  "comment": null,
  "created_at": "2026-02-16T10:35:00Z"
}
```

**Unlike a Post:**
```bash
curl -X POST http://localhost:8000/api/posts/15/unlike/ \
  -u username:password
```

**Error Response (Already Liked):**
```json
{
  "error": "You have already liked this post"
}
```

---

## Complete Workflow Example

Here's a complete workflow demonstrating all three endpoints:

```bash
# 1. Create two test users (do this via Django admin or shell)
# User 1: alice
# User 2: bob

# 2. Alice creates a post
curl -X POST http://localhost:8000/api/posts/ \
  -u alice:password123 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello from Alice!",
    "visibility": "public"
  }'
# Response: Post ID = 1

# 3. Bob follows Alice
curl -X POST http://localhost:8000/api/follows/ \
  -u bob:password456 \
  -H "Content-Type: application/json" \
  -d '{
    "following_id": 1
  }'

# 4. Alice creates another post
curl -X POST http://localhost:8000/api/posts/ \
  -u alice:password123 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is my second post!",
    "visibility": "public"
  }'
# Response: Post ID = 2

# 5. Bob views his feed (sees Alice's posts)
curl -X GET http://localhost:8000/api/posts/feed/ \
  -u bob:password456

# 6. Bob likes Alice's second post
curl -X POST http://localhost:8000/api/posts/2/like/ \
  -u bob:password456

# 7. Bob views the post again (is_liked will be true)
curl -X GET http://localhost:8000/api/posts/2/ \
  -u bob:password456
```

---

## Python Testing Example

```python
import requests
from requests.auth import HTTPBasicAuth

BASE_URL = 'http://localhost:8000/api'
auth = HTTPBasicAuth('username', 'password')

# 1. Create a post
response = requests.post(
    f'{BASE_URL}/posts/',
    auth=auth,
    json={
        'content': 'My first post!',
        'visibility': 'public'
    }
)
post = response.json()
print(f"Created post: {post['id']}")

# 2. Get feed
response = requests.get(f'{BASE_URL}/posts/feed/', auth=auth)
feed = response.json()
print(f"Feed has {feed['count']} posts")

# 3. Like the first post in feed
if feed['results']:
    first_post_id = feed['results'][0]['id']
    response = requests.post(
        f'{BASE_URL}/posts/{first_post_id}/like/',
        auth=auth
    )
    print(f"Liked post {first_post_id}")
```

---

## Using the Browsable API

1. Login to Django admin: `http://localhost:8000/admin/`
2. Visit: `http://localhost:8000/api/`
3. Browse endpoints with a nice UI
4. Test POST/PUT/DELETE directly from the browser

---

## Additional Useful Endpoints

### Follow a user
```bash
curl -X POST http://localhost:8000/api/follows/ \
  -u username:password \
  -H "Content-Type: application/json" \
  -d '{"following_id": 2}'
```

### Comment on a post
```bash
curl -X POST http://localhost:8000/api/comments/ \
  -u username:password \
  -H "Content-Type: application/json" \
  -d '{
    "post": 1,
    "content": "Great post!"
  }'
```

### Get your profile
```bash
curl -X GET http://localhost:8000/api/profiles/me/ \
  -u username:password
```

### Get your own posts
```bash
curl -X GET http://localhost:8000/api/posts/my_posts/ \
  -u username:password
```

---

## Testing Checklist

- [ ] Create at least 2 users
- [ ] User A creates a post
- [ ] User B follows User A
- [ ] User B fetches feed (should see User A's post)
- [ ] User B likes User A's post
- [ ] Verify like count incremented
- [ ] Verify `is_liked` returns true for User B
- [ ] User B unlikes the post
- [ ] Verify like count decremented

---

## Troubleshooting

### "Authentication credentials were not provided"
- Make sure you're passing `-u username:password` with curl
- Or login via Django admin first

### "You have already liked this post"
- Use the unlike endpoint first: `POST /api/posts/{id}/unlike/`

### Empty feed
- Follow some users first: `POST /api/follows/`
- Make sure followed users have created posts

### Media files not working
- Check `MEDIA_ROOT` and `MEDIA_URL` in settings
- For development, make sure DEBUG=True
- Check file permissions on media directory

---

## Next Steps

1. Add JWT authentication for mobile apps
2. Implement real-time notifications
3. Add post editing
4. Add hashtag support
5. Implement search functionality
6. Add analytics tracking

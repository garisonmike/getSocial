# Core API Documentation

## Overview
RESTful API endpoints for the getSocial social media application. All endpoints are prefixed with `/api/`.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
Most endpoints require authentication. Use Session Authentication or Basic Authentication.

For authenticated requests, ensure you're logged in via:
- Django admin session
- Basic Auth header: `Authorization: Basic <base64(username:password)>`

---

## Endpoints

### 1. User Profiles

#### List all profiles
```http
GET /api/profiles/
```
Returns paginated list of public user profiles.

#### Get current user's profile
```http
GET /api/profiles/me/
```
**Auth Required:** Yes

#### Get specific profile
```http
GET /api/profiles/{id}/
```

#### Update current user's profile
```http
PUT /api/profiles/{id}/
PATCH /api/profiles/{id}/
```
**Auth Required:** Yes

**Body:**
```json
{
  "bio": "Updated bio",
  "location": "New York",
  "website": "https://example.com",
  "is_private": false
}
```

#### Get user's followers
```http
GET /api/profiles/{id}/followers/
```

#### Get user's following
```http
GET /api/profiles/{id}/following/
```

---

### 2. Follow System

#### Follow a user
```http
POST /api/follows/
```
**Auth Required:** Yes

**Body:**
```json
{
  "following_id": 123
}
```

**Response:**
```json
{
  "id": 1,
  "follower": {...},
  "following": {...},
  "follower_username": "alice",
  "following_username": "bob",
  "created_at": "2026-02-16T10:30:00Z"
}
```

#### Unfollow a user
```http
POST /api/follows/unfollow/
```
**Auth Required:** Yes

**Body:**
```json
{
  "following_id": 123
}
```

#### List follows
```http
GET /api/follows/
```
Returns follows related to the current authenticated user.

---

### 3. Posts

#### Create a post 
```http
POST /api/posts/
```
**Auth Required:** Yes

**Body (multipart/form-data):**
```json
{
  "content": "Hello, getSocial!",
  "image": <file>,
  "video": <file>,
  "visibility": "public",
  "is_published": true
}
```

**Visibility options:**
- `public` - Everyone can see
- `followers` - Only followers can see
- `private` - Only you can see

**Response:**
```json
{
  "id": 1,
  "author": {...},
  "author_username": "john",
  "content": "Hello, getSocial!",
  "image": "http://localhost:8000/media/posts/images/2026/02/16/image.jpg",
  "video": null,
  "visibility": "public",
  "is_published": true,
  "likes_count": 0,
  "comments_count": 0,
  "shares_count": 0,
  "views_count": 0,
  "is_liked": false,
  "created_at": "2026-02-16T10:30:00Z",
  "updated_at": "2026-02-16T10:30:00Z"
}
```

#### Get user's feed 
```http
GET /api/posts/feed/
```
**Auth Required:** Yes

Returns posts from users the current user follows, ordered by most recent.

**Response:**
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/posts/feed/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "author_username": "bob",
      "author_avatar": "http://localhost:8000/media/profiles/avatars/bob.jpg",
      "content": "Check out this post!",
      "image": null,
      "video": null,
      "visibility": "public",
      "likes_count": 42,
      "comments_count": 7,
      "shares_count": 3,
      "is_liked": false,
      "created_at": "2026-02-16T09:15:00Z"
    },
    ...
  ]
}
```

#### List all posts
```http
GET /api/posts/
```
Returns all visible posts based on authentication and visibility settings.

#### Get specific post
```http
GET /api/posts/{id}/
```

#### Get current user's posts
```http
GET /api/posts/my_posts/
```
**Auth Required:** Yes

#### Update a post
```http
PUT /api/posts/{id}/
PATCH /api/posts/{id}/
```
**Auth Required:** Yes (must be post author)

#### Delete a post
```http
DELETE /api/posts/{id}/
```
**Auth Required:** Yes (must be post author)

#### Like a post 
```http
POST /api/posts/{id}/like/
```
**Auth Required:** Yes

**Response:**
```json
{
  "id": 1,
  "user": {...},
  "username": "alice",
  "content_type": "post",
  "post": 123,
  "comment": null,
  "created_at": "2026-02-16T10:30:00Z"
}
```

#### Unlike a post
```http
POST /api/posts/{id}/unlike/
```
**Auth Required:** Yes

#### Share a post
```http
POST /api/posts/{id}/share/
```
**Auth Required:** Yes

**Body:**
```json
{
  "caption": "Great post!"
}
```

#### Get post comments
```http
GET /api/posts/{id}/comments/
```
Returns all top-level comments for a post.

---

### 4. Comments

#### Create a comment
```http
POST /api/comments/
```
**Auth Required:** Yes

**Body:**
```json
{
  "post": 123,
  "parent": null,
  "content": "Great post!"
}
```

For replies, include `parent` comment ID:
```json
{
  "post": 123,
  "parent": 456,
  "content": "I agree!"
}
```

#### List comments
```http
GET /api/comments/
```

**Query parameters:**
- `post_id` - Filter by post
- `parent_id` - Filter by parent comment (get replies)

#### Get specific comment
```http
GET /api/comments/{id}/
```

#### Update a comment
```http
PUT /api/comments/{id}/
PATCH /api/comments/{id}/
```
**Auth Required:** Yes (must be comment author)

#### Delete a comment
```http
DELETE /api/comments/{id}/
```
**Auth Required:** Yes (must be comment author)

#### Like a comment
```http
POST /api/comments/{id}/like/
```
**Auth Required:** Yes

#### Unlike a comment
```http
POST /api/comments/{id}/unlike/
```
**Auth Required:** Yes

#### Get comment replies
```http
GET /api/comments/{id}/replies/
```

---

### 5. Likes

#### List likes
```http
GET /api/likes/
```

**Query parameters:**
- `post_id` - Filter by post
- `comment_id` - Filter by comment

**Response:**
```json
{
  "count": 42,
  "results": [
    {
      "id": 1,
      "user": {...},
      "username": "alice",
      "content_type": "post",
      "post": 123,
      "comment": null,
      "created_at": "2026-02-16T10:30:00Z"
    },
    ...
  ]
}
```

#### Get specific like
```http
GET /api/likes/{id}/
```

---

### 6. Shares

#### List shares
```http
GET /api/shares/
```

**Query parameters:**
- `user_id` - Filter by user
- `post_id` - Filter by post

#### Create a share
```http
POST /api/shares/
```
**Auth Required:** Yes

**Body:**
```json
{
  "post": 123,
  "caption": "Check this out!"
}
```

#### Get specific share
```http
GET /api/shares/{id}/
```

#### Delete a share
```http
DELETE /api/shares/{id}/
```
**Auth Required:** Yes (must be share owner)

---

## Common Response Formats

### Success Response
```json
{
  "id": 1,
  ...
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

### Validation Error
```json
{
  "field_name": ["Error message for this field"]
}
```

### Paginated Response
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Usage Examples

### Example 1: Create a Post

```bash
curl -X POST http://localhost:8000/api/posts/ \
  -u username:password \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello, getSocial!",
    "visibility": "public"
  }'
```

### Example 2: Get User Feed

```bash
curl -X GET http://localhost:8000/api/posts/feed/ \
  -u username:password
```

### Example 3: Like a Post

```bash
curl -X POST http://localhost:8000/api/posts/123/like/ \
  -u username:password
```

### Example 4: Follow a User

```bash
curl -X POST http://localhost:8000/api/follows/ \
  -u username:password \
  -H "Content-Type: application/json" \
  -d '{
    "following_id": 456
  }'
```

### Example 5: Create a Comment

```bash
curl -X POST http://localhost:8000/api/comments/ \
  -u username:password \
  -H "Content-Type: application/json" \
  -d '{
    "post": 123,
    "content": "Great post!"
  }'
```

---

## Features

### Automatic Features
- **Engagement counters**: All like, comment, share counts are automatically updated via Django signals
- **User profile creation**: Profiles are auto-created when a user registers
- **Nested comments**: Support for threaded discussions
- **Privacy controls**: Public, followers-only, and private post visibility
- **Permission checks**: Users can only edit/delete their own content

### Query Optimization
- Uses `select_related` and `prefetch_related` for efficient database queries
- Paginated results for better performance with large datasets

### Validation
- Prevents self-following
- Prevents duplicate likes
- Ensures comments/replies belong to correct posts
- Validates visibility settings

---

## Testing with Django Admin

1. Create users via Django admin or shell:
```bash
python manage.py createsuperuser
```

2. Login at: `http://localhost:8000/admin/`

3. Access API at: `http://localhost:8000/api/`

4. Use browsable API for testing (when logged in via admin)

---

## Next Steps

1. **Install dependencies:**
   ```bash
   pip install djangorestframework django-filter
   ```

2. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

3. **Create a superuser:**
   ```bash
   python manage.py createsuperuser
   ```

4. **Start the server:**
   ```bash
   python manage.py runserver
   ```

5. **Test the API:**
   - Visit `http://localhost:8000/api/`
   - Browse available endpoints
   - Test with curl, Postman, or the browsable API

---

## Rate Limiting & Production Notes

For production deployment, consider:
- Add JWT authentication for token-based auth
- Implement rate limiting (django-ratelimit)
- Add caching (Redis) for frequently accessed data
- Use CDN for media files
- Add content moderation
- Implement real-time notifications (WebSockets/Channels)
- Add search functionality (Elasticsearch)

# SocialFeed Component

A modern, Instagram/Twitter-style social feed component for the getSocial application.

## Features

-  Modern, clean UI with Tailwind CSS
-  Optimistic like updates (instant UI feedback)
-  Infinite scroll with "Load More" functionality
-  Responsive design
-  Fast and smooth animations
-  Beautiful gradient avatars for users without profile pictures
- ⏰ Smart time formatting (e.g., "2h ago", "just now")
-  Automatic error recovery and retry logic

## Components

### SocialFeed
The main feed container that fetches and displays posts from `/api/posts/`.

**Features:**
- Pagination support
- Loading states
- Error handling with retry
- Empty state messaging

### SocialPostCard
Individual post card with modern styling.

**Features:**
- Optimistic like updates (UI updates immediately, then syncs with backend)
- Hover effects and transitions
- Author profile linking
- Image display support
- Action buttons (Like, Comment, Share, Bookmark)
- Smart time formatting

## Usage

### Basic Usage

```jsx
import SocialFeed from '../components/SocialFeed'

function MyPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <SocialFeed />
        </div>
    )
}
```

### With Create Post

```jsx
import SocialFeed from '../components/SocialFeed'
import CreatePost from '../components/CreatePost'

function FeedPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <CreatePost />
            <SocialFeed />
        </div>
    )
}
```

### Using Individual Post Cards

```jsx
import SocialPostCard from '../components/SocialPostCard'

function MyComponent() {
    const handleLikeUpdate = (postId, isLiked, newCount) => {
        console.log(`Post ${postId} is now ${isLiked ? 'liked' : 'unliked'}`)
    }

    return (
        <SocialPostCard 
            post={postData} 
            onLikeUpdate={handleLikeUpdate}
        />
    )
}
```

## Routes

Access the social feed at: `/social`

## API Endpoints Used

- `GET /api/posts/` - Fetch all posts with pagination
- `POST /api/posts/{id}/like/` - Like a post
- `POST /api/posts/{id}/unlike/` - Unlike a post

## Styling

The components use Tailwind CSS with a modern design inspired by Instagram and Twitter:

- Clean white cards with subtle shadows
- Rounded corners and smooth transitions
- Gradient avatars for users without profile pictures
- Hover effects for better interactivity
- Responsive layout that works on all screen sizes

## Optimistic Updates

The like button uses optimistic updates for the best user experience:

1. User clicks like button
2. UI updates immediately (instant feedback)
3. Request sent to backend
4. If request fails, UI reverts to previous state
5. User sees error message

This ensures the app feels fast and responsive, even on slow connections.

## Customization

You can customize the colors by modifying the Tailwind classes:

```jsx
// Change primary color from blue to purple
className="text-blue-500" → className="text-purple-500"
className="bg-blue-50" → className="bg-purple-50"
```

## Post Data Structure

The components expect posts with the following structure:

```javascript
{
    id: number,
    content: string,
    image: string | null,
    author: string,
    author_username: string,
    author_avatar: string | null,
    created_at: string (ISO date),
    likes_count: number,
    comments_count: number,
    shares_count: number,
    is_liked: boolean
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Tips

- Images are lazy-loaded by the browser
- Only visible posts are rendered
- Optimistic updates reduce perceived latency
- Pagination prevents loading too many posts at once

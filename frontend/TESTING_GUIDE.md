# Testing the SocialFeed Component

## Quick Start

1. **Start the development server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to the social feed:**
   Open your browser and go to: `http://localhost:3000/social`

## Testing Checklist

### ✅ Visual Tests

- [ ] Posts display in a clean, card-based layout
- [ ] Profile avatars show (or gradient placeholder if no avatar)
- [ ] Post images display correctly
- [ ] Time stamps show relative time (e.g., "2h ago")
- [ ] Hover effects work on interactive elements
- [ ] Cards have subtle shadows and borders

### ✅ Like Button Tests

- [ ] Click like button - it turns red immediately (optimistic update)
- [ ] Like count increases by 1 immediately
- [ ] Click again to unlike - it turns gray immediately
- [ ] Like count decreases by 1 immediately
- [ ] Check network tab - API calls are made in background
- [ ] Try liking while offline - should revert if API fails

### ✅ Loading States

- [ ] Initial load shows spinner with "Loading your feed..."
- [ ] "Load More" button appears at bottom if more posts exist
- [ ] Clicking "Load More" shows loading spinner in button
- [ ] New posts append to the list smoothly

### ✅ Error Handling

- [ ] Stop backend server and try loading feed
- [ ] Error message should display
- [ ] "Retry" button should appear
- [ ] Clicking retry attempts to reload feed

### ✅ Empty State

- [ ] With no posts, shows "No posts yet" message
- [ ] Displays 📭 emoji
- [ ] Encourages user to be first to share

### ✅ Responsive Design

- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1440px)
- [ ] All elements scale appropriately
- [ ] Touch targets are large enough on mobile

### ✅ Performance

- [ ] Posts load quickly
- [ ] Animations are smooth (60fps)
- [ ] Images don't cause layout shift
- [ ] No console errors
- [ ] No unnecessary re-renders

## Testing with Mock Data

If your backend isn't ready, you can test with mock data:

```javascript
// In SocialFeed.jsx, temporarily replace fetchPosts with:
const fetchPosts = async () => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockPosts = [
        {
            id: 1,
            content: "Just built an amazing social feed with React and Tailwind! 🚀",
            image: null,
            author: "alice",
            author_username: "alice",
            author_avatar: null,
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            likes_count: 15,
            comments_count: 3,
            shares_count: 1,
            is_liked: false
        },
        {
            id: 2,
            content: "Beautiful sunset today! 🌅",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
            author: "bob",
            author_username: "bob",
            author_avatar: null,
            created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            likes_count: 42,
            comments_count: 8,
            shares_count: 5,
            is_liked: true
        },
        // Add more mock posts...
    ]
    
    setPosts(mockPosts)
    setHasMore(false)
    setIsLoading(false)
}
```

## Browser DevTools Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Watch for:
   - `GET /api/posts/` on page load
   - `POST /api/posts/{id}/like/` when clicking like

### Check for Errors
1. Open Console tab
2. Should see no errors
3. Optional: Check for warnings

### Test Performance
1. Open Performance tab
2. Record while scrolling through feed
3. Check for smooth 60fps rendering

## Common Issues

### Issue: Posts don't load
- **Check:** Is the backend running?
- **Check:** Is CORS configured correctly?
- **Check:** Check browser console for errors
- **Fix:** Update `CORS_ALLOWED_ORIGINS` in Django settings

### Issue: Like button doesn't work
- **Check:** Are you authenticated?
- **Check:** Does the `/api/posts/{id}/like/` endpoint exist?
- **Check:** Check network tab for failed requests
- **Fix:** Verify authentication token is being sent

### Issue: Images don't display
- **Check:** Are image URLs valid?
- **Check:** Is MEDIA_URL configured in Django?
- **Check:** Are images served correctly?
- **Fix:** Update media file serving in Django

### Issue: Styling looks broken
- **Check:** Is Tailwind CSS properly installed?
- **Check:** Is the dev server running?
- **Check:** Are there any CSS build errors?
- **Fix:** Run `npm install` and restart dev server

## API Response Format Expected

The component expects this format from `/api/posts/`:

```json
{
    "count": 25,
    "next": "http://localhost:8000/api/posts/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "content": "Post content here",
            "image": "http://localhost:8000/media/posts/image.jpg",
            "author": "username",
            "author_username": "username",
            "author_avatar": "http://localhost:8000/media/avatars/user.jpg",
            "created_at": "2026-02-16T10:30:00Z",
            "likes_count": 10,
            "comments_count": 5,
            "shares_count": 2,
            "is_liked": false
        }
    ]
}
```

## Next Steps

After basic testing:
1. Add comment functionality
2. Add share functionality
3. Add post creation inline
4. Add infinite scroll (instead of "Load More" button)
5. Add real-time updates with WebSockets
6. Add image viewer modal
7. Add user profile popover on avatar hover

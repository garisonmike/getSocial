# Component Architecture

## 📊 Component Hierarchy

```
App.jsx
└── Routes
    └── Layout
        └── SocialFeedPage (Route: /social)
            ├── CreatePost
            └── SocialFeed
                └── SocialPostCard (multiple instances)
                    ├── Avatar/Profile Link
                    ├── Post Content
                    ├── Post Image (optional)
                    └── Action Buttons
                        ├── Like Button (optimistic)
                        ├── Comment Button
                        ├── Share Button
                        └── Bookmark Button
```

## 🔄 Data Flow

```
User Action → Optimistic UI Update → API Call → Success/Error Handler
                                                        ↓
                                              Confirm/Revert UI State
```

### Example: Like Button Flow

```
1. User clicks ❤️
   └─→ setIsLiked(true) immediately
   └─→ setLikesCount(count + 1) immediately
   └─→ UI updates (instant feedback)

2. API call starts
   └─→ POST /api/posts/{id}/like/

3. Success
   └─→ State remains (already updated)
   └─→ User sees: ❤️ (red, filled)

3. Error (if API fails)
   └─→ setIsLiked(false) revert
   └─→ setLikesCount(count) revert
   └─→ User sees: 🤍 (gray, outline)
```

## 📂 File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SocialFeed.jsx           ← Main container
│   │   └── SocialPostCard.jsx       ← Individual post
│   ├── pages/
│   │   └── SocialFeedPage.jsx       ← Page wrapper
│   ├── services/
│   │   └── api.js                    ← API calls (already exists)
│   ├── examples/
│   │   └── SocialFeedExamples.jsx   ← Usage examples
│   └── App.jsx                       ← Routes (updated)
│
├── SOCIALFEED_README.md              ← Documentation
├── TESTING_GUIDE.md                  ← Testing guide
└── IMPLEMENTATION_SUMMARY.md         ← This summary
```

## 🎯 Component Responsibilities

### SocialFeed.jsx
**Purpose:** Container component for the feed
```javascript
- Fetch posts from API
- Handle pagination
- Manage loading states
- Handle errors
- Pass data to SocialPostCard
```

### SocialPostCard.jsx
**Purpose:** Display individual post
```javascript
- Render post content
- Handle like/unlike (optimistic)
- Display user info
- Show action buttons
- Format timestamps
```

### SocialFeedPage.jsx
**Purpose:** Page layout
```javascript
- Provide authentication check
- Include CreatePost component
- Include SocialFeed component
- Handle page-level styling
```

## 🎨 Styling Architecture

### Tailwind Classes Used

**Layout:**
- `max-w-2xl mx-auto` - Centered content, 672px max width
- `px-4 py-6` - Padding for mobile responsiveness
- `space-y-4` - Vertical spacing between posts

**Cards:**
- `bg-white rounded-xl shadow-sm` - White card with rounded corners
- `border border-gray-200` - Subtle border
- `hover:shadow-md` - Elevation on hover

**Buttons:**
- `transition-all duration-200` - Smooth animations
- `hover:bg-gray-100` - Hover states
- `disabled:opacity-50` - Disabled states

**Colors:**
- Primary: `blue-500, blue-600`
- Accent: `red-500` (likes), `purple-500` (gradients)
- Neutrals: `gray-50` to `gray-900`

## 🔌 API Endpoints Used

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/posts/` | GET | Fetch posts | Paginated list |
| `/api/posts/?page=2` | GET | Next page | Paginated list |
| `/api/posts/{id}/like/` | POST | Like post | Success |
| `/api/posts/{id}/unlike/` | POST | Unlike post | Success |

## 💾 State Management

### Component-level State
```javascript
// SocialFeed.jsx
const [posts, setPosts] = useState([])        // All posts
const [isLoading, setIsLoading] = useState(true)  // Loading state
const [page, setPage] = useState(1)           // Current page
const [hasMore, setHasMore] = useState(true)  // More posts?
const [error, setError] = useState(null)      // Error message

// SocialPostCard.jsx
const [isLiked, setIsLiked] = useState(false)     // Like state
const [likesCount, setLikesCount] = useState(0)   // Like count
const [isLiking, setIsLiking] = useState(false)   // Prevent spam
```

### Props Flow
```javascript
SocialFeed
  ↓ post data
SocialPostCard
  ↑ like updates
SocialFeed (updates posts array)
```

## 🚀 Performance Optimizations

1. **Optimistic Updates**
   - UI updates before API response
   - Feels instant to users

2. **Lazy Loading**
   - Images loaded by browser lazy loading
   - Only visible content rendered

3. **Pagination**
   - Load 20 posts at a time
   - Prevents overwhelming the browser

4. **Efficient Re-renders**
   - Proper key props on mapped elements
   - Minimal state changes

5. **Error Boundaries**
   - Graceful error handling
   - Retry mechanisms

## 📱 Responsive Design

### Mobile (< 640px)
- Full width cards
- Stacked layout
- Touch-friendly buttons
- Larger tap targets

### Tablet (640px - 1024px)
- Padded content
- Max width container
- Comfortable reading

### Desktop (> 1024px)
- Centered feed (672px)
- Smooth hover effects
- Optimal line length

## 🎭 User Experience Features

1. **Instant Feedback**
   - Optimistic updates on likes
   - Smooth animations

2. **Loading States**
   - Skeleton screens
   - Spinner animations
   - Clear progress indicators

3. **Error Recovery**
   - Automatic retry options
   - Clear error messages
   - Non-blocking errors

4. **Empty States**
   - Helpful messages
   - Clear call-to-actions
   - Engaging visuals

## 🧪 Testing Strategy

### Unit Tests (Future)
```javascript
- Test like/unlike logic
- Test time formatting
- Test pagination logic
- Test error handling
```

### Integration Tests (Future)
```javascript
- Test API integration
- Test user interactions
- Test state updates
- Test navigation
```

### Manual Tests (Now)
```javascript
✓ Visual appearance
✓ Like button functionality
✓ Load more functionality
✓ Error states
✓ Empty states
✓ Responsive design
```

## 🔮 Future Enhancements

### Short Term
- [ ] Add comments section
- [ ] Add share functionality
- [ ] Add post deletion
- [ ] Add edit post

### Medium Term
- [ ] Infinite scroll
- [ ] Image lightbox
- [ ] User profile popover
- [ ] Search functionality

### Long Term
- [ ] Real-time updates (WebSockets)
- [ ] Story feature
- [ ] Video support
- [ ] Direct messaging

## 📚 Related Documentation

- [SocialFeed README](./SOCIALFEED_README.md) - Component documentation
- [Testing Guide](./TESTING_GUIDE.md) - How to test
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Overview
- [Examples](./src/examples/SocialFeedExamples.jsx) - Code examples

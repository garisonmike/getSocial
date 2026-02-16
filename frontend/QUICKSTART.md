#  Quick Start Guide - SocialFeed Component

##  5-Minute Setup

### 1. Start Your Servers

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 2. Visit the Social Feed

Open your browser and navigate to:
```
http://localhost:3000/social
```

That's it! 

---

##  What You'll See

### Modern Social Feed
-  Clean, Instagram/Twitter-style cards
-  Profile avatars (or gradient placeholders)
-  Like buttons with instant feedback ()
-  Comment, Share, and Bookmark buttons
-  Smart timestamps ("2h ago", "just now")
-  Smooth animations and hover effects
-  "Load More" button for pagination

### Key Feature: Optimistic Like Updates
When you click the like button:
1. UI updates **instantly** (no waiting!)
2. Like count increases immediately
3. Button turns red 
4. API call happens in background
5. If it fails, changes revert automatically

---

##  Routes Available

| Route | Description |
|-------|-------------|
| `/social` | New modern social feed with optimistic updates |
| `/feed` | Original feed page (still works) |
| `/login` | Login page |
| `/register` | Registration page |
| `/profile/:username` | User profile page |

---

##  Quick Test

### Test the Like Button:
1. Click the  button on any post
2. Notice it turns **red immediately** (optimistic update!)
3. Like count increases by 1 instantly
4. Click again to unlike
5. Button turns gray and count decreases

### Test Load More:
1. Scroll to bottom of feed
2. Click "Load More" button
3. Watch new posts load smoothly

### Test Error Handling:
1. Stop the backend server
2. Try loading the feed
3. See error message with retry button
4. Restart backend and click retry

---

##  Files Created

### Components (Use These!)
```
src/components/SocialFeed.jsx       ← Main feed container
src/components/SocialPostCard.jsx   ← Individual post card
```

### Pages
```
src/pages/SocialFeedPage.jsx        ← Complete page layout
```

### Documentation
```
frontend/SOCIALFEED_README.md       ← Full documentation
frontend/TESTING_GUIDE.md           ← Testing checklist
frontend/IMPLEMENTATION_SUMMARY.md  ← Overview
frontend/ARCHITECTURE.md            ← Component architecture
```

### Examples
```
src/examples/SocialFeedExamples.jsx ← 5 usage examples
```

---

##  Usage Examples

### Example 1: Basic Usage
```jsx
import SocialFeed from '../components/SocialFeed'

function MyPage() {
    return (
        <div className="max-w-2xl mx-auto px-4">
            <SocialFeed />
        </div>
    )
}
```

### Example 2: With Custom Header
```jsx
import SocialFeed from '../components/SocialFeed'

function MyPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Discover</h1>
            <SocialFeed />
        </div>
    )
}
```

### Example 3: Single Post
```jsx
import SocialPostCard from '../components/SocialPostCard'

function SinglePost({ post }) {
    return <SocialPostCard post={post} />
}
```

---

##  Customization

### Change Primary Color (Blue → Purple)
In `SocialPostCard.jsx`, search and replace:
```jsx
text-blue-600  →  text-purple-600
bg-blue-50     →  bg-purple-50
border-blue-600 →  border-purple-600
```

### Adjust Card Spacing
In `SocialFeed.jsx`:
```jsx
className="space-y-4"  →  className="space-y-6"  // More space
```

### Change Avatar Gradient
In `SocialPostCard.jsx`:
```jsx
className="from-blue-400 to-purple-500"
// Change to:
className="from-pink-400 to-red-500"
```

---

##  Troubleshooting

### Issue: "Posts not loading"
**Check:**
- Is backend running? (`python manage.py runserver`)
- Is frontend running? (`npm run dev`)
- Check browser console for errors (F12)

**Fix:**
- Ensure CORS is configured in Django settings
- Verify `/api/posts/` endpoint works

### Issue: "Like button doesn't work"
**Check:**
- Are you logged in?
- Does `/api/posts/{id}/like/` endpoint exist?

**Fix:**
- Make sure user is authenticated
- Check Django views have like/unlike actions

### Issue: "Styling looks broken"
**Check:**
- Is Tailwind CSS installed?
- Is PostCSS configured?

**Fix:**
```bash
cd frontend
npm install
npm run dev
```

---

##  Need More Info?

### Documentation Files:
- **SOCIALFEED_README.md** - Detailed component docs
- **TESTING_GUIDE.md** - Complete testing checklist
- **ARCHITECTURE.md** - Component architecture
- **IMPLEMENTATION_SUMMARY.md** - Full overview

### Code Examples:
- **src/examples/SocialFeedExamples.jsx** - 5 different implementations

---

##  Success Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Navigated to `/social`
- [ ] See posts in modern card layout
- [ ] Like button works (instant feedback)
- [ ] Load More button works
- [ ] No errors in console

---

##  You're Ready!

Your SocialFeed component is fully functional and ready to use. It features:

 **Optimistic like updates** - Instant UI feedback  
 **Modern design** - Instagram/Twitter inspired  
 **Fully responsive** - Works on all devices  
 **Fast & smooth** - Optimized performance  
 **Error handling** - Graceful error recovery  

**Access it now:** http://localhost:3000/social

Enjoy your new social feed! 

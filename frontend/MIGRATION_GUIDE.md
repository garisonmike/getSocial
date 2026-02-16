# Migration Guide: JavaScript to TypeScript with SOLID Principles

## 🎯 Overview

This refactoring transforms the getSocial frontend from JavaScript to TypeScript, applying SOLID principles throughout the codebase for better maintainability, type safety, and scalability.

## 📦 Required Dependencies

Add the following to your `package.json`:

```json
{
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "typescript": "^5.3.3"
  }
}
```

Install dependencies:
```bash
cd frontend
npm install
```

## 🏗️ Architecture Changes

### 1. Type Definitions (`src/types/models.ts`)

**SOLID Principle**: Single Responsibility
- **Purpose**: Define TypeScript interfaces matching Django models exactly
- **Benefits**: Type safety, autocomplete, catch errors at compile time

### 2. Error Handling (`src/utils/errorHandling.ts`)

**SOLID Principles**: Single Responsibility, Open/Closed
- Custom error classes for different error types
- Centralized error parsing and user-friendly messages
- Logging for development

**Key Features**:
```typescript
- ApiRequestError: HTTP/API errors
- NetworkError: Connection failures
- AuthenticationError: 401/403 responses
- ValidationError: Form validation failures
```

### 3. HTTP Client (`src/services/httpClient.ts`)

**SOLID Principles**: Single Responsibility, Dependency Inversion

**Key Classes**:
```typescript
interface IHttpClient {
  get<T>, post<T>, put<T>, patch<T>, delete<T>
}

class HttpClient implements IHttpClient {
  // Concrete implementation with axios
}

abstract class BaseApiService {
  // Base class for API services
}
```

**Benefits**:
- Components depend on `IHttpClient` interface, not axios directly
- Easy to swap HTTP implementation if needed
- Centralized interceptors for auth and errors

### 4. API Services (`src/services/`)

**SOLID Principles**: Single Responsibility, Interface Segregation

**Structure**:
```
services/
├── httpClient.ts          (Base HTTP functionality)
├── postsApi.ts            (Posts operations)
├── commentsApi.ts         (Comments operations)
├── profilesApi.ts         (Profiles operations)
├── followsApi.ts          (Follows operations)
└── api.ts                 (Central export)
```

**Each service**:
- Has a clear interface (`IPostsApiService`, etc.)
- Handles one domain (posts, comments, etc.)
- Extends `BaseApiService` for common functionality

### 5. Custom Hooks (`src/hooks/`)

**SOLID Principles**: Single Responsibility, Liskov Substitution

**Structure**:
```
hooks/
├── usePosts.ts
│   ├── usePosts()        - Fetch paginated posts
│   ├── useFeed()         - Fetch personalized feed
│   ├── usePost()         - Fetch single post
│   ├── usePostLike()     - Handle like/unlike
│   ├── usePostCreate()   - Create posts
│   └── usePostDelete()   - Delete posts
├── useProfile.ts
│   ├── useMyProfile()    - Current user profile
│   ├── useProfile()      - Fetch profile by ID
│   └── useProfileUpdate() - Update profile
└── useFollow.ts
    ├── useFollow()       - Follow/unfollow with optimistic updates
    └── useFollowActions() - Batch follow operations
```

**Benefits**:
- Each hook has ONE responsibility
- Reusable across components
- Easier to test
- Optimistic updates built-in

### 6. Refactored Components

**SOLID Principles**: All five principles applied

**Component Hierarchy**:
```
SocialFeed.tsx (Container)
├── LoadingSpinner.tsx
├── ErrorMessage.tsx
├── EmptyState.tsx
└── SocialPostCard.tsx (Presentational)
    ├── PostAvatar.tsx
    └── PostActions.tsx
```

**Key Improvements**:
```typescript
// Before (JavaScript)
function SocialFeed() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  // ... 100+ lines of logic
}

// After (TypeScript with Hooks)
const SocialFeed: React.FC<SocialFeedProps> = ({ className }) => {
  const { posts, isLoading, error, hasMore, loadMore } = usePosts()
  // Component only renders, logic in hook
}
```

## 🔄 Migration Steps

### Step 1: Install TypeScript Dependencies

```bash
npm install --save-dev typescript @types/react @types/react-dom @types/node
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Step 2: Use New TypeScript Files

The new TypeScript files are in:
- `src/components/*.tsx`
- `src/hooks/*.ts`
- `src/services/*.ts`
- `src/types/*.ts`
- `src/utils/*.ts`

You can:
**Option A**: Gradually migrate (keep both .js and .tsx files)
**Option B**: Replace all at once (delete .jsx files)

### Step 3: Update Imports

**Old imports**:
```javascript
import { postsAPI } from '../services/api.js'
```

**New imports**:
```typescript
import { postsApi } from '../services/api'
import type { Post, PaginatedResponse } from '../types/models'
```

### Step 4: Use Custom Hooks

**Before**:
```javascript
const [posts, setPosts] = useState([])
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  fetchPosts()
}, [])

const fetchPosts = async () => {
  try {
    setIsLoading(true)
    const response = await postsAPI.getAll(page)
    setPosts(response.data.results)
  } catch (err) {
    console.error(err)
  } finally {
    setIsLoading(false)
  }
}
```

**After**:
```typescript
const { posts, isLoading, error, loadMore, refresh } = usePosts()
```

## 📋 SOLID Principles Applied

### Single Responsibility Principle (SRP)

**Before**: Components mixed UI, state, and API logic
**After**: Separated concerns
```
- Services: API calls only
- Hooks: State management only
- Components: Rendering only
- Utils: Utility functions only
```

### Open/Closed Principle (OCP)

**Before**: Hard to extend without modifying
**After**: Extensible through:
```typescript
// Extend base classes
class PostsApiService extends BaseApiService { }

// Use props for customization
<SocialFeed onPostClick={(id) => navigate(`/post/${id}`)} />

// Composition over modification
<ErrorBoundary fallback={<CustomError />}>
  <SocialFeed />
</ErrorBoundary>
```

### Liskov Substitution Principle (LSP)

**Applications**:
```typescript
// Any IHttpClient can replace HttpClient
const testClient: IHttpClient = new MockHttpClient()
const postsService = new PostsApiService(testClient)

// Any component can use any hook with same interface
const { posts } = usePosts()  // Works
const { posts } = useFeed()   // Also works - same interface
```

### Interface Segregation Principle (ISP)

**Before**: One large API class with all methods
**After**: Separated interfaces
```typescript
interface IPostsApiService {
  // Only post-related methods
}

interface ICommentsApiService {
  // Only comment-related methods
}

interface IProfilesApiService {
  // Only profile-related methods
}
```

### Dependency Inversion Principle (DIP)

**Before**: Components imported axios directly
**After**: Depend on abstractions
```typescript
// High-level (components) depend on abstraction (IHttpClient)
class PostsApiService {
  constructor(protected httpClient: IHttpClient) {}
}

// Can inject any implementation
const postsApi = new PostsApiService(httpClient)
const postsApiTest = new PostsApiService(mockHttpClient)
```

## 🎨 Usage Examples

### Example 1: Using the Social Feed

```typescript
import SocialFeed from '@/components/SocialFeed'
import ErrorBoundary from '@/components/ErrorBoundary'

function HomePage() {
  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Your Feed</h1>
        <SocialFeed />
      </div>
    </ErrorBoundary>
  )
}
```

### Example 2: Creating a Post

```typescript
import { usePostCreate } from '@/hooks/usePosts'
import type { PostCreateData } from '@/types/models'

function CreatePostForm() {
  const { createPost, isLoading, error } = usePostCreate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const data: PostCreateData = {
      content: 'Hello world!',
      image: null,
    }
    
    const newPost = await createPost(data)
    if (newPost) {
      console.log('Post created!', newPost)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <p className="text-red-600">{error}</p>}
      <button disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

### Example 3: Custom Error Handling

```typescript
import { handleError, logError } from '@/utils/errorHandling'
import { postsApi } from '@/services/api'

async function customFetch() {
  try {
    const post = await postsApi.getById(123)
    return post
  } catch (error) {
    // Get user-friendly message
    const message = handleError(error, 'customFetch')
    alert(message)
    
    // Or log it
    logError(error, 'customFetch')
  }
}
```

## ✅ Benefits of This Refactoring

### Type Safety
```typescript
// Before: Anything goes
const post = response.data  // What properties does it have?

// After: Fully typed
const post: Post = await postsApi.getById(1)
post.  // IDE autocompletes: id, content, author_username, etc.
```

### Error Handling
```typescript
// Before: Generic errors
catch (error) {
  console.error(error)  // Not helpful
}

// After: Specific, user-friendly errors
catch (error) {
  if (error instanceof AuthenticationError) {
    // Redirect to login
  } else if (error instanceof ValidationError) {
    // Show form errors
  }
}
```

### Testability
```typescript
// Easy to mock services
const mockPostsApi: IPostsApiService = {
  getAll: jest.fn().mockResolvedValue({ results: mockPosts })
}

// Easy to test hooks
const { result } = renderHook(() => usePosts())
```

### Maintainability
- Clear separation of concerns
- Each file has ONE job
- Easy to find where changes should go
- Types catch errors at build time

## 🚀 Next Steps

1. **Install dependencies**: `npm install`
2. **Start using TypeScript files**: Import from `.tsx` and `.ts` files
3. **Gradually migrate**: Replace old `.jsx` files one by one
4. **Add tests**: Now much easier with separated concerns
5. **Expand**: Add new features following the same patterns

## 📚 File Reference

| Old File | New File | Purpose |
|----------|----------|---------|
| `api.js` | `services/api.ts` + individual service files | API layer |
| `SocialFeed.jsx` | `components/SocialFeed.tsx` | Feed component |
| `SocialPostCard.jsx` | `components/SocialPostCard.tsx` | Post card |
| N/A | `hooks/usePosts.ts` | Posts state management |
| N/A | `utils/errorHandling.ts` | Error handling |
| N/A | `types/models.ts` | TypeScript types |

## 🎓 Learn More

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

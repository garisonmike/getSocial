# getSocial - Modern Social Media Platform

> A full-stack social media application built with Django REST Framework, GraphQL, and React with TypeScript

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11-blue)](https://www.python.org/)
[![Django](https://img.shields.io/badge/django-5.2-green)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0-blue)](https://www.typescriptlang.org/)

## Overview

getSocial is a modern, scalable social media platform featuring real-time interactions, user profiles, posts, comments, and social connections. Built with a focus on clean architecture, type safety, and developer experience.

### Key Features

- **User Authentication** - JWT-based authentication with token refresh and blacklisting
- **Social Interactions** - Posts, comments, likes, shares, and follow system
- **Real-time Updates** - WebSocket support via Django Channels
- **GraphQL API** - Flexible data fetching with Graphene-Django
- **REST API** - Comprehensive REST endpoints with Django REST Framework
- **Type-Safe Frontend** - Full TypeScript implementation with strict type checking
- **Optimistic Updates** - Instant UI feedback for user actions
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Background Tasks** - Asynchronous task processing with Celery
- **Docker Support** - Fully containerized development and deployment

## Technology Stack

### Backend

| Component | Technology |
|-----------|-----------|
| Framework | Django 5.2, Django REST Framework 3.14+ |
| API | GraphQL (Graphene-Django), REST API |
| Database | PostgreSQL 15+ / SQLite (development) |
| Authentication | JWT (djangorestframework-simplejwt) |
| Real-time | Django Channels, Redis |
| Task Queue | Celery, RabbitMQ |
| Deployment | Docker, Docker Compose |

### Frontend

| Component | Technology |
|-----------|-----------|
| Framework | React 18 |
| Language | TypeScript 5.0+ |
| Styling | Tailwind CSS 3.x |
| HTTP Client | Axios |
| Build Tool | Vite |
| State Management | React Hooks (custom hooks) |

## Architecture

### Backend Architecture

The backend follows a modular Django app structure with clear separation of concerns:

- **apps/users/** - User authentication and profiles
- **apps/posts/** - Post management
- **apps/interactions/** - Likes and shares
- **apps/analytics/** - Analytics and metrics
- **apps/core/** - Core models and API viewsets
- **config/** - Django settings and configuration

### Frontend Architecture

The frontend implements SOLID principles with a clean separation between services, state management, and UI components:

- **components/** - Reusable UI components
- **hooks/** - Custom React hooks for state management
- **services/** - API service layer (HTTP client abstraction)
- **types/** - TypeScript type definitions
- **utils/** - Utility functions
- **pages/** - Page components

**Key Architectural Patterns:**
- **Dependency Inversion** - Components depend on abstractions (interfaces), not concrete implementations
- **Single Responsibility** - Each module has one clear purpose
- **Interface Segregation** - Separate API services for different domains
- **Custom Hooks** - Logic separated from presentation layer
- **Error Boundaries** - Graceful error handling at component boundaries

## Database Schema

### Core Models

**User**
- Extended Django AbstractUser with bio and avatar
- Custom user model for authentication

**Post**
- Content and optional image
- Visibility controls (public/followers-only)
- Author relationship

**Comment**
- Threaded comments with parent-child relationships
- Support for nested replies

**Interaction**
- Unified likes and shares
- Polymorphic relationship with content

**Follow**
- User-to-user relationships
- Follower/following counts

See [ERD.md](ERD.md) for detailed database schema diagrams.

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ (or use SQLite for development)
- Docker & Docker Compose (optional but recommended)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/getSocial.git
   cd getSocial/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```

Backend will be available at:
- REST API: http://localhost:8000/api/
- GraphQL: http://localhost:8000/graphql/
- Admin: http://localhost:8000/admin/

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

Frontend will be available at: http://localhost:3000

### Docker Setup (Recommended)

Run the entire stack with Docker:

```bash
docker-compose up --build
```

This will start:
- Django backend (port 8000)
- React frontend (port 3000)
- PostgreSQL database
- Redis
- Celery worker
- RabbitMQ

## API Documentation

### REST API Endpoints

**Authentication**
- `POST /api/token/` - Obtain JWT token
- `POST /api/token/refresh/` - Refresh access token
- `POST /api/token/blacklist/` - Logout (blacklist token)

**Posts**
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create post (authenticated)
- `GET /api/posts/{id}/` - Retrieve post
- `PUT/PATCH /api/posts/{id}/` - Update post (owner only)
- `DELETE /api/posts/{id}/` - Delete post (owner only)
- `POST /api/posts/{id}/like/` - Like post
- `POST /api/posts/{id}/unlike/` - Unlike post
- `GET /api/posts/feed/` - Personalized feed

**Comments**
- `GET /api/comments/` - List comments
- `POST /api/comments/` - Create comment (authenticated)
- `GET /api/comments/{id}/` - Retrieve comment
- `PUT/PATCH /api/comments/{id}/` - Update comment (owner only)
- `DELETE /api/comments/{id}/` - Delete comment (owner only)

**User Profiles**
- `GET /api/profiles/` - List profiles
- `GET /api/profiles/me/` - Current user profile
- `GET /api/profiles/{id}/` - Retrieve profile
- `PUT/PATCH /api/profiles/{id}/` - Update profile (owner only)

**Follows**
- `POST /api/follows/` - Follow user (authenticated)
- `POST /api/follows/unfollow/` - Unfollow user
- `GET /api/follows/` - List follows

See [API_DOCUMENTATION.md](backend/apps/core/API_DOCUMENTATION.md) for complete API reference.

### GraphQL API

Access GraphiQL interface at http://localhost:8000/graphql/ for interactive queries.

**Example Query:**
```graphql
query {
  allPosts {
    edges {
      node {
        id
        content
        author {
          username
        }
        likesCount
        commentsCount
      }
    }
  }
}
```

**Example Mutation:**
```graphql
mutation {
  createPost(content: "Hello World!") {
    post {
      id
      content
      createdAt
    }
  }
}
```

## Security

### Authentication

- JWT-based authentication with access and refresh tokens
- Access tokens expire after 60 minutes
- Refresh tokens expire after 7 days
- Token rotation and blacklisting supported
- Secure password hashing with Django defaults

### Authorization

- Endpoint-level permissions (IsAuthenticated, IsAuthenticatedOrReadOnly)
- Object-level permissions (users can only modify their own content)
- Private profile support with visibility controls
- CORS configured for frontend security

### Environment Variables

All sensitive configuration managed via environment variables. See `.env.example` for complete list.

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Deployment

### Environment Configuration

1. Set `DEBUG=False` in production
2. Configure `ALLOWED_HOSTS` with your domain
3. Set strong `SECRET_KEY` (50+ characters)
4. Use PostgreSQL database with SSL
5. Configure static file serving (WhiteNoise included)
6. Set up Redis for Channels and caching
7. Configure Celery broker (RabbitMQ or Redis)

### Docker Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

See [SECURITY_CONFIGURATION.md](backend/SECURITY_CONFIGURATION.md) for security best practices.

## Documentation

- [API Documentation](backend/apps/core/API_DOCUMENTATION.md) - Complete REST API reference
- [Quick Start Guide](backend/apps/core/QUICK_START.md) - Get started quickly
- [Security Configuration](backend/SECURITY_CONFIGURATION.md) - Security best practices
- [TypeScript Migration](frontend/MIGRATION_GUIDE.md) - TypeScript refactoring guide
- [Database Schema](ERD.md) - Entity relationship diagrams

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub.

---

**Built with Django, React, and TypeScript**
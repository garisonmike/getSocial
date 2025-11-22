# Social Media Feed Backend - Tasks

This file tracks the progress of tasks for the Social Media Feed Backend project. Tasks are divided into two sections: **Done** and **Not Yet Done**.I'll move tasks to **Done** as i complete them.

---

## ✅ Done
*No tasks completed yet.*

---

## ⏳ Not Yet Done

### Phase 1: Project Initialization
- [ ] Install Python 3.11 and set up a virtual environment
- [ ] Install Django 5.2 and create a new Django project
- [ ] Configure PostgreSQL 15.x and connect it to Django
- [ ] Initialize Git repository and make the first commit
- [ ] Create project folder structure
- [ ] Set up Docker + Docker Compose for local development

### Phase 2: Core Models and Database Design
- [ ] Design User model (custom user if needed)
- [ ] Design Post model
- [ ] Design Comment model (nested/self-referencing for replies)
- [ ] Design Interaction model (likes and shares)
- [ ] Design Analytics model (aggregate counts for posts/interactions)
- [ ] Run migrations and verify database schema
- [ ] Seed the database with test users and posts

### Phase 3: Authentication and Permissions
- [ ] Install and configure `django-graphql-jwt`
- [ ] Implement JWT authentication
- [ ] Create user registration and login mutations
- [ ] Implement role-based permissions for different user types
- [ ] Test authentication using GraphQL Playground

### Phase 4: GraphQL API Implementation
- [ ] Install Graphene-Django and configure GraphQL endpoint
- [ ] Implement Queries: fetch posts, comments (nested), interactions per post
- [ ] Implement Mutations: create/update/delete posts, comments/replies, like/unlike/share posts
- [ ] Implement Subscriptions: new post, new comment, new interaction
- [ ] Test all queries, mutations, and subscriptions in GraphQL Playground

### Phase 5: Background Tasks
- [ ] Install Celery and configure RabbitMQ
- [ ] Create tasks for notifications, analytics updates, scheduled cleanup/caching
- [ ] Test background tasks locally
- [ ] Ensure tasks scale properly with high interaction volume

### Phase 6: Analytics & Metrics
- [ ] Implement aggregation for likes, shares, comments
- [ ] Add queries/mutations for analytics reporting
- [ ] Optimize queries for performance
- [ ] Optional: create top posts / most active users endpoint

### Phase 7: Testing
- [ ] Write unit tests for models
- [ ] Write unit and integration tests for GraphQL queries and mutations
- [ ] Test authentication and permission rules
- [ ] Test background tasks
- [ ] Test real-time subscriptions

### Phase 8: CI/CD and Automation
- [ ] Configure GitHub Actions for automated testing on push/PR
- [ ] Add linting and code formatting checks (flake8 / black)
- [ ] Set up Docker build automation
- [ ] Automate deployment steps
- [ ] Verify containerized deployment works with all services

### Phase 9: Documentation
- [ ] Update README.md with project overview, API usage, and setup instructions
- [ ] Document GraphQL schema and available queries/mutations/subscriptions
- [ ] Add notes on background tasks and analytics

### Phase 10: Deployment
- [ ] Prepare production-ready Docker images
- [ ] Deploy backend with PostgreSQL and RabbitMQ in containers
- [ ] Configure environment variables for secrets (JWT keys, DB credentials)
- [ ] Test all endpoints in production environment
- [ ] Validate real-time subscriptions and background tasks

### Phase 11: Final Review and Submission
- [ ] Conduct final testing and debugging
- [ ] Ensure code quality and proper version control
- [ ] Prepare demo video of API functionality
- [ ] Prepare presentation slides for mentors
- [ ] Submit GitHub repository for Project Nexus review

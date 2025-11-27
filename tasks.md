# Social Media Feed Backend - To-Do List

This document lists all tasks required to complete the Social Media Feed Backend project, from project initialization to deployment, testing, and automation. Tasks are organized in sequential order for efficient development.

---

## Phase 1: Project Initialization

- [x] Install Python 3.11 and set up a virtual environment
- [x] Install Django 5.2 and create a new Django project
- [x] Configure PostgreSQL 15.x and connect it to Django
- [x] Initialize Git repository and make the first commit
- [x] Create project folder structure:
  - backend/
  - apps/users/
  - apps/posts/
  - apps/interactions/
  - apps/analytics/
  - requirements.txt
  - Dockerfile
  - docker-compose.yml
  - README.md
- [x] Set up Docker + Docker Compose for local development

---

## Phase 2: Core Models and Database Design

- [x] Design User model (custom user if needed)
- [x] Design Post model
- [x] Design Comment model (nested/self-referencing for replies)
- [x] Design Interaction model (likes and shares)
- [x] Design Analytics model (aggregate counts for posts/interactions)
- [x] Run migrations and verify database schema
- [ ] Seed the database with test users and posts

---

## Phase 3: Authentication and Permissions

- [x] Install and configure `django-graphql-jwt`
- [x] Implement JWT authentication
- [x] Create user registration and login mutations
- [ ] Implement role-based permissions for different user types
- [ ] Test authentication using GraphQL Playground

---

## Phase 4: GraphQL API Implementation

- [x] Install Graphene-Django and configure GraphQL endpoint
- [x] Implement Queries:
  - Fetch posts (single & list)
  - Fetch comments (nested)
  - Fetch interactions per post
- [x] Implement Mutations:
  - Create, update, delete posts
  - Create comments and replies
  - Like, unlike, and share posts
- [x] Implement Subscriptions for real-time updates:
  - [x] New post
  - [ ] New comment
  - [ ] New interaction
- [ ] Test all queries, mutations, and subscriptions in GraphQL Playground

---

## Phase 5: Background Tasks

- [x] Install Celery and configure RabbitMQ
- [x] Create tasks for:
  - [x] Sending notifications for interactions
  - [ ] Updating analytics counters
  - [ ] Scheduled cleanup or caching tasks
- [ ] Test background tasks locally
- [ ] Ensure tasks scale properly with high interaction volume

---

## Phase 6: Analytics & Metrics

- [x] Implement aggregation for likes, shares, comments
- [x] Add queries/mutations for analytics reporting
- [x] Optimize queries for performance
- [ ] Optional: create top posts / most active users endpoint

---

## Phase 7: Testing

- [ ] Write unit tests for models
- [ ] Write unit and integration tests for GraphQL queries and mutations
- [ ] Test authentication and permission rules
- [ ] Test background tasks
- [ ] Test real-time subscriptions

---

## Phase 8: CI/CD and Automation

- [ ] Configure GitHub Actions for automated testing on push/PR
- [ ] Add linting and code formatting checks (flake8 / black)
- [ ] Set up Docker build automation
- [ ] Automate deployment steps (push to staging/production)
- [ ] Verify containerized deployment works with all services (Django, PostgreSQL, RabbitMQ, Celery)

---

## Phase 9: Documentation

- [ ] Update README.md with project overview, API usage, and setup instructions
- [ ] Create Planning.md and To-Do List for project reference
- [ ] Document GraphQL schema and available queries/mutations/subscriptions
- [ ] Add notes on background tasks and analytics

---

## Phase 10: Deployment

- [ ] Prepare production-ready Docker images
- [ ] Deploy backend with PostgreSQL and RabbitMQ in containers
- [ ] Configure environment variables for secrets (JWT keys, DB credentials)
- [ ] Test all endpoints in production environment
- [ ] Validate real-time subscriptions and background tasks

---

## Phase 11: Final Review and Submission

- [ ] Conduct final testing and debugging
- [ ] Ensure code quality and proper version control
- [ ] Prepare demo video of API functionality
- [ ] Prepare presentation slides for mentors
- [ ] Submit GitHub repository for Project Nexus review

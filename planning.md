# Project Nexus: Social Media Feed Backend - Planning

## Project Overview
The Social Media Feed Backend is a capstone project for the ProDev Backend Engineering program. Its goal is to build a **scalable, real-time backend** that manages posts, interactions, and analytics similar to a social media platform. Key features include:

- CRUD operations for posts
- Nested comments and replies
- Likes and shares tracking
- Real-time updates via GraphQL subscriptions
- Analytics for interactions
- Background tasks for notifications and processing

This project will demonstrate mastery of backend development concepts, scalable database design, GraphQL APIs, asynchronous processing, and real-time communication.

---

## Tools & Versions

| Tool / Technology        | Version / Notes                           |
|--------------------------|-------------------------------------------|
| Python                   | 3.11 (latest stable)                      |
| Django                   | 5.2 (LTS)                                 |
| PostgreSQL               | 15.x (latest stable)                       |
| GraphQL                  | Graphene-Django latest stable             |
| Authentication           | django-graphql-jwt for JWT, sessions optional |
| Background Tasks         | Celery 6.x with RabbitMQ 3.12.x           |
| Real-Time Updates        | Django Channels 4.x                        |
| Frontend / Playground    | GraphQL Playground (hosted locally)       |
| Containerization         | Docker 24.x + Docker Compose              |

---

## Dependencies

- Django
- Graphene-Django
- Django Channels
- Django-GraphQL-JWT
- Celery
- RabbitMQ
- Psycopg2 (PostgreSQL driver)
- Redis (optional for Celery result backend or caching)
- Any additional Python utilities as needed

---

## Database Schema Notes

### Users
- Stores user credentials, profile info
- Supports authentication with JWT

### Posts
- Stores text, images, timestamps, and author information
- Supports CRUD operations

### Comments
- Nested comments via self-referencing foreign key
- Tracks the user who commented

### Interactions
- Likes and shares
- Each record tracks the user performing the action
- Efficient queries for analytics

### Analytics (Optional)
- Aggregates counts of likes, shares, comments
- Stores activity metrics for posts and users

---

## GraphQL API Schema

### Queries
- Fetch posts (single or list)
- Fetch comments (nested)
- Fetch interactions per post

### Mutations
- Create / update / delete posts
- Create comments and replies
- Like / unlike / share posts

### Subscriptions
- New post notifications
- New comment notifications
- New interaction notifications

---

## Authentication & Permissions
- JWT-based authentication for all API endpoints
- Role-based access control (users, admins)
- Permissions enforced at GraphQL resolver level
- Optional session support for admin access

---

## Background Tasks
- Notify users of likes, comments, and shares
- Update analytics counters asynchronously
- Scheduled tasks for cleanup and caching
- Tasks handled via Celery + RabbitMQ

---

## Real-Time Updates
- GraphQL subscriptions implemented via Django Channels
- WebSocket connections for live updates of posts, comments, and interactions
- Push notifications to subscribed clients

---

## Analytics & Metrics
- Total likes, shares, comments per post
- Aggregate user activity metrics
- Optional: top posts by engagement

---

## CI/CD & Deployment
- Docker + Docker Compose for consistent dev and production environments
- GitHub Actions for automated testing and deployment
- Deployment notes ready for cloud hosting (Heroku, AWS, or DigitalOcean)

---

## Proposed Folder Structure

social_feed_backend/
├─ backend/ # Django project
│ ├─ settings.py
│ ├─ urls.py
│ ├─ asgi.py # For Channels
│ └─ wsgi.py
├─ apps/
│ ├─ users/
│ ├─ posts/
│ ├─ interactions/
│ └─ analytics/
├─ requirements.txt
├─ docker-compose.yml
├─ Dockerfile
└─ README.md


---

## Summary
This planning document outlines the **tools, versions, architecture, and features** for the Social Media Feed Backend project. It serves as a blueprint to guide implementation, ensure scalability, maintainability, and real-time performance. Following this plan will me help produce a fully functional backend ready for Project Nexus.

---
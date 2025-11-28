# 🚀 Project Nexus: Social Media Feed Backend

> A scalable, real-time social media backend built with **Django**, **GraphQL**, and **Docker**.
> Developed as the Capstone Project for the **ProDev Backend Engineering Program**.

[![Render](https://img.shields.io/badge/Render-Live-success)](https://dashboard.render.com/)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/garisonmike/getSocial/ci.yml)](https://github.com/garisonmike/getSocial/actions)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## 📖 Overview
**Project Nexus** is a high-performance backend system designed to handle complex social interactions. It features a **GraphQL API** for flexible data fetching, **Real-time Subscriptions** for instant updates, and **Background Processing** for handling notifications asynchronously.

This project demonstrates mastery of:
* **Database Design:** Optimized PostgreSQL schema for scalability.
* **API Development:** Advanced GraphQL usage with Graphene.
* **DevOps:** Containerization (Docker) and CI/CD automation (GitHub Actions).

---

## 🛠️ Tech Stack & Key Technologies

| Category | Technologies |
| :--- | :--- |
| **Framework** | Python 3.11, Django 5.2 |
| **API** | GraphQL (Graphene-Django), JWT Authentication |
| **Database** | PostgreSQL 15, Redis (Caching & Channels) |
| **Async Tasks** | Celery, RabbitMQ |
| **Real-Time** | Django Channels (WebSockets) |
| **DevOps** | Docker, Docker Compose, GitHub Actions, Render |

---

## 📐 Architecture & Database Design
The database is normalized to ensure data integrity while supporting high-volume reads for the feed.

* **ERD Diagram:** [View Database Schema](ERD.md)
* **Key Models:** `User`, `Post`, `Comment` (Recursive/Nested), `Interaction`, `Analytics`.

---

## 🌟 Key Features

### 1. 📡 Flexible GraphQL API
Instead of rigid REST endpoints, we use GraphQL to allow clients to fetch exactly what they need.
* **Queries:** Fetch posts, nested comments, and analytics in a single request.
* **Mutations:** Securely create posts, like content, and reply to comments.

### 2. ⚡ Real-Time Updates
Using **Django Channels** and **Redis**, the feed updates instantly.
* Users see new comments appear without refreshing the page.

### 3. 📉 Automated Analytics (Signals)
We use **Django Signals** to decouple logic.
* *Action:* User likes a post.
* *Signal:* Automatically updates the `Analytics` table (increment `likes_count`).
* *Benefit:* Fast read performance for trending algorithms.

### 4. 🐇 Asynchronous Processing
Heavy tasks are offloaded to **Celery** workers via **RabbitMQ**.
* Notifications and cleanup tasks run in the background, ensuring the API remains fast.

---

## 🚀 How to Run Locally

### Prerequisites
* Docker & Docker Compose
* Git

### Steps
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/garisonmike/getSocial.git
    cd getSocial
    ```

2.  **Build & Start Containers**
    ```bash
    docker-compose up --build
    ```

3.  **Access the App**
    * **GraphQL Playground:** [http://localhost:8000/graphql](http://localhost:8000/graphql)
    * **Admin Panel:** [http://localhost:8000/admin](http://localhost:8000/admin)

4.  **Run Tests**
    ```bash
    docker-compose exec web pytest
    ```

---

## 🧪 Challenges & Solutions

### Challenge 1: Handling Nested Comments
**Problem:** Implementing "reply to a reply" in a flat database table.
**Solution:** Used a **Self-Referencing ForeignKey** (`parent_id`) on the Comment model. This allows infinite nesting depth while keeping the schema simple.

### Challenge 2: Real-Time Performance
**Problem:** Polling the database for new likes is inefficient.
**Solution:** Implemented **Django Channels** with a Redis layer. When a mutation occurs, we push a message to the group channel, pushing the update to subscribed clients instantly.

### Challenge 3: Deployment "Works on my machine"
**Problem:** Code worked locally but failed in production due to environment differences.
**Solution:** Fully **Dockerized** the application. The `docker-compose.yml` ensures that the Production environment (Render) is identical to the Local Dev environment.

---

## 👤 Author
**Mike Garison**
* **Role:** Backend Engineer
* **Program:** ProDev Backend Engineering
* **GitHub:** [@garisonmike](https://github.com/garisonmike)

---

> *Built with ❤️ for Project Nexus.*
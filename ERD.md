# Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    User ||--o{ Post : "creates"
    User ||--o{ Comment : "writes"
    User ||--o{ Interaction : "performs"
    Post ||--o{ Comment : "has"
    Post ||--o{ Interaction : "receives"
    Post ||--|| Analytics : "has metrics"
    Comment ||--o{ Comment : "replies to"

    User {
        int id PK
        string username
        string email
        string password
        string bio
        string avatar
    }

    Post {
        int id PK
        int author_id FK
        text content
        string image
        boolean is_published
        datetime created_at
        datetime updated_at
    }

    Comment {
        int id PK
        int post_id FK
        int author_id FK
        text content
        int parent_id FK "Self-referencing for replies"
        datetime created_at
    }

    Interaction {
        int id PK
        int user_id FK
        int post_id FK
        string interaction_type "like, share"
        datetime created_at
    }

    Analytics {
        int id PK
        int post_id FK
        int views
        int likes_count
        int shares_count
    }
```

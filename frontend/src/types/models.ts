/**
 * Type definitions matching Django models exactly
 * 
 * These types correspond to the serialized API responses from Django REST Framework
 */

// Base User type (from Django AbstractUser)
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

// Extended User model with custom fields
export interface UserProfile {
    id: number;
    user: User;
    username: string;
    bio: string | null;
    avatar: string | null;
    cover_photo?: string | null;
    location?: string | null;
    website?: string | null;
    date_of_birth?: string | null;
    is_verified: boolean;
    is_private: boolean;
    followers_count: number;
    following_count: number;
    posts_count: number;
    created_at: string;
    updated_at: string;
}

// Post author profile (nested in Post)
export interface PostAuthorProfile {
    avatar: string | null;
    is_verified: boolean;
}

// Post model
export interface Post {
    id: number;
    author: User;
    author_username: string;
    author_profile: PostAuthorProfile | null;
    content: string;
    image: string | null;
    video?: string | null;
    visibility?: 'public' | 'private' | 'followers';
    is_published: boolean;
    is_pinned?: boolean;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    views_count?: number;
    is_liked: boolean;
    created_at: string;
    updated_at: string;
}

// Comment model
export interface Comment {
    id: number;
    post: number;
    author: User;
    content: string;
    parent: number | null;
    replies?: Comment[];
    likes_count?: number;
    is_liked?: boolean;
    created_at: string;
}

// Interaction model
export interface Interaction {
    id: number;
    user: number;
    post: number;
    interaction_type: 'like' | 'share';
    created_at: string;
}

// Follow model
export interface Follow {
    id: number;
    follower: User;
    following: User;
    follower_username: string;
    following_username: string;
    created_at: string;
}

// API Response types (for paginated responses)
export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// API Error types
export interface APIError {
    message: string;
    status?: number;
    code?: string;
    details?: Record<string, string[]>;
}

// Form data types for creating/updating
export interface PostCreateData {
    content: string;
    image?: File | null;
    video?: File | null;
    visibility?: 'public' | 'private' | 'followers';
}

export interface PostUpdateData {
    content?: string;
    image?: File | null;
    video?: File | null;
    visibility?: 'public' | 'private' | 'followers';
    is_published?: boolean;
}

export interface CommentCreateData {
    post: number;
    content: string;
    parent?: number | null;
}

export interface UserProfileUpdateData {
    bio?: string;
    avatar?: File | null;
    cover_photo?: File | null;
    location?: string;
    website?: string;
    date_of_birth?: string;
    is_private?: boolean;
}

// Auth types
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile?: UserProfile;
}

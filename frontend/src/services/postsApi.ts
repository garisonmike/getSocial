/**
 * Posts API Service
 * 
 * Single Responsibility: Handle all post-related API operations
 * Open/Closed: Can be extended without modification
 * Interface Segregation: Provides only post-related methods
 */

import {
    Comment,
    PaginatedResponse,
    Post,
    PostCreateData,
    PostUpdateData
} from '../types/models';
import { BaseApiService, IHttpClient } from './httpClient';

/**
 * Interface for Posts API operations (Interface Segregation)
 */
export interface IPostsApiService {
    getAll(page?: number, limit?: number): Promise<PaginatedResponse<Post>>;
    getFeed(page?: number): Promise<PaginatedResponse<Post>>;
    getById(id: number): Promise<Post>;
    create(data: PostCreateData): Promise<Post>;
    update(id: number, data: PostUpdateData): Promise<Post>;
    delete(id: number): Promise<void>;
    like(id: number): Promise<void>;
    unlike(id: number): Promise<void>;
    getComments(id: number): Promise<Comment[]>;
}

/**
 * Posts API Service implementation
 */
export class PostsApiService extends BaseApiService implements IPostsApiService {
    constructor(httpClient: IHttpClient) {
        super(httpClient, '/posts');
    }

    /**
     * Get all posts with pagination
     */
    async getAll(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
        const url = this.buildUrl(`/?page=${page}&limit=${limit}`);
        return this.httpClient.get<PaginatedResponse<Post>>(url);
    }

    /**
     * Get personalized feed
     */
    async getFeed(page: number = 1): Promise<PaginatedResponse<Post>> {
        const url = this.buildUrl(`/feed/?page=${page}`);
        return this.httpClient.get<PaginatedResponse<Post>>(url);
    }

    /**
     * Get post by ID
     */
    async getById(id: number): Promise<Post> {
        const url = this.buildUrl(`/${id}/`);
        return this.httpClient.get<Post>(url);
    }

    /**
     * Create new post
     */
    async create(data: PostCreateData): Promise<Post> {
        const url = this.buildUrl('/');

        // Check if we have files to upload
        const hasFiles = data.image || data.video;

        if (hasFiles) {
            const formData = this.createFormData(data);
            return this.httpClient.post<Post>(url, formData, this.getFileUploadConfig());
        }

        return this.httpClient.post<Post>(url, data);
    }

    /**
     * Update post
     */
    async update(id: number, data: PostUpdateData): Promise<Post> {
        const url = this.buildUrl(`/${id}/`);

        // Check if we have files to upload
        const hasFiles = data.image || data.video;

        if (hasFiles) {
            const formData = this.createFormData(data);
            return this.httpClient.patch<Post>(url, formData, this.getFileUploadConfig());
        }

        return this.httpClient.patch<Post>(url, data);
    }

    /**
     * Delete post
     */
    async delete(id: number): Promise<void> {
        const url = this.buildUrl(`/${id}/`);
        return this.httpClient.delete<void>(url);
    }

    /**
     * Like post
     */
    async like(id: number): Promise<void> {
        const url = this.buildUrl(`/${id}/like/`);
        return this.httpClient.post<void>(url);
    }

    /**
     * Unlike post
     */
    async unlike(id: number): Promise<void> {
        const url = this.buildUrl(`/${id}/unlike/`);
        return this.httpClient.post<void>(url);
    }

    /**
     * Get comments for a post
     */
    async getComments(id: number): Promise<Comment[]> {
        const url = this.buildUrl(`/${id}/comments/`);
        return this.httpClient.get<Comment[]>(url);
    }
}

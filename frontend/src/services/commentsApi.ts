/**
 * Comments API Service
 * 
 * Single Responsibility: Handle all comment-related API operations
 */

import { Comment, CommentCreateData } from '../types/models';
import { BaseApiService, IHttpClient } from './httpClient';

export interface ICommentsApiService {
    create(data: CommentCreateData): Promise<Comment>;
    update(id: number, content: string): Promise<Comment>;
    delete(id: number): Promise<void>;
    like(id: number): Promise<void>;
    unlike(id: number): Promise<void>;
}

export class CommentsApiService extends BaseApiService implements ICommentsApiService {
    constructor(httpClient: IHttpClient) {
        super(httpClient, '/comments');
    }

    async create(data: CommentCreateData): Promise<Comment> {
        const url = this.buildUrl('/');
        return this.httpClient.post<Comment>(url, data);
    }

    async update(id: number, content: string): Promise<Comment> {
        const url = this.buildUrl(`/${id}/`);
        return this.httpClient.patch<Comment>(url, { content });
    }

    async delete(id: number): Promise<void> {
        const url = this.buildUrl(`/${id}/`);
        return this.httpClient.delete<void>(url);
    }

    async like(id: number): Promise<void> {
        const url = this.buildUrl(`/${id}/like/`);
        return this.httpClient.post<void>(url);
    }

    async unlike(id: number): Promise<void> {
        const url = this.buildUrl(`/${id}/unlike/`);
        return this.httpClient.post<void>(url);
    }
}

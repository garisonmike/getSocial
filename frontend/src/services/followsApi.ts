/**
 * Follows API Service
 * 
 * Single Responsibility: Handle all follow-related API operations
 */

import { Follow } from '../types/models';
import { BaseApiService, IHttpClient } from './httpClient';

export interface IFollowsApiService {
    follow(userId: number): Promise<Follow>;
    unfollow(userId: number): Promise<void>;
    getMyFollows(): Promise<Follow[]>;
}

export class FollowsApiService extends BaseApiService implements IFollowsApiService {
    constructor(httpClient: IHttpClient) {
        super(httpClient, '/follows');
    }

    async follow(userId: number): Promise<Follow> {
        const url = this.buildUrl('/');
        return this.httpClient.post<Follow>(url, { following_id: userId });
    }

    async unfollow(userId: number): Promise<void> {
        const url = this.buildUrl('/unfollow/');
        return this.httpClient.post<void>(url, { following_id: userId });
    }

    async getMyFollows(): Promise<Follow[]> {
        const url = this.buildUrl('/');
        return this.httpClient.get<Follow[]>(url);
    }
}

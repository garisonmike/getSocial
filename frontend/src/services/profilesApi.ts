/**
 * User Profiles API Service
 * 
 * Single Responsibility: Handle all user profile-related API operations
 */

import { Follow, UserProfile, UserProfileUpdateData } from '../types/models';
import { BaseApiService, IHttpClient } from './httpClient';

export interface IProfilesApiService {
    getMe(): Promise<UserProfile>;
    getById(id: number): Promise<UserProfile>;
    getByUsername(username: string): Promise<UserProfile>;
    update(id: number, data: UserProfileUpdateData): Promise<UserProfile>;
    getFollowers(id: number): Promise<Follow[]>;
    getFollowing(id: number): Promise<Follow[]>;
}

export class ProfilesApiService extends BaseApiService implements IProfilesApiService {
    constructor(httpClient: IHttpClient) {
        super(httpClient, '/profiles');
    }

    async getMe(): Promise<UserProfile> {
        const url = this.buildUrl('/me/');
        return this.httpClient.get<UserProfile>(url);
    }

    async getById(id: number): Promise<UserProfile> {
        const url = this.buildUrl(`/${id}/`);
        return this.httpClient.get<UserProfile>(url);
    }

    async getByUsername(username: string): Promise<UserProfile> {
        const url = this.buildUrl(`/?username=${username}`);
        const response = await this.httpClient.get<{ results: UserProfile[] }>(url);

        if (response.results && response.results.length > 0) {
            return response.results[0];
        }

        throw new Error('Profile not found');
    }

    async update(id: number, data: UserProfileUpdateData): Promise<UserProfile> {
        const url = this.buildUrl(`/${id}/`);

        // Check if we have files to upload
        const hasFiles = data.avatar || data.cover_photo;

        if (hasFiles) {
            const formData = this.createFormData(data);
            return this.httpClient.patch<UserProfile>(url, formData, this.getFileUploadConfig());
        }

        return this.httpClient.patch<UserProfile>(url, data);
    }

    async getFollowers(id: number): Promise<Follow[]> {
        const url = this.buildUrl(`/${id}/followers/`);
        return this.httpClient.get<Follow[]>(url);
    }

    async getFollowing(id: number): Promise<Follow[]> {
        const url = this.buildUrl(`/${id}/following/`);
        return this.httpClient.get<Follow[]>(url);
    }
}

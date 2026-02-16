/**
 * Centralized API Services Export
 * 
 * This module provides a single entry point for all API services
 * following the Dependency Inversion principle
 */

import { CommentsApiService } from './commentsApi';
import { FollowsApiService } from './followsApi';
import { httpClient } from './httpClient';
import { PostsApiService } from './postsApi';
import { ProfilesApiService } from './profilesApi';

// Create singleton instances of all API services
export const postsApi = new PostsApiService(httpClient);
export const commentsApi = new CommentsApiService(httpClient);
export const profilesApi = new ProfilesApiService(httpClient);
export const followsApi = new FollowsApiService(httpClient);

// Export for direct use
export { httpClient } from './httpClient';

// Export types
export type { ICommentsApiService } from './commentsApi';
export type { IFollowsApiService } from './followsApi';
export type { IHttpClient } from './httpClient';
export type { IPostsApiService } from './postsApi';
export type { IProfilesApiService } from './profilesApi';

// Default export for convenience
const api = {
    posts: postsApi,
    comments: commentsApi,
    profiles: profilesApi,
    follows: followsApi,
    httpClient,
};

export default api;

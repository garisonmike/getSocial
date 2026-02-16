/**
 * API Client following SOLID principles
 * 
 * - Single Responsibility: Each class handles specific API domain
 * - Open/Closed: Extensible without modification
 * - Dependency Inversion: Depends on HttpClient abstraction
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { logError, parseError } from '../utils/errorHandling';

/**
 * HTTP Client interface (Dependency Inversion)
 * Components depend on this abstraction, not concrete implementation
 */
export interface IHttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

/**
 * Base HTTP Client implementation
 * Single Responsibility: Handle HTTP communication and error transformation
 */
export class HttpClient implements IHttpClient {
    private client: AxiosInstance;

    constructor(baseURL: string = '/api') {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors(): void {
        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getAuthToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(parseError(error));
            }
        );

        // Response interceptor - handle errors globally
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                const parsedError = parseError(error);

                // Handle authentication errors globally
                if (parsedError.name === 'AuthenticationError') {
                    this.handleAuthenticationError();
                }

                logError(parsedError, 'API Request');
                return Promise.reject(parsedError);
            }
        );
    }

    /**
     * Get authentication token from storage
     */
    private getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Handle authentication errors (redirect to login)
     */
    private handleAuthenticationError(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
    }

    /**
     * Extract data from response
     */
    private handleResponse<T>(response: AxiosResponse<T>): T {
        return response.data;
    }

    /**
     * GET request
     */
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return this.handleResponse(response);
    }

    /**
     * POST request
     */
    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return this.handleResponse(response);
    }

    /**
     * PUT request
     */
    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return this.handleResponse(response);
    }

    /**
     * PATCH request
     */
    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return this.handleResponse(response);
    }

    /**
     * DELETE request
     */
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return this.handleResponse(response);
    }
}

/**
 * Base API Service class
 * Single Responsibility: Provide common API functionality
 * Open/Closed: Extend this for specific API domains
 */
export abstract class BaseApiService {
    constructor(protected httpClient: IHttpClient, protected basePath: string) { }

    /**
     * Build URL with base path
     */
    protected buildUrl(endpoint: string): string {
        return `${this.basePath}${endpoint}`;
    }

    /**
     * Create FormData for file uploads
     */
    protected createFormData(data: Record<string, any>): FormData {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (value instanceof File) {
                    formData.append(key, value);
                } else if (typeof value === 'object') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        return formData;
    }

    /**
     * Get config for file upload
     */
    protected getFileUploadConfig(): AxiosRequestConfig {
        return {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };
    }
}

/**
 * Singleton instance of HTTP client
 */
export const httpClient = new HttpClient();

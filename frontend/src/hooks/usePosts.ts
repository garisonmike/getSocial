/**
 * Custom hooks for Posts
 * 
 * Single Responsibility: Each hook handles one specific concern
 * - usePosts: Fetch and manage posts list
 * - usePost: Fetch and manage single post
 * - usePostLike: Handle like/unlike logic
 * - usePostCreate: Handle post creation
 */

import { useCallback, useEffect, useState } from 'react';
import { postsApi } from '../services/api';
import { PaginatedResponse, Post, PostCreateData } from '../types/models';
import { handleError } from '../utils/errorHandling';

/**
 * Hook for fetching paginated posts
 * Single Responsibility: Manage posts list state
 */
export function usePosts(initialPage: number = 1) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const fetchPosts = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);

            const response: PaginatedResponse<Post> = await postsApi.getAll(pageNum);

            setPosts(prevPosts =>
                append ? [...prevPosts, ...response.results] : response.results
            );
            setHasMore(response.next !== null);
            setTotalCount(response.count);
        } catch (err) {
            const errorMessage = handleError(err, 'usePosts.fetchPosts');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(page, page > 1);
    }, [page, fetchPosts]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [isLoading, hasMore]);

    const refresh = useCallback(() => {
        setPage(1);
        fetchPosts(1, false);
    }, [fetchPosts]);

    const addPost = useCallback((newPost: Post) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setTotalCount(prev => prev + 1);
    }, []);

    const removePost = useCallback((postId: number) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        setTotalCount(prev => prev - 1);
    }, []);

    const updatePost = useCallback((postId: number, updates: Partial<Post>) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, ...updates } : post
            )
        );
    }, []);

    return {
        posts,
        isLoading,
        error,
        hasMore,
        totalCount,
        loadMore,
        refresh,
        addPost,
        removePost,
        updatePost,
    };
}

/**
 * Hook for fetching personalized feed
 */
export function useFeed(initialPage: number = 1) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);

    const fetchFeed = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);

            const response: PaginatedResponse<Post> = await postsApi.getFeed(pageNum);

            setPosts(prevPosts =>
                append ? [...prevPosts, ...response.results] : response.results
            );
            setHasMore(response.next !== null);
        } catch (err) {
            const errorMessage = handleError(err, 'useFeed.fetchFeed');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFeed(page, page > 1);
    }, [page, fetchFeed]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    }, [isLoading, hasMore]);

    const refresh = useCallback(() => {
        setPage(1);
        fetchFeed(1, false);
    }, [fetchFeed]);

    return {
        posts,
        isLoading,
        error,
        hasMore,
        loadMore,
        refresh,
    };
}

/**
 * Hook for fetching single post
 * Single Responsibility: Manage single post state
 */
export function usePost(postId: number | null) {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPost = useCallback(async (id: number) => {
        try {
            setIsLoading(true);
            setError(null);

            const fetchedPost = await postsApi.getById(id);
            setPost(fetchedPost);
        } catch (err) {
            const errorMessage = handleError(err, 'usePost.fetchPost');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (postId) {
            fetchPost(postId);
        }
    }, [postId, fetchPost]);

    const refresh = useCallback(() => {
        if (postId) {
            fetchPost(postId);
        }
    }, [postId, fetchPost]);

    return { post, isLoading, error, refresh };
}

/**
 * Hook for handling post like/unlike with optimistic updates
 * Single Responsibility: Manage like state and API calls
 */
export function usePostLike(initialPost: Post) {
    const [isLiked, setIsLiked] = useState(initialPost.is_liked);
    const [likesCount, setLikesCount] = useState(initialPost.likes_count);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleLike = useCallback(async () => {
        if (isLoading) return;

        // Store previous state for rollback
        const previousIsLiked = isLiked;
        const previousLikesCount = likesCount;

        // Optimistic update
        const newIsLiked = !isLiked;
        const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

        setIsLiked(newIsLiked);
        setLikesCount(newLikesCount);
        setIsLoading(true);
        setError(null);

        try {
            if (previousIsLiked) {
                await postsApi.unlike(initialPost.id);
            } else {
                await postsApi.like(initialPost.id);
            }
        } catch (err) {
            // Rollback on error
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikesCount);

            const errorMessage = handleError(err, 'usePostLike.toggleLike');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [initialPost.id, isLiked, likesCount, isLoading]);

    return {
        isLiked,
        likesCount,
        isLoading,
        error,
        toggleLike,
    };
}

/**
 * Hook for creating posts
 * Single Responsibility: Handle post creation logic
 */
export function usePostCreate() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdPost, setCreatedPost] = useState<Post | null>(null);

    const createPost = useCallback(async (data: PostCreateData): Promise<Post | null> => {
        try {
            setIsLoading(true);
            setError(null);

            const newPost = await postsApi.create(data);
            setCreatedPost(newPost);

            return newPost;
        } catch (err) {
            const errorMessage = handleError(err, 'usePostCreate.createPost');
            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setCreatedPost(null);
        setError(null);
    }, []);

    return {
        createPost,
        isLoading,
        error,
        createdPost,
        reset,
    };
}

/**
 * Hook for deleting posts
 * Single Responsibility: Handle post deletion logic
 */
export function usePostDelete() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deletePost = useCallback(async (postId: number): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            await postsApi.delete(postId);
            return true;
        } catch (err) {
            const errorMessage = handleError(err, 'usePostDelete.deletePost');
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        deletePost,
        isLoading,
        error,
    };
}

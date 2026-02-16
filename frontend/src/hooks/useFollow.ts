/**
 * Custom hooks for Follow functionality
 * 
 * Single Responsibility: Handle follow/unfollow logic with optimistic updates
 */

import { useCallback, useState } from 'react';
import { followsApi } from '../services/api';
import { handleError } from '../utils/errorHandling';

/**
 * Hook for handling follow/unfollow with optimistic updates
 */
export function useFollow(userId: number, initialIsFollowing: boolean = false) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleFollow = useCallback(async () => {
        if (isLoading) return;

        // Store previous state for rollback
        const previousIsFollowing = isFollowing;

        // Optimistic update
        setIsFollowing(!isFollowing);
        setIsLoading(true);
        setError(null);

        try {
            if (previousIsFollowing) {
                await followsApi.unfollow(userId);
            } else {
                await followsApi.follow(userId);
            }
        } catch (err) {
            // Rollback on error
            setIsFollowing(previousIsFollowing);

            const errorMessage = handleError(err, 'useFollow.toggleFollow');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [userId, isFollowing, isLoading]);

    return {
        isFollowing,
        isLoading,
        error,
        toggleFollow,
    };
}

/**
 * Hook for batch following operations
 */
export function useFollowActions() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const follow = useCallback(async (userId: number): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            await followsApi.follow(userId);
            return true;
        } catch (err) {
            const errorMessage = handleError(err, 'useFollowActions.follow');
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const unfollow = useCallback(async (userId: number): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            await followsApi.unfollow(userId);
            return true;
        } catch (err) {
            const errorMessage = handleError(err, 'useFollowActions.unfollow');
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        follow,
        unfollow,
        isLoading,
        error,
    };
}

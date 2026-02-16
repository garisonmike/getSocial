/**
 * Custom hooks for User Profiles
 * 
 * Single Responsibility: Each hook handles one specific profile concern
 */

import { useCallback, useEffect, useState } from 'react';
import { profilesApi } from '../services/api';
import { Follow, UserProfile, UserProfileUpdateData } from '../types/models';
import { handleError } from '../utils/errorHandling';

/**
 * Hook for current user's profile
 */
export function useMyProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const fetchedProfile = await profilesApi.getMe();
            setProfile(fetchedProfile);
        } catch (err) {
            const errorMessage = handleError(err, 'useMyProfile.fetchProfile');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const refresh = useCallback(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, isLoading, error, refresh };
}

/**
 * Hook for fetching profile by ID
 */
export function useProfile(profileId: number | null) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async (id: number) => {
        try {
            setIsLoading(true);
            setError(null);

            const fetchedProfile = await profilesApi.getById(id);
            setProfile(fetchedProfile);
        } catch (err) {
            const errorMessage = handleError(err, 'useProfile.fetchProfile');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (profileId) {
            fetchProfile(profileId);
        }
    }, [profileId, fetchProfile]);

    const refresh = useCallback(() => {
        if (profileId) {
            fetchProfile(profileId);
        }
    }, [profileId, fetchProfile]);

    return { profile, isLoading, error, refresh };
}

/**
 * Hook for fetching profile by username
 */
export function useProfileByUsername(username: string | null) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async (user: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const fetchedProfile = await profilesApi.getByUsername(user);
            setProfile(fetchedProfile);
        } catch (err) {
            const errorMessage = handleError(err, 'useProfileByUsername.fetchProfile');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (username) {
            fetchProfile(username);
        }
    }, [username, fetchProfile]);

    const refresh = useCallback(() => {
        if (username) {
            fetchProfile(username);
        }
    }, [username, fetchProfile]);

    return { profile, isLoading, error, refresh };
}

/**
 * Hook for updating profile
 */
export function useProfileUpdate() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null);

    const updateProfile = useCallback(
        async (profileId: number, data: UserProfileUpdateData): Promise<UserProfile | null> => {
            try {
                setIsLoading(true);
                setError(null);

                const updated = await profilesApi.update(profileId, data);
                setUpdatedProfile(updated);

                return updated;
            } catch (err) {
                const errorMessage = handleError(err, 'useProfileUpdate.updateProfile');
                setError(errorMessage);
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const reset = useCallback(() => {
        setUpdatedProfile(null);
        setError(null);
    }, []);

    return {
        updateProfile,
        isLoading,
        error,
        updatedProfile,
        reset,
    };
}

/**
 * Hook for fetching followers
 */
export function useFollowers(profileId: number | null) {
    const [followers, setFollowers] = useState<Follow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFollowers = useCallback(async (id: number) => {
        try {
            setIsLoading(true);
            setError(null);

            const fetchedFollowers = await profilesApi.getFollowers(id);
            setFollowers(fetchedFollowers);
        } catch (err) {
            const errorMessage = handleError(err, 'useFollowers.fetchFollowers');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (profileId) {
            fetchFollowers(profileId);
        }
    }, [profileId, fetchFollowers]);

    const refresh = useCallback(() => {
        if (profileId) {
            fetchFollowers(profileId);
        }
    }, [profileId, fetchFollowers]);

    return { followers, isLoading, error, refresh };
}

/**
 * Hook for fetching following
 */
export function useFollowing(profileId: number | null) {
    const [following, setFollowing] = useState<Follow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchFollowing = useCallback(async (id: number) => {
        try {
            setIsLoading(true);
            setError(null);

            const fetchedFollowing = await profilesApi.getFollowing(id);
            setFollowing(fetchedFollowing);
        } catch (err) {
            const errorMessage = handleError(err, 'useFollowing.fetchFollowing');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (profileId) {
            fetchFollowing(profileId);
        }
    }, [profileId, fetchFollowing]);

    const refresh = useCallback(() => {
        if (profileId) {
            fetchFollowing(profileId);
        }
    }, [profileId, fetchFollowing]);

    return { following, isLoading, error, refresh };
}

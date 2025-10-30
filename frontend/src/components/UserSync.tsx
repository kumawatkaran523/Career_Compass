'use client';

import { useUserSync } from '@/app/hooks/useUserSync';
import { useEffect } from 'react';

export default function UserSync() {
    const { dbUserId, syncing, error } = useUserSync();

    // Debug logging
    useEffect(() => {
        if (dbUserId) {
            console.log('🎯 DB User ID available:', dbUserId);
        }
        if (error) {
            console.error('⚠️ User sync error:', error);
        }
    }, [dbUserId, error]);

    return null; // Doesn't render anything
}

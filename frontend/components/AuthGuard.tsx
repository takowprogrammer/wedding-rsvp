'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuthToken, isTokenValid } from '../lib/auth';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') {
            setIsAuthenticated(true);
            return;
        }

        // Check authentication
        const token = getAuthToken();

        if (!token) {
            // No token, redirect to login
            const loginUrl = `/admin/login?from=${encodeURIComponent(pathname)}`;
            router.replace(loginUrl);
            return;
        }

        if (!isTokenValid(token)) {
            // Invalid or expired token, redirect to login
            const loginUrl = `/admin/login?from=${encodeURIComponent(pathname)}&expired=true`;
            router.replace(loginUrl);
            return;
        }

        // Token is valid
        setIsAuthenticated(true);
    }, [pathname, router]);

    // Show loading while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Show children if authenticated
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // This should never be reached due to redirects above
    return null;
}

// Helper function to navigate to public routes from admin pages
export const navigateToPublicRoute = (router: any, path: string) => {
    // Clear admin authentication for public routes
    if (typeof window !== 'undefined') {
        // Clear the admin token cookie when going to public routes
        document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    router.push(path);
};

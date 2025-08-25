// Authentication utility functions

export const isTokenValid = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > currentTime;
    } catch {
        return false;
    }
};

export const getTokenExpiration = (token: string): Date | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch {
        return null;
    }
};

export const logout = () => {
    // Clear the token cookie
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Redirect to login page
    window.location.href = '/admin/login';
};

export const getAuthToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin_token='))
        ?.split('=')[1];
    
    if (!token) return null;
    
    // Check if token is still valid
    if (!isTokenValid(token)) {
        logout();
        return null;
    }
    
    return token;
};

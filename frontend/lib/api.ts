const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') {
        return undefined;
    }
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
};

export const api = {
    get: async (url: string) => {
        const token = getCookie('admin_token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(url, { headers });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'API request failed');
        }
        return res.json();
    },
    post: async (url: string, data: any) => {
        const token = getCookie('admin_token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'API request failed');
        }
        return res.json();
    },
    delete: async (url: string) => {
        const token = getCookie('admin_token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(url, {
            method: 'DELETE',
            headers,
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'API request failed');
        }
        if (res.status === 204) {
            return;
        }
        return res.json();
    },
};

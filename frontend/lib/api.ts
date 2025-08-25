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

        console.log('API GET request to:', url);
        console.log('Headers:', headers);

        try {
            const res = await fetch(url, { headers });
            console.log('Response status:', res.status);
            console.log('Response headers:', Object.fromEntries(res.headers.entries()));

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({ message: 'Failed to parse error response' }));
                console.error('API error response:', errorData);
                throw new Error(errorData.message || 'API request failed');
            }

            const data = await res.json();
            console.log('API response data:', data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new Error('Failed to fetch data');
        }
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

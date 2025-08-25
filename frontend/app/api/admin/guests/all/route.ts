import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const backendUrl = 'http://localhost:8080/api/guests/all';
    const authHeader = req.headers.get('authorization');

    try {
        const res = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });

        if (!res.ok) {
            const result = await res.json().catch(() => ({ message: 'Failed to fetch guests' }));
            console.error('Guests all API error:', result);
            return NextResponse.json({ error: result.message || 'Failed to fetch guests' }, { status: res.status });
        }

        const result = await res.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching all guests:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

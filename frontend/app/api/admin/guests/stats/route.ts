import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const backendUrl = 'http://localhost:8080/api/guests/stats';
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
            const result = await res.json().catch(() => ({ message: 'Failed to fetch stats' }));
            console.error('Guests stats API error:', result);
            return NextResponse.json({ error: result.message || 'Failed to fetch stats' }, { status: res.status });
        }

        const result = await res.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching guest stats:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

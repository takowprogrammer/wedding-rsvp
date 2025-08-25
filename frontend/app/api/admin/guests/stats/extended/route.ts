import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const eventDate = url.searchParams.get('eventDate');
    const backendUrl = `http://localhost:8080/api/guests/stats/extended${eventDate ? `?eventDate=${encodeURIComponent(eventDate)}` : ''}`;
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
            const result = await res.json().catch(() => ({ message: 'Failed to fetch extended stats' }));
            console.error('Stats API error:', result);
            return NextResponse.json({ error: result.message || 'Failed to fetch extended stats' }, { status: res.status });
        }

        const result = await res.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error fetching extended guest stats:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

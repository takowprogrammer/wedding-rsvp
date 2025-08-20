import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const eventDate = url.searchParams.get('eventDate');
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const backendUrl = `${backendBase}/api/guests/stats/extended${eventDate ? `?eventDate=${encodeURIComponent(eventDate)}` : ''}`;
    const authHeader = req.headers.get('authorization');

    try {
        const res = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });
        const result = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: result.message || 'Failed to fetch extended stats' }, { status: res.status });
        }
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
} 
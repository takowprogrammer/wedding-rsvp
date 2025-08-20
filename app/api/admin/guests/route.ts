import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const backendUrl = new URL(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/guests/admin');
    const authHeader = req.headers.get('authorization');

    // Forward query params
    const searchParams = req.nextUrl.searchParams;
    searchParams.forEach((value, key) => {
        backendUrl.searchParams.append(key, value);
    });

    try {
        const res = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });
        const result = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: result.message || 'Failed to fetch guests' }, { status: res.status });
        }
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}
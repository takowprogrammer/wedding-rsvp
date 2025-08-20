import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api').replace(/\/$/, '');
    const fullUrl = new URL(`${baseUrl}/guests/admin`);

    // Forward query params from the incoming request
    req.nextUrl.searchParams.forEach((value, key) => {
        fullUrl.searchParams.append(key, value);
    });

    const authHeader = req.headers.get('authorization');

    try {
        const res = await fetch(fullUrl.toString(), {
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
        return NextResponse.json({ error: error.message || `Something went wrong: ${error.message}` }, { status: 500 });
    }
}
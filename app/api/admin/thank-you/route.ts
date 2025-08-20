import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/thank-you/send';
    const authHeader = req.headers.get('authorization');
    try {
        const res = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });
        const result = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: result.message || 'Failed to send thank-you emails' }, { status: res.status });
        }
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
} 
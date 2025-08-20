import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/guest-groups';
    try {
        const res = await fetch(backendUrl, { method: 'GET' });
        const result = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: result.message || 'Failed to fetch guest groups' }, { status: res.status });
        }
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/guest-groups';
    const data = await req.json();
    try {
        const res = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: result.message || 'Failed to create guest group' }, { status: res.status });
        }
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
} 
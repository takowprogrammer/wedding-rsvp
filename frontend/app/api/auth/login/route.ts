import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Use the correct backend URL for server-side requests
    const backendUrl = 'http://localhost:8080/api/auth/login';
    
    try {
        const body = await req.json();
        
        const res = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        
        const result = await res.json();
        
        if (!res.ok) {
            return NextResponse.json({ error: result.message || 'Login failed' }, { status: res.status });
        }
        
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Login API error:', error);
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}



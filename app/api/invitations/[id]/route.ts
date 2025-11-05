import { NextRequest, NextResponse } from 'next/server';
import { getBackendEndpoint } from '@/config/backend';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');

    try {
        const url = getBackendEndpoint(`/invitations/${encodeURIComponent(id)}`);

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Failed to fetch invitation: ${res.statusText}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}



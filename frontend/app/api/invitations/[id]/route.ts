import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/invitations';

    try {
        const res = await fetch(`${backendUrl}/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const result = await res.json();
            return NextResponse.json(
                { error: result.message || 'Failed to delete invitation' },
                { status: res.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/invitations';

    try {
        const res = await fetch(`${backendUrl}/${id}`);

        if (!res.ok) {
            const result = await res.json();
            return NextResponse.json(
                { error: result.message || 'Failed to fetch invitation' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/invitations';
    const body = await req.json();

    try {
        const res = await fetch(`${backendUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const result = await res.json();
            return NextResponse.json(
                { error: result.message || 'Failed to update invitation' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/invitations';

    try {
        const res = await fetch(`${backendUrl}/${params.id}`, {
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
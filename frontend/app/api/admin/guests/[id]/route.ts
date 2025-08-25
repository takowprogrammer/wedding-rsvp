import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const backendUrl = `http://localhost:8080/api/guests/${id}`;
    const authHeader = req.headers.get('authorization');

    try {
        const res = await fetch(backendUrl, {
            method: 'DELETE',
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Failed to delete guest' }));
            console.error('Delete guest API error:', errorData);
            return NextResponse.json({ error: errorData.message || 'Failed to delete guest' }, { status: res.status });
        }

        // Check if the response has content before trying to parse it as JSON
        const contentLength = res.headers.get('content-length');
        if (contentLength && parseInt(contentLength, 10) > 0) {
            const result = await res.json();
            return NextResponse.json(result, { status: res.status });
        }

        // If there's no content, return a 204 No Content response
        return new NextResponse(null, { status: 204 });

    } catch (error) {
        console.error('Error updating guest:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

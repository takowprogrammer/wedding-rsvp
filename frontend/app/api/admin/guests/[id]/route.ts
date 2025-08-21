import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api').replace(/\/$/, '');
    const backendUrl = `${baseUrl}/guests/${id}`;
    const authHeader = req.headers.get('authorization');

    try {
        const res = await fetch(backendUrl, {
            method: 'DELETE',
            headers: {
                ...(authHeader ? { Authorization: authHeader } : {}),
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
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

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/invitations';

    try {
        const res = await fetch(`${backendUrl}/${id}/preview`);

        if (!res.ok) {
            // Try to get error message as JSON, fallback to text if it fails
            let errorMessage = 'Failed to fetch invitation preview';
            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // If JSON parsing fails, try to get text
                try {
                    errorMessage = await res.text();
                } catch {
                    // Use default message if all else fails
                }
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: res.status }
            );
        }

        // Get the HTML content as text since it's not JSON
        const htmlContent = await res.text();

        // Return the HTML content with proper headers
        return new NextResponse(htmlContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        });
    } catch (error: any) {
        console.error('Preview route error:', error);
        return NextResponse.json(
            { error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}

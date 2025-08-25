import { NextRequest, NextResponse } from 'next/server';

const backendUrl = 'http://localhost:8080/api';

export async function GET() {
    try {
        const response = await fetch(`${backendUrl}/invitations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const invitations = await response.json();
        return NextResponse.json(invitations);
    } catch (error) {
        console.error('Error fetching invitations from backend:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invitations' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { templateName, title, message, buttonText, imageUrl, formUrl } = body;

        // Validate required fields
        if (!templateName || !title || !message || !buttonText) {
            return NextResponse.json(
                { error: 'Missing required fields: templateName, title, message, and buttonText are required' },
                { status: 400 }
            );
        }

        // Send request to backend
        const response = await fetch(`${backendUrl}/invitations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                templateName,
                title,
                message,
                buttonText,
                imageUrl: imageUrl || null,
                formUrl: formUrl || '/rsvp',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Backend responded with status: ${response.status}`);
        }

        const invitation = await response.json();
        console.log('Created invitation via backend:', invitation);

        return NextResponse.json(invitation, { status: 201 });
    } catch (error: any) {
        console.error('Error creating invitation:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create invitation' },
            { status: 500 }
        );
    }
}

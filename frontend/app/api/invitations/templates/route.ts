import { NextResponse } from 'next/server';

const backendUrl = 'http://localhost:8080/api';

export async function GET() {
    try {
        const response = await fetch(`${backendUrl}/invitations/templates`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend responded with status: ${response.status}`);
        }

        const templates = await response.json();
        
        // Add display names for better user experience
        const templatesWithDisplayNames = templates.map((t: any) => ({
            ...t,
            displayName: t.templateName
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (l: string) => l.toUpperCase())
        }));

        return NextResponse.json(templatesWithDisplayNames);
    } catch (error) {
        console.error('Error fetching templates from backend:', error);
        
        // Fallback to hardcoded templates if backend is unavailable
        const fallbackTemplates = [
            {
                templateName: "nude_warmth",
                imageUrl: "/invitations/nude_warmth.png",
                file: "nude_warmth.html",
                displayName: "Nude Warmth"
            },
            {
                templateName: "phoenix_sand_radiance",
                imageUrl: "/invitations/phoenix_sand_radiance.png",
                file: "phoenix_sand_radiance.html",
                displayName: "Phoenix Sand Radiance"
            },
            {
                templateName: "dusty_blue_serenity",
                imageUrl: "/invitations/dusty_blue_serenity.png",
                file: "dusty_blue_serenity.html",
                displayName: "Dusty Blue Serenity"
            },
            {
                templateName: "pure_white_elegance",
                imageUrl: "/invitations/pure_white_elegance.png",
                file: "pure_white_elegance.html",
                displayName: "Pure White Elegance"
            }
        ];
        
        return NextResponse.json(fallbackTemplates);
    }
}

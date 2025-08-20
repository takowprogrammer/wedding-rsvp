import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/invitations/templates';
    try {
        const res = await fetch(backendUrl);
        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message || 'Failed to fetch templates');
        }
        return NextResponse.json(result);
    } catch {
        // Fallback: local filesystem scan
        const candidates = [
            path.join(process.cwd(), 'frontend', 'public', 'invitations'),
            path.join(process.cwd(), 'public', 'invitations'),
        ];
        for (const dir of candidates) {
            try {
                const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png'));
                if (files.length > 0) {
                    return NextResponse.json(files.map(f => ({
                        file: f,
                        templateName: path.parse(f).name,
                        imageUrl: `/invitations/${f}`,
                    })));
                }
            } catch { }
        }
        return NextResponse.json([]);
    }
} 
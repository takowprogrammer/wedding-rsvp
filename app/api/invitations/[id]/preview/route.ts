import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
    const url = `${backendBase}/api/invitations/${encodeURIComponent(id)}/preview`;
    const res = await fetch(url);
    const html = await res.text();
    return new Response(html, { headers: { 'Content-Type': 'text/html' }, status: res.status });
} 
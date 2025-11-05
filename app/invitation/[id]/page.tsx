'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import SmartImage from '@/components/SmartImage';

interface Invitation {
    id: string;
    templateName: string;
    title: string;
    message: string;
    imageUrl?: string;
    buttonText: string;
    formUrl: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Helper function to get the correct image URL
const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return '';

    // If it's already an API URL, return as is
    if (imageUrl.startsWith('/api/invitations/image/')) {
        return imageUrl;
    }

    // If it's a static path like /invitations/filename.jpg, convert to API URL
    if (imageUrl.startsWith('/invitations/')) {
        const filename = imageUrl.replace('/invitations/', '');
        return `/api/invitations/image/${filename}`;
    }

    // For any other format, return as is
    return imageUrl;
};

function InvitationContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const isPreview = searchParams?.get('preview') === '1';

    const [invitation, setInvitation] = useState<Invitation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [showFullImage, setShowFullImage] = useState(false);

    // Handle escape key to close full image
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showFullImage) {
                setShowFullImage(false);
            }
        };

        if (showFullImage) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [showFullImage]);

    useEffect(() => {
        const id = params?.id?.toString?.() || '';
        if (!id) return;

        if (isPreview) {
            setInvitation({
                id,
                templateName: 'classic',
                title: 'You Are Cordially Invited',
                message:
                    'Join us as we celebrate together.',
                imageUrl: '/invitations/wedding_invitation_improved_4.png',
                buttonText: 'RSVP Now',
                formUrl: '/rsvp',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            setError('');
            setLoading(false);
            return;
        }

        const fetchInvitation = async () => {
            try {
                const res = await fetch(`/api/invitations/${id}`);
                if (!res.ok) throw new Error('Invitation not found');
                const data = await res.json();
                setInvitation(data);
                setError('');
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'Failed to load invitation';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchInvitation();
    }, [params, isPreview]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-rose-50 p-4">
                <div className="text-center">
                    <div className="mx-auto mb-3 h-10 w-10 rounded-full border-2 border-sky-600 border-t-transparent animate-spin" />
                    <p className="text-slate-600">Loading invitation...</p>
                </div>
            </div>
        );
    }

    if (error || !invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-rose-50 p-4">
                <div className="max-w-md w-full text-center bg-white/80 backdrop-blur rounded-xl p-6 shadow">
                    <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-xl">✕</span>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-1">Invitation Not Found</h2>
                    <p className="text-slate-600 mb-4">{error || "The invitation you're looking for doesn't exist."}</p>
                    <Link href="/" className="inline-block px-3 py-2 rounded-md bg-sky-600 hover:bg-sky-700 text-white transition-colors">Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-rose-50 p-2 sm:p-4 relative overflow-hidden">
            {/* Full Image Overlay */}
            {showFullImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => setShowFullImage(false)}
                >
                    <div
                        className="relative max-w-4xl max-h-[95vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative rounded-2xl overflow-visible shadow-2xl border-4 border-white bg-white">
                            <SmartImage
                                src={getImageUrl(invitation.imageUrl) || '/placeholder-image.png'}
                                alt="Invitation"
                                className="w-full h-auto object-cover max-h-[85vh]"
                            />

                            {/* Close button */}
                            <button
                                onClick={() => setShowFullImage(false)}
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Close full image"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* RSVP button overlay on image */}
                            <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                                <Link
                                    href={`/rsvp?invitation=${invitation.id}`}
                                    className="bg-gradient-to-r from-dusty-blue-600 to-dusty-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:from-dusty-blue-700 hover:to-dusty-blue-800 transform hover:scale-105 transition-all duration-300 shadow-xl border-2 border-white/40"
                                >
                                    {invitation.buttonText}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Envelope Container */}
            <div
                className="relative w-full cursor-pointer group max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
                aria-expanded={showFullImage}
                aria-label={showFullImage ? 'Close invitation' : 'Open invitation'}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowFullImage((v) => !v);
                    }
                }}
                onClick={() => setShowFullImage(true)}
                style={{ perspective: '1200px' }}
            >
                {/* Depth shadow */}
                <div className="absolute inset-0 rounded-3xl translate-y-3 translate-x-2 blur-2xl bg-black/10 pointer-events-none" />

                {/* Main Envelope */}
                <div className="relative rounded-3xl shadow-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 overflow-visible min-h-[24rem] sm:min-h-[28rem] md:min-h-[32rem] lg:min-h-[36rem]">
                    {/* Flap */}
                    <div
                        className="absolute left-0 right-0 top-0 h-20 sm:h-24 md:h-28 lg:h-32"
                    >
                        <div
                            className="w-full h-full shadow-md"
                            style={{
                                background: 'linear-gradient(135deg, rgb(163,196,228), rgb(122,165,201))',
                                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                borderTopLeftRadius: '24px',
                                borderTopRightRadius: '24px',
                            }}
                        />
                    </div>

                    {/* Click-to-open hint */}
                    {!showFullImage && (
                        <div
                            className="absolute inset-x-0 top-16 sm:top-20 md:top-24 lg:top-28 z-20 flex justify-center pointer-events-none"
                            aria-hidden="true"
                        >
                            <div className="pointer-events-none flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium text-white shadow-lg ring-1 ring-white/40 bg-gradient-to-r from-sky-600 to-amber-500 opacity-95 translate-y-0 group-hover:-translate-y-0.5 group-hover:shadow-xl transition-all duration-300">
                                <span>Click to view invitation</span>
                                <span className="text-white/90 animate-bounce">▼</span>
                            </div>
                        </div>
                    )}

                    {/* Small preview image when closed */}
                    {!showFullImage && invitation.imageUrl && (
                        <div className="absolute inset-x-0 top-24 sm:top-28 md:top-32 lg:top-36 bottom-12 sm:bottom-14 md:bottom-16 lg:bottom-20 mx-4 sm:mx-6 md:mx-8 pointer-events-none">
                            <div className="relative rounded-lg overflow-hidden shadow-lg border-2 border-white/60 bg-white/90 backdrop-blur-sm">
                                <SmartImage
                                    src={getImageUrl(invitation.imageUrl)}
                                    alt="Invitation preview"
                                    className="w-full h-24 sm:h-28 md:h-32 lg:h-36 object-cover opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2 text-center">
                                    <span className="text-xs sm:text-sm font-medium text-white drop-shadow-lg">
                                        Click to view invitation
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Decorative band under flap */}
                    <div className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 px-4 sm:px-6 py-3 sm:py-4">
                        <div className="border-t-2 border-b-2 border-slate-200 py-2">
                            <div className="flex justify-center gap-2 text-slate-400">
                                <div className="w-2 h-2 bg-sky-300 rounded-full" />
                                <div className="w-2 h-2 bg-amber-300 rounded-full" />
                                <div className="w-2 h-2 bg-sky-300 rounded-full" />
                                <div className="w-2 h-2 bg-amber-300 rounded-full" />
                                <div className="w-2 h-2 bg-sky-300 rounded-full" />
                            </div>
                        </div>
                    </div>

                    {/* Side flaps */}
                    <div className="absolute left-0 right-0 top-20 sm:top-24 md:top-28 lg:top-32 bottom-12 sm:bottom-14 md:bottom-16 lg:bottom-20 pointer-events-none">
                        <div
                            className="absolute left-0 top-0 h-full w-1/2 opacity-90"
                            style={{
                                background: 'linear-gradient(135deg, rgb(242,232,218), rgb(255,255,255), rgb(230,238,246))',
                                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                            }}
                        />
                        <div
                            className="absolute right-0 top-0 h-full w-1/2 opacity-90"
                            style={{
                                background: 'linear-gradient(225deg, rgb(242,232,218), rgb(255,255,255), rgb(230,238,246))',
                                clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
                            }}
                        />
                    </div>


                </div>
            </div>
        </div>
    );
}

export default function InvitationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-dusty-blue-50 via-amber-50 to-dusty-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dusty-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading invitation...</p>
                </div>
            </div>
        }>
            <InvitationContent />
        </Suspense>
    );
}
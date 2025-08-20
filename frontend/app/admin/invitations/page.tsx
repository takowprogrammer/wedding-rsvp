"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Invitation {
    id: string;
    templateName: string;
    title: string;
    message: string;
    imageUrl?: string;
    buttonText: string;
    formUrl?: string;
    isActive: boolean;
    createdAt: string;
}

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            const res = await fetch("/api/invitations");
            if (res.ok) {
                const data = await res.json();
                setInvitations(data);
            } else {
                setError("Failed to fetch invitations");
            }
        } catch (err) {
            setError("Failed to fetch invitations");
        } finally {
            setLoading(false);
        }
    };

    const deleteInvitation = async (id: string) => {
        if (!confirm("Are you sure you want to delete this invitation? This action cannot be undone.")) {
            return;
        }

        console.log('Deleting invitation:', id);
        setDeletingId(id);
        try {
            const res = await fetch(`/api/invitations/${id}`, {
                method: 'DELETE',
            });

            console.log('Delete response status:', res.status);
            console.log('Delete response ok:', res.ok);

            if (res.ok) {
                const result = await res.json();
                console.log('Delete success:', result);
                setInvitations(invitations.filter(inv => inv.id !== id));
            } else {
                const result = await res.json();
                console.log('Delete failed:', result);
                setError("Failed to delete invitation");
            }
        } catch (err) {
            console.error('Delete error:', err);
            setError("Failed to delete invitation");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTemplateName = (name: string) => {
        return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-nude-50 via-phoenix-sand-50 to-dusty-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-phoenix-sand-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading invitations...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-nude-50 via-phoenix-sand-50 to-dusty-blue-50">
            {/* Navigation Header */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/admin"
                                className="text-dusty-blue-600 hover:text-dusty-blue-800 font-medium transition-colors"
                            >
                                ← Back to Admin
                            </Link>
                            <span className="text-gray-400">|</span>
                            <Link
                                href="/"
                                className="text-dusty-blue-600 hover:text-dusty-blue-800 font-medium transition-colors"
                            >
                                Home
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-nude-600 to-phoenix-sand-600 bg-clip-text text-transparent">
                            Invitations
                        </h1>
                        <Link
                            href="/admin/invitations/new"
                            className="px-4 py-2 bg-gradient-to-r from-phoenix-sand-500 to-nude-500 hover:from-phoenix-sand-600 hover:to-nude-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            + New Invitation
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {invitations.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first beautiful invitation.</p>
                            <Link
                                href="/admin/invitations/new"
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-phoenix-sand-500 to-nude-500 hover:from-phoenix-sand-600 hover:to-nude-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Create Your First Invitation
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {invitations.map((invitation) => (
                            <div key={invitation.id} className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300">
                                {invitation.imageUrl && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={invitation.imageUrl}
                                            alt={invitation.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invitation.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {invitation.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(invitation.createdAt)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {invitation.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                                        {invitation.message}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="text-xs text-gray-500">
                                            <span className="font-medium">Template:</span> {formatTemplateName(invitation.templateName)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            <span className="font-medium">Button:</span> {invitation.buttonText}
                                        </div>
                                        {invitation.formUrl && (
                                            <div className="text-xs text-gray-500">
                                                <span className="font-medium">Form:</span> {invitation.formUrl}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/api/invitations/${invitation.id}/preview`}
                                            target="_blank"
                                            className="flex-1 px-3 py-2 text-sm bg-dusty-blue-100 text-dusty-blue-700 rounded-lg hover:bg-dusty-blue-200 transition-colors text-center"
                                        >
                                            Preview
                                        </Link>
                                        <button
                                            onClick={() => {
                                                const previewUrl = `/api/invitations/${invitation.id}/preview`;
                                                navigator.clipboard.writeText(previewUrl);
                                                // You could add a toast notification here
                                            }}
                                            className="flex-1 px-3 py-2 text-sm bg-phoenix-sand-100 text-phoenix-sand-700 rounded-lg hover:bg-phoenix-sand-200 transition-colors"
                                        >
                                            Copy Link
                                        </button>
                                        <button
                                            onClick={() => deleteInvitation(invitation.id)}
                                            disabled={deletingId === invitation.id}
                                            className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                        >
                                            {deletingId === invitation.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 
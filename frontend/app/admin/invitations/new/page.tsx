"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface TemplateItem {
    templateName: string;
    imageUrl: string;
    file: string;
}

export default function NewInvitationPage() {
    const [templates, setTemplates] = useState<TemplateItem[]>([]);
    const [templateName, setTemplateName] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [buttonText, setButtonText] = useState("RSVP Now");
    const [formUrl, setFormUrl] = useState("/rsvp");
    const [imageUrl, setImageUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/invitations/templates");
                if (res.ok) {
                    const data = await res.json();
                    setTemplates(data);
                }
            } catch { }
        })();
    }, []);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        try {
            const invitationData: any = { templateName, title, message, buttonText };
            if (imageUrl) invitationData.imageUrl = imageUrl;
            if (formUrl) invitationData.formUrl = formUrl;

            const res = await fetch("/api/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(invitationData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create invitation");
            setSuccess("Invitation created successfully! You can now view and share it from the admin area.");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

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
                            Create Invitation
                        </h1>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6">
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{success}</p>
                                <div className="mt-3 flex space-x-3">
                                    <Link
                                        href="/admin/invitations"
                                        className="text-sm text-green-600 hover:text-green-500 font-medium underline"
                                    >
                                        View All Invitations →
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setSuccess(null);
                                            setTemplateName("");
                                            setTitle("");
                                            setMessage("");
                                            setImageUrl("");
                                        }}
                                        className="text-sm text-green-600 hover:text-green-500 font-medium underline"
                                    >
                                        Create Another
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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

                {/* Visual Template Picker */}
                <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose Your Template</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {templates.map(t => (
                            <button
                                key={t.templateName}
                                type="button"
                                onClick={() => { setTemplateName(t.templateName); setImageUrl(t.imageUrl); }}
                                className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-105 ${templateName === t.templateName
                                    ? 'border-phoenix-sand-500 ring-4 ring-phoenix-sand-200'
                                    : 'border-gray-200 hover:border-phoenix-sand-300'
                                    }`}
                                title={t.templateName}
                            >
                                <img
                                    src={t.imageUrl}
                                    alt={t.templateName}
                                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                                    <div className="text-xs font-medium text-white bg-black/50 rounded px-2 py-1 truncate">
                                        {t.templateName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                                <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-phoenix-sand-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    value={templateName}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setTemplateName(name);
                                        const t = templates.find(t => t.templateName === name);
                                        setImageUrl(t ? t.imageUrl : "");
                                    }}
                                    required
                                >
                                    <option value="">Select a template</option>
                                    {templates.map(t => (
                                        <option key={t.templateName} value={t.templateName}>
                                            {t.templateName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                                <input
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-phoenix-sand-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    value={buttonText}
                                    onChange={e => setButtonText(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {imageUrl && (
                            <div className="bg-white/80 rounded-xl p-4 border border-white/40">
                                <img src={imageUrl} alt="Template" className="w-full rounded-lg shadow-sm" />
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    Using template: {imageUrl.split('/').pop()?.replace('.png', '').replace(/_/g, ' ')}
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-phoenix-sand-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Enter your invitation title..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-phoenix-sand-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                                rows={4}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Enter your invitation message..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Form URL (optional)</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-phoenix-sand-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                value={formUrl}
                                onChange={e => setFormUrl(e.target.value)}
                                placeholder="/rsvp"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty to use the default RSVP form</p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full px-6 py-4 bg-gradient-to-r from-phoenix-sand-500 to-nude-500 hover:from-phoenix-sand-600 hover:to-nude-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {submitting ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Invitation...
                                    </div>
                                ) : (
                                    '✨ Create Beautiful Invitation'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 
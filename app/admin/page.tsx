"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Guest {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    isAttending: boolean;
    numberOfCompanions?: number;
    dietaryRestrictions?: string;
    qrCode: string;
    alphanumericCode: string;
    isVerified: boolean;
    verifiedAt?: string;
    createdAt: string;
    group?: { id: string; name: string } | null;
}

interface Stats {
    total: number;
    attending: number;
    notAttending: number;
}

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

const AdminDashboard: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<'guests' | 'invitations'>('guests');
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
    };

    const shareViaWhatsApp = (invitation: Invitation) => {
        const invitationUrl = `${window.location.origin}/invite/${invitation.id}`;
        const message = `🎉 ${invitation.title}\n\n${invitation.message}\n\nClick here to RSVP: ${invitationUrl}\n\nWe can't wait to celebrate with you! 💕`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
        if (!token) {
            router.replace("/admin/login");
            return;
        }
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const [guestsRes, statsRes, invitationsRes] = await Promise.all([
                    fetch("/api/admin/guests", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("/api/admin/guests/stats", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("/api/invitations", {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);
                
                if (!guestsRes.ok || !statsRes.ok) throw new Error("Failed to fetch data");
                
                setGuests(await guestsRes.json());
                setStats(await statsRes.json());
                
                if (invitationsRes.ok) {
                    setInvitations(await invitationsRes.json());
                }
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('guests')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'guests'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Guests ({guests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('invitations')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'invitations'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Invitations ({invitations.length})
                        </button>
                    </nav>
                </div>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600 mb-4">{error}</div>}
            
            {activeTab === 'guests' && (
                <>
                    {stats && (
                        <div className="mb-6 grid grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-800">Total Guests</h3>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-green-800">Attending</h3>
                                <p className="text-2xl font-bold">{stats.attending}</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-red-800">Not Attending</h3>
                                <p className="text-2xl font-bold">{stats.notAttending}</p>
                            </div>
                        </div>
                    )}
                    <h2 className="text-lg font-semibold mb-2">Guest List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-1">Name</th>
                                    <th className="border px-2 py-1">Email</th>
                                    <th className="border px-2 py-1">Phone</th>
                                    <th className="border px-2 py-1">Attending</th>
                                    <th className="border px-2 py-1">Companions</th>
                                    <th className="border px-2 py-1">QR Code</th>
                                    <th className="border px-2 py-1">Alphanumeric Code</th>
                                    <th className="border px-2 py-1">Verified</th>
                                    <th className="border px-2 py-1">Group</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guests.map((guest) => (
                                    <tr key={guest.id}>
                                        <td className="border px-2 py-1">{guest.firstName} {guest.lastName}</td>
                                        <td className="border px-2 py-1">{guest.email}</td>
                                        <td className="border px-2 py-1">{guest.phoneNumber || "-"}</td>
                                        <td className="border px-2 py-1">{guest.isAttending ? "Yes" : "No"}</td>
                                        <td className="border px-2 py-1">{guest.numberOfCompanions ?? 0}</td>
                                        <td className="border px-2 py-1">
                                            <img src={guest.qrCode} alt="QR Code" width={40} height={40} />
                                        </td>
                                        <td className="border px-2 py-1">{guest.alphanumericCode}</td>
                                        <td className="border px-2 py-1">{guest.isVerified ? "Yes" : "No"}</td>
                                        <td className="border px-2 py-1">{guest.group?.name || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {activeTab === 'invitations' && (
                <>
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Invitations</h2>
                        <button
                            onClick={() => window.location.href = '/admin/invitations/create'}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Create New Invitation
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-1">Title</th>
                                    <th className="border px-2 py-1">Template</th>
                                    <th className="border px-2 py-1">Status</th>
                                    <th className="border px-2 py-1">Created</th>
                                    <th className="border px-2 py-1">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations.map((invitation) => (
                                    <tr key={invitation.id}>
                                        <td className="border px-2 py-1 font-medium">{invitation.title}</td>
                                        <td className="border px-2 py-1">{invitation.templateName}</td>
                                        <td className="border px-2 py-1">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                invitation.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {invitation.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="border px-2 py-1">
                                            {new Date(invitation.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="border px-2 py-1">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => shareViaWhatsApp(invitation)}
                                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                                >
                                                    📱 Share
                                                </button>
                                                <button
                                                    onClick={() => window.open(`/invite/${invitation.id}`, '_blank')}
                                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                                >
                                                    👁️ View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard; 
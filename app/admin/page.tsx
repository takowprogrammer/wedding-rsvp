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

const AdminDashboard: React.FC = () => {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
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
                const guestsRes = await fetch("/api/admin/guests", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const statsRes = await fetch("/api/admin/guests/stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!guestsRes.ok || !statsRes.ok) throw new Error("Failed to fetch data");
                setGuests(await guestsRes.json());
                setStats(await statsRes.json());
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
            {loading && <div>Loading...</div>}
            {error && <div className="text-red-600 mb-4">{error}</div>}
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
        </div>
    );
};

export default AdminDashboard; 
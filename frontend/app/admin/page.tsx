'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  isAttending: boolean;
  numberOfCompanions?: number;
  dietaryRestrictions?: string;
  qrCode?: { alphanumericCode: string };
  isVerified: boolean;
  verifiedAt?: string;
  createdAt: string;
  group?: { id: string; name: string } | null;
}

interface GuestGroup { id: string; name: string }

interface ExtendedStats {
  attendance: {
    confirmed: number;
    checkedIn: number;
    noShows: number;
    showRate: number;
    checkinTimeline: { hour: string; count: number }[];
    totalExpectedGuests: number;
  };
  qr: {
    codesGenerated: number;
    codesUsed: number;
    scanSuccess: number;
    scanFailures: number;
    scanByMethod: { manual: number; scan: number };
  };
  communication: {
    thankYouSent: number;
    emailFailures: number;
  };
}

const AdminDashboard: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [groups, setGroups] = useState<GuestGroup[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string>('');
  const [extended, setExtended] = useState<ExtendedStats | null>(null);
  const defaultEventDate = process.env.NEXT_PUBLIC_WEDDING_DATE as string | undefined;
  const [eventDate, setEventDate] = useState<string>(defaultEventDate || "");

  useEffect(() => {
    (async () => {
      try {
        const [guestsRes, groupsRes] = await Promise.all([
          fetch("/api/admin/guests/all"),
          fetch("/api/guest-groups"),
        ]);
        if (guestsRes.ok) {
          const data = await guestsRes.json();
          setGuests(data);
        }
        if (groupsRes.ok) setGroups(await groupsRes.json());
      } catch { }
    })();
  }, []);

  useEffect(() => {
    if (!activeGroupId) {
      setFilteredGuests(guests);
    } else {
      setFilteredGuests(guests.filter(g => g.group?.id === activeGroupId));
    }
  }, [guests, activeGroupId]);

  useEffect(() => {
    (async () => {
      try {
        const url = eventDate ? `/api/admin/guests/stats/extended?eventDate=${encodeURIComponent(eventDate)}` : '/api/admin/guests/stats/extended';
        const res = await fetch(url);
        if (res.ok) setExtended(await res.json());
      } catch { }
    })();
  }, [eventDate]);

  // simple bar chart for timeline
  const TimelineChart: React.FC<{ data: { hour: string; count: number }[] }> = ({ data }) => {
    const max = Math.max(1, ...data.map(d => d.count));
    const barWidth = 14;
    const gap = 6;
    const height = 120;
    const width = data.length * (barWidth + gap);
    return (
      <svg width={width} height={height} className="overflow-visible">
        {data.map((d, i) => {
          const h = Math.round((d.count / max) * (height - 20));
          const x = i * (barWidth + gap);
          const y = height - h;
          return (
            <g key={d.hour}>
              <rect x={x} y={y} width={barWidth} height={h} rx={3} className="fill-[#8fb5d9]" />
              {i % 3 === 0 && (
                <text x={x + barWidth / 2} y={height + 12} textAnchor="middle" className="fill-gray-500 text-[10px]">{d.hour}</text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e9e2] via-[#f6d7b0] to-[#ccd8e4]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-700 mt-2">Manage guests, invitations, and check-ins with ease</p>
          </div>
        </div>
        <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/40 blur-2xl" />
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Controls */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 mb-6 border border-white/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700">Filter by group</label>
              <select
                value={activeGroupId}
                onChange={(e) => setActiveGroupId(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">All</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700">Event date</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="text-sm border rounded-lg px-3 py-2 bg-white" />
              <button
                onClick={async () => { try { await fetch('/api/admin/thank-you', { method: 'POST' }); } catch { } }}
                className="px-4 py-2 rounded-lg bg-[#a6d0b8] text-gray-900 font-medium shadow hover:shadow-md transition"
                title="Send thank-you emails to all checked-in guests who haven't received it yet"
              >
                Send Thank You
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 mb-6 border border-white/40">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/invitations"
              className="flex items-center p-4 bg-gradient-to-r from-phoenix-sand-50 to-nude-50 hover:from-phoenix-sand-100 hover:to-nude-100 rounded-xl border border-phoenix-sand-200 transition-all duration-200 group"
            >
              <div className="p-2 bg-phoenix-sand-100 rounded-lg group-hover:bg-phoenix-sand-200 transition-colors">
                <svg className="w-6 h-6 text-phoenix-sand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Manage Invitations</h4>
                <p className="text-sm text-gray-500">Create and manage wedding invitations</p>
              </div>
            </Link>

            <Link
              href="/admin/invitations/new"
              className="flex items-center p-4 bg-gradient-to-r from-dusty-blue-50 to-phoenix-sand-50 hover:from-dusty-blue-100 hover:to-phoenix-sand-100 rounded-xl border border-dusty-blue-200 transition-all duration-200 group"
            >
              <div className="p-2 bg-dusty-blue-100 rounded-lg group-hover:bg-dusty-blue-200 transition-colors">
                <svg className="w-6 h-6 text-dusty-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Create Invitation</h4>
                <p className="text-sm text-gray-500">Design a new beautiful invitation</p>
              </div>
            </Link>

            <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">Send Thank You</h4>
                <p className="text-sm text-gray-500">Send thank-you emails to guests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Extended Stats */}
        {extended && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 border border-white/40">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Attendance</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <div>Confirmed: {extended.attendance.confirmed}</div>
                <div>Checked In: {extended.attendance.checkedIn}</div>
                <div>No-shows: {extended.attendance.noShows}</div>
                <div>Show Rate: {extended.attendance.showRate}%</div>
                <div>Expected Guests: {extended.attendance.totalExpectedGuests}</div>
              </div>
              {extended.attendance.checkinTimeline?.length > 0 && (
                <div className="mt-4">
                  <TimelineChart data={extended.attendance.checkinTimeline} />
                </div>
              )}
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 border border-white/40">
              <h3 className="text-sm font-medium text-gray-700 mb-2">QR Codes</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <div>Generated: {extended.qr.codesGenerated}</div>
                <div>Used: {extended.qr.codesUsed}</div>
                <div>Success: {extended.qr.scanSuccess} / Failures: {extended.qr.scanFailures}</div>
                <div>By Method: Manual {extended.qr.scanByMethod.manual}, Scan {extended.qr.scanByMethod.scan}</div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 border border-white/40">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Communication</h3>
              <div className="text-sm text-gray-800 space-y-1">
                <div>Thank-you sent: {extended.communication.thankYouSent}</div>
                <div>Email failures: {extended.communication.emailFailures}</div>
              </div>
            </div>
          </div>
        )}

        {/* Guest List */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-6 border border-white/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Guest List</h2>
            <span className="text-sm text-gray-500">{filteredGuests.length} guests</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="border px-3 py-2 text-left text-sm text-gray-600">Name</th>
                  <th className="border px-3 py-2 text-left text-sm text-gray-600">Email</th>
                  <th className="border px-3 py-2 text-left text-sm text-gray-600">Group</th>
                  <th className="border px-3 py-2 text-left text-sm text-gray-600">QR Code</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr key={guest.id} className="odd:bg-white even:bg-gray-50/60">
                    <td className="border px-3 py-2">{guest.firstName} {guest.lastName}</td>
                    <td className="border px-3 py-2">{guest.email}</td>
                    <td className="border px-3 py-2">{guest.group?.name || '-'}</td>
                    <td className="border px-3 py-2">{guest.qrCode?.alphanumericCode || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
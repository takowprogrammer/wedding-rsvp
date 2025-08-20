'use client';

import { useState, useEffect } from 'react';

// Define interfaces for the data structures
interface GuestGroup {
    id: string;
    name: string;
}

interface Guest {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    numberOfGuests: number;
    status: string;
    checkedIn: boolean;
    createdAt: string;
    group?: GuestGroup;
}

export default function AdminGuestsPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [groups, setGroups] = useState<GuestGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch guests and groups
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch groups for the filter dropdown
                const groupsRes = await fetch('/api/guest-groups');
                if (!groupsRes.ok) throw new Error('Failed to fetch guest groups');
                const groupsData = await groupsRes.json();
                console.log('Groups data:', groupsData);
                setGroups(groupsData);
        
                // Fetch guests, optionally filtering by the selected group
                const guestUrl = new URL('/guests/admin', window.location.origin);
                if (selectedGroup) {
                    guestUrl.searchParams.append('groupId', selectedGroup);
                }
                const guestsRes = await fetch(guestUrl.toString());
                if (!guestsRes.ok) throw new Error('Failed to fetch guests');
                const guestsData = await guestsRes.json();
                console.log('Guests data:', guestsData);
                setGuests(guestsData);
        
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedGroup]); // Refetch data when the selectedGroup changes

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Guest List</h1>
                    <p className="text-gray-600 mt-1">View and filter all RSVPs.</p>
                </div>

                {/* Filter Controls */}
                <div className="mb-6 flex items-center space-x-4">
                    <label htmlFor="group-filter" className="font-medium text-gray-700">Filter by Group:</label>
                    <select
                        id="group-filter"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="block w-64 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">All Groups</option>
                        {groups.map(group => (
                            <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                    </select>
                </div>

                {/* Data Table */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <p className="p-6 text-center text-gray-500">Loading guests...</p>
                        ) : error ? (
                            <p className="p-6 text-center text-red-500">{error}</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {guests.length > 0 ? guests.map(guest => (
                                        <tr key={guest.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guest.firstName} {guest.lastName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.email}<br />{guest.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.group?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{guest.numberOfGuests}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${guest.checkedIn ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {guest.checkedIn ? 'Checked-In' : guest.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(guest.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No guests found for the selected filter.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

// Define interfaces for the data structures
interface GuestGroup {
    id: string;
    name: string;
}

interface QrCode {
    alphanumericCode: string;
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
    qrCode?: QrCode;
}

export default function AdminGuestsPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [groups, setGroups] = useState<GuestGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch groups for the filter dropdown
            const groupsData = await api.get('/api/guest-groups');
            setGroups(groupsData);

            // Fetch guests
            const guestUrl = new URL('/api/admin/guests', window.location.origin);
            guestUrl.searchParams.append('page', currentPage.toString());
            guestUrl.searchParams.append('limit', pageSize.toString());
            if (selectedGroup) {
                guestUrl.searchParams.append('groupId', selectedGroup);
            }
            if (searchTerm) {
                guestUrl.searchParams.append('search', searchTerm);
            }

            const guestsData = await api.get(guestUrl.toString());

            setGuests(guestsData.guests);
            setTotalPages(Math.ceil(guestsData.total / pageSize));

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, selectedGroup, searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchData();
        }, 500); // Debounce search input

        return () => {
            clearTimeout(handler);
        };
    }, [fetchData]);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleDelete = async (guestId: string) => {
        if (window.confirm('Are you sure you want to delete this guest?')) {
            try {
                await api.delete(`/api/admin/guests/${guestId}`);
                // Refetch guests after deletion
                fetchData();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Guest List</h1>
                    <p className="text-gray-600 mt-1">View, filter, and search all RSVPs.</p>
                </div>

                {/* Filter and Search Controls */}
                <div className="mb-6 flex items-center space-x-4">
                    <div className="flex-1">
                        <label htmlFor="search" className="sr-only">Search</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="group-filter" className="font-medium text-gray-700 sr-only">Filter by Group:</label>
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
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSVP Date</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {guests.length > 0 ? guests.map(guest => (
                                        <tr key={guest.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guest.firstName} {guest.lastName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.email}<br />{guest.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.group?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.qrCode?.alphanumericCode || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${guest.checkedIn ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {guest.checkedIn ? 'Checked-In' : guest.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(guest.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleDelete(guest.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No guests found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {/* Pagination Controls */}
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

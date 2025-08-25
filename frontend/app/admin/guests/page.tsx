'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { logout, getAuthToken } from '@/lib/auth';

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

    // Debug logging for component state
    console.log('Component render state:', {
        guests: guests.length,
        groups: groups.length,
        selectedGroup,
        searchTerm,
        isLoading,
        error,
        currentPage,
        totalPages
    });

    // Check token expiration and warn user
    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                const timeUntilExpiry = payload.exp - currentTime;

                // Warn user 5 minutes before expiry
                if (timeUntilExpiry <= 300 && timeUntilExpiry > 0) {
                    const minutes = Math.ceil(timeUntilExpiry / 60);
                    alert(`⚠️ Your session will expire in ${minutes} minute(s). Please save your work.`);
                }

                // Auto-logout when expired
                if (timeUntilExpiry <= 0) {
                    alert('🔒 Your session has expired. You will be redirected to login.');
                    logout();
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
            }
        }
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(''); // Clear previous errors
        try {
            console.log('Fetching data with params:', { currentPage, pageSize, selectedGroup, searchTerm });

            // Fetch groups for the filter dropdown
            const groupsData = await api.get('/api/guest-groups');
            setGroups(groupsData);

            // Fetch guests
            const guestUrl = new URL('/api/admin/guests', window.location.origin);
            guestUrl.searchParams.append('page', currentPage.toString());
            guestUrl.searchParams.append('limit', pageSize.toString());
            if (selectedGroup && selectedGroup.trim() !== '') {
                guestUrl.searchParams.append('groupId', selectedGroup);
            }
            if (searchTerm && searchTerm.trim() !== '') {
                guestUrl.searchParams.append('search', searchTerm);
            }

            console.log('Fetching guests from:', guestUrl.toString());
            const guestsData = await api.get(guestUrl.toString());
            console.log('Guests data received:', guestsData);
            console.log('Guests array:', guestsData.guests);
            console.log('Total count:', guestsData.total);

            setGuests(guestsData.guests || []);
            setTotalPages(Math.ceil((guestsData.total || 0) / pageSize));

            console.log('State updated - Guests:', guestsData.guests?.length || 0, 'Total pages:', Math.ceil((guestsData.total || 0) / pageSize));

        } catch (err) {
            console.error('Error fetching data:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`Failed to fetch data: ${errorMessage}`);
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
    }, [currentPage, pageSize, selectedGroup, searchTerm]); // Only depend on the actual values, not fetchData

    // Initial data fetch when component mounts
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent">Wedding Guest List</h1>
                            <p className="text-gray-600 mt-1">View, filter, and search all RSVPs for Doris & Emmanuel's special day.</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <a
                                href="/admin"
                                className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-md hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            >
                                ← Back to Dashboard
                            </a>
                            <a
                                href="/"
                                className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-md hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                            >
                                🏠 Wedding Home
                            </a>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
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
                            className="block w-full px-4 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="group-filter" className="font-medium text-gray-700 sr-only">Filter by Group:</label>
                        <select
                            id="group-filter"
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            className="block w-64 px-3 py-2 border border-amber-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                        >
                            <option value="">All Groups</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-amber-200">
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <p className="p-6 text-center text-gray-500">Loading guests...</p>
                        ) : error ? (
                            <p className="p-6 text-center text-red-500">{error}</p>
                        ) : (
                            <table className="min-w-full divide-y divide-amber-200">
                                <thead className="bg-gradient-to-r from-amber-50 to-blue-50">
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
                                <tbody className="bg-white divide-y divide-amber-200">
                                    {guests.length > 0 ? guests.map(guest => (
                                        <tr key={guest.id} className="hover:bg-amber-50/50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guest.firstName} {guest.lastName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.email}<br />{guest.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guest.group?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{guest.qrCode?.alphanumericCode || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${guest.checkedIn ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
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
                    <div className="px-6 py-4 border-t border-amber-200 flex items-center justify-between bg-gradient-to-r from-amber-50 to-blue-50">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-md hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

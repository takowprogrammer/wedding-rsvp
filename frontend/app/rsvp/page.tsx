'use client';

import { useState, useEffect } from 'react';

interface RSVPFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberOfGuests: number;
  dietaryRestrictions: string;
  specialRequests: string;
  groupId?: string;
}

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  numberOfGuests: number;
}

interface RSVPResponse {
  guest: Guest;
  qrCode: {
    alphanumericCode: string;
    qrCodeImage: string;
  };
}

interface GuestGroup { id: string; name: string }

export default function RSVPPage() {
  const [formData, setFormData] = useState<RSVPFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    numberOfGuests: 1,
    dietaryRestrictions: '',
    specialRequests: '',
    groupId: undefined,
  });
  const [groups, setGroups] = useState<GuestGroup[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<RSVPResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        console.log('Fetching guest groups...');
        const res = await fetch('/api/guest-groups');
        console.log('Guest groups response status:', res.status);
        if (res.ok) {
          const groupsData = await res.json();
          console.log('Guest groups data:', groupsData);
          setGroups(groupsData);
        } else {
          console.error('Failed to fetch guest groups:', res.status);
        }
      } catch (error) {
        console.error('Error fetching guest groups:', error);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit RSVP');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('RSVP submission error:', err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfGuests' ? parseInt(value) : value
    }));
  };

  if (response) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">RSVP Confirmed!</h2>
            <p className="text-gray-600">Thank you for confirming your attendance</p>
            <p className="text-sm text-gray-500 mt-2">
              A copy of the QR code and backup alphanumeric code has been sent to <strong>{response.guest.email}</strong>.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-semibold text-yellow-800">Important</span>
            </div>
            <p className="text-sm text-yellow-700">
              Please save these codes carefully. You'll need them to enter the wedding venue on the big day!
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Your Entry Details</h3>

            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={response.qrCode.qrCodeImage}
                alt="QR Code for wedding entry"
                className="w-32 h-32 mx-auto border-2 border-gray-200 rounded-lg"
              />
              <div className="mt-3 flex justify-center space-x-2">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = response.qrCode.qrCodeImage;
                    link.download = `wedding-qr-${response.guest.firstName}-${response.guest.lastName}.png`;
                    link.click();
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  📥 Download QR Code
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 mb-1">Entry Code</p>
              <p className="text-xl font-mono font-bold text-gray-800 tracking-wider">
                {response.qrCode.alphanumericCode}
              </p>
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => {
                    const text = `Wedding Entry Code for ${response.guest.firstName} ${response.guest.lastName}: ${response.qrCode.alphanumericCode}`;
                    const blob = new Blob([text], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `wedding-code-${response.guest.firstName}-${response.guest.lastName}.txt`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  📄 Download Code
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>How to use:</strong> Present either the QR code (scan) or the alphanumeric code (manual entry) at the wedding entrance.
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>Guest: {response.guest.firstName} {response.guest.lastName}</p>
            <p>Number of Guests: {response.guest.numberOfGuests}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Wedding RSVP</h1>
          <p className="text-gray-600">Please confirm your attendance</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                required
                disabled={isSubmitting}
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                required
                disabled={isSubmitting}
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              disabled={isSubmitting}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              disabled={isSubmitting}
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests *
            </label>
            <select
              name="numberOfGuests"
              required
              disabled={isSubmitting}
              value={formData.numberOfGuests}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Guest Group (optional)
            </label>
            <select
              name="groupId"
              disabled={isSubmitting}
              value={formData.groupId || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a group</option>
              {groups.length > 0 ? (
                groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))
              ) : (
                <option value="" disabled>No groups available</option>
              )}
            </select>
            {groups.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No guest groups have been created yet.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Restrictions
            </label>
            <textarea
              name="dietaryRestrictions"
              disabled={isSubmitting}
              value={formData.dietaryRestrictions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Please let us know about any dietary restrictions..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to couple
            </label>
            <textarea
              name="specialRequests"
              disabled={isSubmitting}
              value={formData.specialRequests}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              placeholder="Share a special message or note for the couple..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              'Confirm RSVP'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
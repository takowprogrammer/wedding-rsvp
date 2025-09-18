"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

const InvitationPage: React.FC = () => {
  const params = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`/api/invitations/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Invitation not found");
          } else {
            setError("Failed to load invitation");
          }
          return;
        }
        const data = await res.json();
        setInvitation(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInvitation();
    }
  }, [params.id]);

  const handleRSVP = () => {
    if (invitation?.formUrl) {
      window.open(invitation.formUrl, '_blank');
    } else {
      // Default RSVP form
      window.location.href = '/rsvp';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invitation Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">Go to Home</a>
        </div>
      </div>
    );
  }

  if (!invitation.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Invitation Inactive</h1>
          <p className="text-gray-600">This invitation is no longer active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-2">{invitation.title}</h1>
            <p className="text-lg opacity-90">You're Invited!</p>
          </div>

          {/* Image */}
          {invitation.imageUrl && (
            <div className="relative">
              <img 
                src={invitation.imageUrl} 
                alt={invitation.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {invitation.message}
              </p>
            </div>

            {/* RSVP Button */}
            <div className="text-center">
              <button
                onClick={handleRSVP}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {invitation.buttonText}
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>We can't wait to celebrate with you! 💕</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;

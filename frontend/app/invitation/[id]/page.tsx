'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Invitation {
  id: string;
  templateName: string;
  title: string;
  message: string;
  imageUrl?: string;
  buttonText: string;
  formUrl: string;
}

export default function InvitationPage() {
  const params = useParams();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (params.id) {
      fetchInvitation(params.id as string);
    }
  }, [params.id]);

  const fetchInvitation = async (id: string) => {
    try {
      const response = await fetch(`/api/invitations/${id}`);
      if (!response.ok) {
        throw new Error('Invitation not found');
      }
      const data = await response.json();
      setInvitation(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invitation Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The invitation you&apos;re looking for doesn&apos;t exist.'}</p>
          <Link 
            href="/"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Decorative Border */}
        <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-600"></div>
        
        {/* Image */}
        {invitation.imageUrl && (
          <div className="relative h-64 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={invitation.imageUrl} 
              alt="Wedding Invitation" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {invitation.title}
          </h1>
          
          <div className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-line">
            {invitation.message}
          </div>
          
          <Link 
            href={invitation.formUrl}
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {invitation.buttonText}
          </Link>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              We can&apos;t wait to celebrate with you! ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
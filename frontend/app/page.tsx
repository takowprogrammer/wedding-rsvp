"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const slides = [
    "/invitations/Doris_Emmanuel_Wedding_Vintage_Ornate.png",
    "/invitations/wedding_invitation_improved_1.png",
    "/invitations/wedding_invitation_improved_3.png",
    "/invitations/wedding_invitation_improved_4.png",
    "/invitations/invitation-template-1.png",
    "/invitations/invitation-template-2.png",
    "/invitations/invitation-template-3.png",
    "/invitations/invitation-template-4.png",
    "/invitations/elegant_floral_invitation.png",
    "/invitations/modern_minimalist_invitation.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-amber-100">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-200/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-blue-600 bg-clip-text text-transparent"
              >
                Doris & Emmanuel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/admin/login"
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
                onClick={() => console.log('Login button clicked')}
              >
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden pt-20">
        {/* Slideshow images */}
        {slides.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === current ? "opacity-100" : "opacity-0"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Wedding invitation background"
              className="w-full h-full object-contain bg-gradient-to-br from-amber-50 via-blue-50 to-amber-100"
            />
            {/* Enhanced overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white/80" />
          </div>
        ))}

        {/* Slideshow Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === current
                ? 'bg-white shadow-lg scale-125'
                : 'bg-white/50 hover:bg-white/75'
                }`}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 py-24">
          <div className="max-w-4xl mx-auto">
            {/* Slideshow Counter */}
            <div className="absolute top-8 right-8 text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {current + 1} / {slides.length}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-light text-amber-700 mb-2">
                Join Us in Celebrating
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-800 tracking-tight mb-2 drop-shadow-lg">
                Doris & Emmanuel
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-blue-400 mx-auto mb-4"></div>
              <p className="text-xl md:text-2xl text-gray-600 font-medium">
                A Love Story Unfolding
              </p>
            </div>

            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed drop-shadow-sm mb-8">
              Welcome to our wedding celebration! We're excited to share this special day with you.
              Check out our event program and stay tuned for your personalized invitation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="/program"
                className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-500 to-blue-500 hover:from-amber-600 hover:to-blue-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => console.log('Program button clicked')}
              >
                📅 View Event Program
              </a>
              <a
                href="/admin/login"
                className="px-8 py-4 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-200 hover:border-amber-300 cursor-pointer"
                onClick={() => console.log('Admin access button clicked')}
              >
                🔐 Admin Access
              </a>
            </div>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="pointer-events-none absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute bottom-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Wedding Details Section */}
      <div className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Love Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every love story is beautiful, but ours is our favorite. Join us as we celebrate the beginning of forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-amber-100 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-3xl">💕</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">The Beginning</h3>
              <p className="text-gray-600 leading-relaxed">
                From the first moment we met, we knew our lives would never be the same. Every day since has been a beautiful adventure.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-blue-100 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-3xl">💍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">The Proposal</h3>
              <p className="text-gray-600 leading-relaxed">
                The moment that changed everything. When Emmanuel got down on one knee, our future together became crystal clear.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="p-4 bg-amber-100 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">The Celebration</h3>
              <p className="text-gray-600 leading-relaxed">
                Now we're counting down the days until we can celebrate our love with all the people who mean the most to us.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Anticipation Section */}
      <div className="py-24 bg-gradient-to-r from-amber-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8">
            The Countdown Begins
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We can hardly contain our excitement for what promises to be the most magical day of our lives.
            The anticipation of saying "I do" in front of our closest family and friends fills our hearts with pure joy.
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200">
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-amber-600">Doris:</span> "I can't wait to see Emmanuel's face when I walk down the aisle.
              Every moment of planning has been worth it."
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold text-blue-600">Emmanuel:</span> "The thought of marrying Doris makes my heart skip a beat.
              Our wedding day will be absolutely perfect."
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-amber-500 via-blue-500 to-amber-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Can't Wait to Celebrate With You!
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Check out our event program and look forward to receiving your personalized invitation soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/program"
              className="px-10 py-4 rounded-full bg-white text-amber-600 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => console.log('CTA Program button clicked')}
            >
              View Event Program
            </Link>
            <Link
              href="/admin/login"
              className="px-8 py-4 rounded-full bg-transparent text-white font-semibold text-lg border-2 border-white hover:bg-white hover:text-amber-600 transition-all duration-300 cursor-pointer"
              onClick={() => console.log('CTA Admin button clicked')}
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent mb-4">
                Doris & Emmanuel
              </h3>
              <p className="text-gray-400">
                Creating beautiful memories together, one invitation at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Wedding Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/admin/login" className="hover:text-white transition-colors cursor-pointer">Admin Login</Link></li>
                <li><Link href="/program" className="hover:text-white transition-colors cursor-pointer">Event Program</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors cursor-pointer">Homepage</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Get Started</h4>
              <Link
                href="/program"
                className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-blue-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-blue-600 transition-all duration-200 cursor-pointer"
              >
                View Program
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Doris & Emmanuel Wedding. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
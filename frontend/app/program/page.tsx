"use client";
import Link from "next/link";

export default function ProgramPage() {
  const programEvents = [
    {
      time: "2:00 PM",
      title: "Guest Arrival & Welcome",
      description: "Welcome drinks and light refreshments as guests arrive",
      icon: "🥂",
      color: "amber"
    },
    {
      time: "2:30 PM",
      title: "Ceremony Begins",
      description: "The beautiful ceremony where two hearts become one",
      icon: "💒",
      color: "blue"
    },
    {
      time: "3:30 PM",
      title: "Cocktail Hour",
      description: "Celebrate with drinks and appetizers",
      icon: "🍸",
      color: "amber"
    },
    {
      time: "4:30 PM",
      title: "Reception & Dinner",
      description: "Enjoy a delicious meal and celebrate together",
      icon: "🍽️",
      color: "blue"
    },
    {
      time: "6:00 PM",
      title: "First Dance",
      description: "Doris & Emmanuel's first dance as newlyweds",
      icon: "💃",
      color: "amber"
    },
    {
      time: "6:30 PM",
      title: "Dancing & Celebration",
      description: "Let's dance the night away!",
      icon: "🎵",
      color: "blue"
    },
    {
      time: "9:00 PM",
      title: "Farewell",
      description: "Thank you for being part of our special day",
      icon: "👋",
      color: "amber"
    }
  ];

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
              <Link
                href="/admin/login"
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-amber-100 hover:text-amber-800 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Wedding Day Program
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join us for a day filled with love, laughter, and beautiful memories
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-blue-400 mx-auto mb-8"></div>
        </div>
      </div>

      {/* Program Timeline */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="space-y-8">
          {programEvents.map((event, index) => (
            <div key={index} className="relative">
              {/* Timeline line */}
              {index < programEvents.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-amber-300 to-blue-300"></div>
              )}

              <div className="flex items-start space-x-6">
                {/* Time */}
                <div className="w-20 text-right pt-2">
                  <span className="text-lg font-semibold text-gray-700">{event.time}</span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg ${event.color === 'amber'
                    ? 'bg-amber-100 border-2 border-amber-300'
                    : 'bg-blue-100 border-2 border-blue-300'
                  }`}>
                  {event.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white/50 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-amber-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">📍 Venue Details</h3>
              <p className="text-gray-600 mb-4">
                <strong>Location:</strong> [Venue Name]<br />
                <strong>Address:</strong> [Full Address]<br />
                <strong>Date:</strong> [Wedding Date]
              </p>
              <p className="text-gray-600">
                Please arrive 15 minutes before the ceremony start time.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">💝 What to Expect</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Beautiful ceremony in an intimate setting</li>
                <li>• Delicious dinner and drinks</li>
                <li>• Live music and dancing</li>
                <li>• Photo opportunities throughout the day</li>
                <li>• Special moments to remember forever</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-amber-500 via-blue-500 to-amber-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Can't Wait to Celebrate With You!
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            RSVP now to confirm your attendance and be part of our special day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 rounded-full bg-white text-amber-600 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Back to Home
            </Link>
            <Link
              href="/admin/login"
              className="px-8 py-3 rounded-full bg-transparent text-white font-semibold text-lg border-2 border-white hover:bg-white hover:text-amber-600 transition-all duration-300"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400">&copy; 2025 Doris & Emmanuel Wedding. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState } from 'react';

interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  numberOfGuests: number;
}

interface ScanResult {
  success: boolean;
  guest?: Guest;
  message: string;
  used?: boolean;
}

export default function ScannerPage() {
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    setIsProcessing(true);
    setScanResult(null);

    try {
      const response = await fetch('/api/qr-codes/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: manualCode.trim().toUpperCase() }),
      });

      const data = await response.json();
      setScanResult(data);
      
      if (data.success) {
        setManualCode('');
      }
    } catch {
      setScanResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyOnly = async () => {
    if (!manualCode.trim()) return;

    setIsProcessing(true);
    setScanResult(null);

    try {
      const response = await fetch('/api/qr-codes/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: manualCode.trim().toUpperCase() }),
      });

      const data = await response.json();
      setScanResult({
        success: data.valid,
        guest: data.guest,
        message: data.valid ? 'Valid code - ready to check in' : 'Invalid code',
        used: data.used
      });
    } catch {
      setScanResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResult = () => {
    setScanResult(null);
    setManualCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Wedding Check-In</h1>
          <p className="text-gray-600 mt-2">Scan QR codes or enter codes manually</p>
        </div>

        {/* Manual Entry Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Manual Entry</h2>
          
          <form onSubmit={handleManualEntry} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 8-digit code
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="ABC12345"
                maxLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleVerifyOnly}
                disabled={isProcessing || !manualCode.trim()}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Verifying...' : 'Verify Only'}
              </button>
              
              <button
                type="submit"
                disabled={isProcessing || !manualCode.trim()}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Check In'}
              </button>
            </div>
          </form>
        </div>

        {/* QR Scanner Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">QR Code Scanner</h2>
          
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <p className="text-gray-500 text-sm">QR Scanner</p>
              <p className="text-gray-400 text-xs mt-1">Camera access required</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => setIsScanning(!isScanning)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            {isScanning ? 'Stop Scanner' : 'Start Scanner'}
          </button>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Note: QR scanner requires camera permissions and HTTPS
          </p>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className={`rounded-2xl shadow-lg p-6 ${
            scanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  scanResult.success ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {scanResult.success ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <h3 className={`ml-3 font-semibold ${
                  scanResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {scanResult.success ? 'Success!' : 'Error'}
                </h3>
              </div>
              
              <button
                type="button"
                onClick={clearResult}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Clear result"
                title="Clear result"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className={`text-sm mb-4 ${
              scanResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {scanResult.message}
            </p>
            
            {scanResult.guest && (
              <div className="bg-white rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Guest:</span>
                  <span className="text-sm font-medium">
                    {scanResult.guest.firstName} {scanResult.guest.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm">{scanResult.guest.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Guests:</span>
                  <span className="text-sm">{scanResult.guest.numberOfGuests}</span>
                </div>
                {scanResult.used && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm text-orange-600 font-medium">Already used</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Instructions</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Scan the guest&apos;s QR code or ask for their 8-digit code
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Use &quot;Verify Only&quot; to check validity without checking in
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Use &quot;Check In&quot; to mark the guest as arrived
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Each code can only be used once for check-in
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
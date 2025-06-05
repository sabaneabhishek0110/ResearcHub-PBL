import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';

  const BASE_URL = "https://researchub-pbl.onrender.com"  

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json(); // Parse response

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      if (data.message === 'Email verified successfully') {
        navigate('/dashboard', { 
          state: { 
            success: 'Email verified successfully!',
            token: data.token // Assuming backend returns token
          } 
        });
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      alert('New OTP sent!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white px-4">
      <div className="bg-[#0f172a] p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-blue-700">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-400">Verify Your Email</h2>

        {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-blue-100 mb-1">
              Enter 6-digit OTP sent to <span className="font-semibold text-blue-300">{email}</span>
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2 border border-blue-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
              placeholder="123456"
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200 text-white 
              ${isLoading || otp.length !== 6 
                ? 'bg-blue-800 cursor-not-allowed opacity-60' 
                : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button 
            onClick={handleResendOTP}
            className="text-blue-400 hover:underline hover:text-blue-300 transition"
            type="button"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>

  );
};

export default OTPVerification;
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/users/verify-otp', {
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
      const response = await fetch('http://localhost:5000/api/users/resend-otp', {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter 6-digit OTP sent to {email}
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456"
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className={`w-full py-2 px-4 rounded-md text-white ${isLoading || otp.length !== 6 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={handleResendOTP}
            className="text-blue-600 hover:underline focus:outline-none"
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
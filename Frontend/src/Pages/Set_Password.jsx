import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function SetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email"); // Get email from URL
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const BASE_URL ="https://researchub-pbl.onrender.com"

    const handleSetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError("Both password fields are required.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/users/set-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, password: newPassword })
            });

            if (!response.ok) {
                throw new Error("Failed to set password");
            }
            console.log("djkfhjdhfjdhfj")
            setSuccess(true);
            setError("");

            setTimeout(() => {
              if(token){
                navigate(`/dashboard?token=${token}`);
              }
              else{
                navigate("/AuthPage?error=token-missing");
              }
            }, 2000);
        } catch (error) {
            setError("Error setting password. Please try again.");
        }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#1e40af] px-4">
        <div className="bg-[#1e293b] p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-md text-white transition-all duration-300">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Set Your Password</h2>

          <p className="text-blue-200 mb-6 text-center text-sm">
            Email: <span className="text-blue-100 font-medium">{email}</span>
          </p>

          <input
            type="password"
            className="w-full p-3 mb-4 rounded-lg bg-[#334155] text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 mb-4 rounded-lg bg-[#334155] text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm mb-3 text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-3 text-center">Password set successfully! Redirecting...</p>}

          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2.5 rounded-lg transition duration-300 shadow-lg"
            onClick={handleSetPassword}
          >
            Submit
          </button>
        </div>
      </div>
    );
}

export default SetPassword;

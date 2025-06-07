import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { Lock, Mail, User as UserIcon } from 'lucide-react';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();
    
    const BASE_URL = "https://researchub-pbl.onrender.com";

    useEffect(() => {

        //This is for BrowerRouter
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if(token){
            handleGoogleResponse(token);
        }
        
        // const hash = window.location.hash;
        // const search = window.location.search;

        // // Case 1: Token in hash (HashRouter)
        // const hashTokenMatch = hash.match(/token=([^&]*)/);
        
        // // Case 2: Token in search (might happen during redirect)
        // const searchTokenMatch = search.match(/token=([^&]*)/);
        
        // const token = (hashTokenMatch && hashTokenMatch[1]) || 
        //             (searchTokenMatch && searchTokenMatch[1]);

        // if (token) {
        //     handleGoogleResponse(token);
        // }

        // if(localStorage.getItem('token')){
        //     navigate('/dashboard');
        // }
    }, []);

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                toast.error("Please enter email and password");
                return;
            }
            const response = await fetch(`${BASE_URL}/api/users/getParticularUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!data.token) {
                console.log("Token is not created");
                return;
            }

            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
                toast.success("You are logged in!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error in logging in ", error);
        }
    };

    const handleSignup = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/users/createUser`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();

            if (!data.token) {
                console.log("Token is not created");
                return;
            }

            if (response.ok) {
                localStorage.setItem("token", data.token);
                navigate("/verify-otp", { state: { email } });
                toast.success("OTP sent to your email!");
            } else {
                toast.success(data.error);
            }
        } catch (error) {
            console.error("Error in Signup ", error);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${BASE_URL}/api/users/google`;
    };

    const handleGoogleResponse = async (token) => {
        if (token) {
            localStorage.setItem("token", token);
            console.log("token at frontend : ",localStorage.getItem("token"));
            navigate('/dashboard');
            window.location.reload(); // Ensure proper state update
            window.location.href = '/dashboard';
        } else {
            console.error("Google Login Failed");
            toast.error("Google login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-600 rounded-lg mb-6 hover:bg-gray-700 transition-colors text-white"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute inset-0 translate-y-2 border-t border-gray-600"></div>
                        <span className="relative bg-gray-800 px-4 text-sm text-gray-400">or continue with email</span>
                    </div>

                    {/* Form */}
                    {isSignUp && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <button
                        onClick={isSignUp ? handleSignup : handleLogin}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>

                    <div className="mt-4 text-center text-sm text-gray-400">
                        {isSignUp ? (
                            <p>
                                Already have an account?{' '}
                                <button onClick={() => setIsSignUp(false)} className="text-blue-400 hover:text-blue-300 hover:underline">
                                    Sign In
                                </button>
                            </p>
                        ) : (
                            <p>
                                Don't have an account?{' '}
                                <button onClick={() => setIsSignUp(true)} className="text-blue-400 hover:text-blue-300 hover:underline">
                                    Sign Up
                                </button>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
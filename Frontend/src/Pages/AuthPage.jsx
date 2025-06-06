// import React, { useState,useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {toast} from 'react-hot-toast';


// const AuthPage = () => {
//     const [isSignUp, setIsSignUp] = useState(false);
//     const [email, setemail] = useState("");
//     const [password, setpassword] = useState("");
//     const [name,setName] = useState("");
//     const navigate = useNavigate();
    
//     const BASE_URL = "https://researchub-pbl.onrender.com"

//     useEffect(() => {
//         console.log(BASE_URL)
//         const params = new URLSearchParams(window.location.search);
//         const token = params.get("token");

//         if (token) {
//             handleGoogleResponse(token);
//         }
//     }, []);

//     const handleLogin = async () => {
//         try {
//             console.log("Entered in handleLogin in AuthPage.jsx");
//             if (!email || !password) {
//                 toast.error("Please enter email and password");
//                 return;
//             }
//             const response = await fetch(`${BASE_URL}/api/users/getParticularUser`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password }),
//             });
//             console.log(response);
//             const data = await response.json();

//             if(!data.token){
//                 console.log("Token is not created");
//                 return;
//             }

//             if (response.ok) {
//                 localStorage.setItem("token" , data.token );
//                 navigate("/dashboard");
//                 toast.success("You are logged in!");
//                 console.log("User Data : ", data);
//             } else {
//                 toast.error(data.message);
//             }
//             console.log("Completed handlesignup successfully in AuthPage.jsx");
//         } catch (error) {
//             console.error("Error in logging in ", error);
//         }
//     };

//     const handlesignup = async () => {
//         try {
//             console.log("Entered in handlesignup in AuthPage.jsx");
//             const response = await fetch(`${BASE_URL}/api/users/createUser`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({name, email, password}),
//             })
//             const data = await response.json();

//             if(!data.token){
//                 console.log("Token is not created");
//                 return;
//             }

//             if (response.ok) {
//                 localStorage.setItem("token",data.token);
//                 navigate("/verify-otp", { state: { email } });
//                 toast.success("OTP sent to your email!");
//                 // navigate("/dashboard");
//                 // toast.success("Sign up successful");
//             } else {
//                 toast.success(data.error);
//             }
//             console.log("Completed handlesignup successfully in AuthPage.jsx")
//         } catch (error) {
//             console.error("Error in Signup ", error);
//         }
//     };

//     const handleGoogleLogin = () => {
//         console.log(BASE_URL);
//         window.location.href = `${BASE_URL}/api/users/google`;
//         // console.log(`${BASE_URL}/api/users/google`)
//     };
    

//     const handleGoogleResponse = async (token) =>{
//         if(token){
//             localStorage.setItem("token",token);
//             navigate('/dashboard');
//         }
//         else{
//             console.error("Google Login Failed");
//         }
//     }

//     return (
//         <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
//         <div className={`relative w-[768px] min-h-[480px] bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 ${isSignUp ? "scale-105" : "scale-100"}`}>
            
//             {/* Left Side - Sign In */}
//             <div className={`absolute right-0 transform translate-y-1/8 flex flex-col justify-center items-center w-1/2 p-6 transition-transform duration-500 ${isSignUp ? "-translate-x-full opacity-0 " : "translate-x-0 opacity-100 z-10"} `}>
//                 <h2 className="text-3xl font-semibold text-gray-900 mb-2">Sign In</h2>
//                 {/* <div className="mt-4 w-full flex justify-center space-x-3">
//                     <button className="border p-2 w-50 h-10 rounded-md cursor-pointer font-bold" onClick={handleGoogleLogin}>with Google</button>
//                 </div> */}

//                 <div className="mt-4 w-full flex justify-center">
//                     <button 
//                         className="flex items-center justify-center gap-2 px-4 w-52 h-12 rounded-md border  hover:scale-105 active:scale-100 "
//                         onClick={handleGoogleLogin}
//                     >
//                        <img src="public/Images/search.png" alt="google_logo" className="w-5 h-5"/>
//                         with Google
//                     </button>
//                 </div>
//                 <p className="mt-2 text-gray-600">or use your email</p>
//                 <input type="email" placeholder="Email" onChange={(e)=>{setemail(e.target.value)}} className="mt-3 p-2 w-full border rounded" />
//                 <input type="password" placeholder="Password" onChange={(e)=>{setpassword(e.target.value)}} className="mt-2 p-2 w-full border rounded" />
//                 <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md w-full cursor-pointer" onClick={handleLogin}>Sign In</button>
//             </div>

//             {/* Right Side - Sign Up */}
//             <div className={`absolute inset-0 flex flex-col justify-center items-center w-1/2 p-6 transition-transform duration-500 ${isSignUp ? "translate-x-0 opacity-100 z-10" : "translate-x-full opacity-0"}`}>
//                 <h2 className="text-3xl font-semibold text-gray-900">Sign Up</h2>
//                 <div className="mt-4 w-full flex justify-center space-x-3">
//                 <div className="mt-4 w-full flex justify-center">
//                     <button 
//                         className="flex items-center justify-center gap-2 px-4 w-52 h-12 rounded-md border  hover:scale-105 active:scale-100 "
//                         onClick={handleGoogleLogin}
//                     >
//                        <img src="public/Images/search.png" alt="google_logo" className="w-5 h-5"/>
//                         with Google
//                     </button>
//                 </div>
//                 </div>
//                 <p className="mt-2 text-gray-600">or use your email</p>
//                 <input type="text" placeholder="Name" onChange={(e)=>{setName(e.target.value)}} className="mt-3 p-2 w-full border rounded" />
//                 <input type="email" placeholder="Email" onChange={(e)=>{setemail(e.target.value)}} className="mt-2 p-2 w-full border rounded" />
//                 <input type="password" placeholder="Password" onChange={(e)=>{setpassword(e.target.value)}} className="mt-2 p-2 w-full border rounded" />
//                 <button className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md w-full cursor-pointer" onClick={handlesignup}>Sign Up</button>
//             </div>

//             {/* Toggle Panel */}
//             <div className={`absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white transition-transform duration-500 ${isSignUp ? "translate-x-0" : "-translate-x-full"}`}>
//             <h2 className="text-2xl font-semibold">{isSignUp ? "Hello, Friend!" : "Welcome Back!"}</h2>
//             <p className="mt-2 w-3/4 text-center">{isSignUp ? "Register now and explore amazing features!" : "Sign in to continue where you left off."}</p>
//             <button
//                 onClick={() => setIsSignUp(!isSignUp)}
//                 className="mt-6 px-6 py-2 border border-white rounded-md hover:bg-white hover:text-blue-600 transition cursor-pointer"
//             >
//                 {isSignUp ? "Sign In" : "Sign Up"}
//             </button>
//             </div>
//         </div>
//         </div>

//     );
// };

// export default AuthPage;




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

    // useEffect(() => {
    //     const handleAuth = async () => {
    //         // First check local storage
    //         if (localStorage.getItem('token')) {
    //         navigate('/dashboard');
    //         return;
    //         }

    //         // Handle hash-based URL (#/dashboard?token=...)
    //         const hash = window.location.hash;
    //         if (hash.includes('token=')) {
    //         const token = new URLSearchParams(hash.split('?')[1]).get('token');
    //         if (token) {
    //             localStorage.setItem('token', token);
    //             navigate('/dashboard');
    //             // Clear the URL
    //             window.location.hash = '';
    //         }
    //         }
    //     };

    //     handleAuth();
    // }, [navigate]);


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
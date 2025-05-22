// import React from 'react'
// import {useState,useEffect} from 'react'
// import { Pencil } from 'lucide-react';
// import {motion} from 'framer-motion'

// function ProfilePage() {
//   const [user,setuser] = useState({
//     name :"",
//     email : "",
//     profilePicture :"",
//     bio : "",
//     researchFields : "",
//     role : "",
//     groups : [],
//     pendingRequests : [],
//     assignedTasks : [],
//     workspaceAccess : []
//   })


//   useEffect(()=>{
//     fetchUser();
//     fetchNotifications();
//   },[]);
  
//   const fetchUser = async () =>{
//     try{
//       const token = localStorage.getItem("token");
//       console.log(token);
//       if (!token) {
//           console.error("No token found in localStorage");
//           return;
//       }

//       const response = await fetch('http://localhost:5000/api/profile',{
//         method : 'GET',
//         headers : {
//           'Content-Type' : 'application/json',
//           "Authorization": `Bearer ${token}`,
//         }
//       })

//       if(!response.ok){
//         throw new Error("failed to fetch user details");
//       }
//       const data = await response.json() ;
//       console.log(data.user);
//       setuser(data.user);
//       console.log("User data fetched in fetchUser in Frontend");
//     }
//     catch(error){
//       console.error("failed to fetch user details",error);
//     }
//   }
  

//   const fetchNotifications = async () =>{
//     try{
//       console.log("Entered into fetchNotifications in ProfilePage.jsx");
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/notification/getNotifications',{
//         method : 'GET',
//         headers : {
//           'Content-Type' : 'application/json',
//           "Authorization" : `Bearer ${token}`,
//         }
//       })

//       if(!response.ok){
//         throw new Error("failed to fetch notifications");
//       }

//       const data = await response.json();
//       console.log(data);  
//       setuser(prev =>({...prev,pendingRequests:data}));
//       console.log("ended fetchNotifications in ProfilePage.jsx successfully");
//     }
//     catch(error){
//       console.error("failed to fetch notifications");
//     }
//   }

//   const giveAccess = async (_id) =>{
//     try{
//       const notification = user.pendingRequests.find(notification => notification._id===_id);
//       if(!notification){
//         console.log("failed to find Ntification in ProfilePage.jsx");
//         return;
//       }
//       const token = localStorage.getItem("token");

//       const response = await fetch("http://localhost:5000/api/profile/giveAccess",{
//         method : 'POST',
//         headers : {
//           'Content-Type' : 'application/json',
//           "Authorization" : `Bearer ${token}`
//         },
//         body : JSON.stringify({notification})
//       })

//       if(!response.ok){
//         console.log("failed to give access");
//         return;
//       }
//       setuser(prev=>({
//         ...prev,
//         pendingRequests : prev.pendingRequests.filter(req => req._id != _id)
//       }))
//       console.log(`Access is given to ${notification.requestedBy}`);
//     }
//     catch(error){
//       console.log("Failed to give access",error);
//     }
//   }
//   return (
//     <motion.div className="flex w-full h-screen bg-gray-900 p-6" initial = {{opacity : 0,y:-20}} animate={{opacity : 1,y : 0}} transition={{duration : 0.4}} >
//       {/* Profile Sidebar */}
//       {/* <div className="w-1/4 h-full bg-gray-800 text-white rounded-xl p-6 shadow-lg">
//         <Pencil className='taxt-gray-500'/>
//         <div className="flex flex-col items-center space-y-4">
//           <img
//             src={user.profilePicture}
//             alt="Profile"
//             className="w-32 h-32 rounded-full border-4 border-[#38BDF8]"
//           />
//           <h2 className="text-xl font-semibold">{user.name}</h2>
//           <p className="text-sm text-gray-400">{user.bio || 'No bio available'}</p>
//           <p className="text-sm bg-[#334155] p-2 rounded-md">Role: {user.role}</p>
//           <p className="text-sm bg-[#334155] p-2 rounded-md">Field: {user.researchFields}</p>
//         </div>
//       </div> */}



//       <div className="w-1/4 h-full bg-gray-800 text-white rounded-xl p-6 shadow-lg flex flex-col items-center space-y-4">
//         {/* Edit Icon */}
//         <div className="self-end cursor-pointer">
//           <Pencil className="text-gray-500 hover:text-gray-300 transition duration-200" />
//         </div>

//         {/* Profile Section */}
//         <img
//           src={user?.profilePicture || "/default-profile.png"} 
//           alt="Profile"
//           className="w-32 h-32 rounded-full border-4 border-[#38BDF8] object-cover"
//         />
        
//         <h2 className="text-xl font-semibold text-center">{user?.name || "Unknown User"}</h2>
//         <p className="text-sm text-gray-400 text-center">{user?.bio || "No bio available"}</p>
        
//         {/* Role & Research Field */}
//         <p className="text-sm bg-[#334155] px-4 py-2 rounded-md text-center">
//           <strong>Role:</strong> {user?.role || "Not specified"}
//         </p>

//         <p className="text-sm bg-[#334155] px-4 py-2 rounded-md text-center">
//           <strong>Field:</strong> {user?.researchFields || "Not specified"}
//         </p>
//       </div>


//       {/* Main Content */}
//       <div className="w-3/4 h-full flex flex-col space-y-4 pl-6">
//         {/* Research Groups */}
//         <div className="bg-[#1E1E2E] text-white rounded-xl p-6 shadow-lg">
//           <h3 className="text-lg font-semibold text-[#38BDF8] mb-4">Research Groups</h3>
//           <ul className="list-disc list-inside space-y-2">
//             {user.groups.length > 0 ? (
//               user.groups.map((group, index) => (
//                 <li key={index} className="bg-[#334155] p-2 rounded-md">{group}</li>
//               ))
//             ) : (
//               <p className="text-gray-400">No groups joined yet.</p>
//             )}
//           </ul>
//         </div>

//         {/* Two-column Layout for Tasks & Requests */}
//         <div className="grid grid-cols-2 gap-4">
//           {/* Pending Requests */}
//           <div className="bg-[#1E1E2E] text-white rounded-xl p-4 shadow-lg">
//             <h3 className="text-lg font-semibold text-[#38BDF8] mb-2">Pending Requests</h3>
//             <ul className="list-disc list-inside space-y-2">
//               {user.pendingRequests.length > 0 ? (
//                 user.pendingRequests.map((notification, index) => (
//                   <div
//                     key={index}
//                     className="bg-[#334155] p-3 rounded-md flex justify-between items-center"
//                   >
//                     <p>
//                       <strong>{notification.requestedBy.name}</strong> wants to join{' '}
//                       <strong>{notification.relatedTeam.Team_name}</strong>
//                     </p>
//                     <button
//                       className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition"
//                       onClick={() => giveAccess(notification._id)}
//                     >
//                       Accept
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-400">No pending requests.</p>
//               )}
//             </ul>
//           </div>

//           {/* Research Progress */}
//           <div className="bg-[#1E1E2E] text-white rounded-xl p-4 shadow-lg">
//             <h3 className="text-lg font-semibold text-[#38BDF8] mb-2">Research Progress</h3>
//             <p className="text-sm text-gray-400">
//               Completed: {user.researchCompleted} | Ongoing: {user.researchOngoing} | Upcoming: {user.researchUpcoming}
//             </p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default ProfilePage






import React, { useState, useEffect } from 'react';
import { Pencil, Bell, Check, X, Clock, FileText, Users, BarChart2, Award, Mail, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';
import ProfileUpdateForm from '../Components/ProfileUpdateForm';
import toast from 'react-hot-toast';

function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePicture: "",
    bio: "",
    researchFields: [],
    role: "",
    groups: [],
    pendingRequests: [],
    assignedTasks: [],
    workspaceAccess: false,
    stats: {
      projectsCompleted: 0,
      tasksCompleted: 0,
      collaborations: 0
    }
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ bio: '', researchFields: '' });
  const [recentActivities,setRecentActivities] = useState([]);
  const [stats,setStats] = useState({
    documents : 0,
    tasks : 0,
    Teams_Admin : 0
  });

  
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error("Failed to fetch user details");
      const data = await response.json();
      console.log("sjdfkjdhfkhd",data);
      setUser(data.user);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notification/getNotifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setUser(prev => ({ ...prev, pendingRequests: data }));
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        }
      });
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setUser(prev => ({ ...prev, stats: data.stats }));
      console.log(user);
    } catch (error) {
      console.error("Failed to fetch user stats", error);
    }
  };

  const giveAccess = async (_id) => {
    try {
      const notification = user.pendingRequests.find(n => n._id === _id);
      if (!notification) return;

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/profile/giveAccess", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ notification })
      });

      if (!response.ok) throw new Error("Failed to give access");
      
      setUser(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter(req => req._id !== _id),
        // groups: [...prev.groups, notification.relatedTeam._id]
        groups: Array.isArray(prev.groups) 
        ? [...prev.groups, notification.relatedTeam._id] 
        : [notification.relatedTeam._id]
      }));
    } catch (error) {
      console.error("Failed to give access", error);
    }
  };

  const rejectRequest = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/notification/reject_Team_join/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      });

      setUser(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests.filter(req => req._id !== _id)
      }));
    } catch (error) {
      console.error("Failed to reject request", error);
    }
  };
  
  const handleEdit = () => {
    setEditData({
      bio: user.bio,
      researchFields: user.researchFields.join(', ')
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          bio: editData.bio,
          researchFields: editData.researchFields.split(',').map(f => f.trim())
        })
      });

      if (!response.ok) throw new Error("Failed to update profile");
      
      const data = await response.json();
      setUser(prev => ({ ...prev, ...data.user }));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const getUserStats = async() =>{
    try{
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/profile/stats`,{
        method : "GET",
        headers : {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        }
      });

      if(!response.ok){
        return console.log("failed to fetch user stats");
      }
      const data = await response.json();
      // console.log("dkhdkjhs",data);
      setStats(data.stats);
      // console.log(stats);
    }
    catch(error){
      console.log("failed to fetch user stats",error);
    }
  }

  const getUserRecentActivities = async (userId, limit = 10) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/profile/activities?limit=${limit}`,{
        method : "GET",
        headers : {
          "Content-Type" : "application/json",
          "Authorization" : `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }
      

      const { data, success, error } = await response.json();
      
      if (!success) {
        throw new Error(error || 'Failed to fetch activities');
      }
      
      const processedActivities = data.map(activity => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));

      console.log("kdhfkjdhf",data);
      
      setRecentActivities(processedActivities);
      return processedActivities;
      
    } catch (error) {
      console.error('Error fetching user activities:', error);
      setRecentActivities([]);
      return [];
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
    
      const formData = new FormData();
    
      formData.append('name', updatedData.name);
      formData.append('bio', updatedData.bio);
      formData.append('role', updatedData.role);

      if (updatedData.researchFields) {
        const fieldsString = updatedData.researchFields
          .split(',')
          .map(field => field.trim())
          .filter(field => field !== '')
          .join(','); 
      
        formData.append('researchFields', fieldsString);
      }
      
      if (updatedData.profilePicture instanceof File) {
        formData.append('profilePicture', updatedData.profilePicture);
      }
      console.log("jhjhjhjh",updatedData);
      const response = await fetch('http://localhost:5000/api/profile/updateProfile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, 
      });
      if (!response.ok) throw new Error('Update failed');
      
      const data = await response.json();
      setUser(data.user);
      toast.success(data.message);
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message);
    }
  };
  
  useEffect(() => {
    fetchUser();
    fetchNotifications();
    fetchUserStats();
    getUserRecentActivities();
    getUserStats();
  }, []);

  return (
    <motion.div 
      className="flex w-full min-h-screen bg-gray-900 p-6" 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      {/* Profile Sidebar */}
      <div className="w-1/4 h-full bg-gray-800 text-white rounded-xl p-6 shadow-lg flex flex-col space-y-4 sticky top-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#38BDF8]">Profile</h2>
          <button 
            onClick={handleEdit}
            className="text-gray-400 hover:text-white transition"
            data-tooltip-id="edit-tooltip"
            data-tooltip-content="Edit Profile"
          >
            <Pencil size={18} />
          </button>
          <Tooltip id="edit-tooltip" />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <img
            src={user?.profilePicture || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-[#38BDF8] object-cover"
          />
          
          <h2 className="text-xl font-semibold text-center">{user?.name || "Unknown User"}</h2>
          <p className="text-sm text-gray-300 text-center">{user?.email}</p>

          <p className="text-sm text-gray-400 text-center">{user?.bio || "No bio available"}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {user?.researchFields?.map((field, i) => (
              <span key={i} className="bg-[#334155] px-3 py-1 rounded-full text-xs">
                {field}
              </span>
            ))}
          </div>
          
          {/* {isEditing ? (
            <>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                className="w-full bg-gray-700 rounded p-2 text-sm"
                placeholder="Tell us about yourself..."
                rows={3}
              />
              <input
                type="text"
                value={editData.researchFields}
                onChange={(e) => setEditData({...editData, researchFields: e.target.value})}
                className="w-full bg-gray-700 rounded p-2 text-sm"
                placeholder="Research fields (comma separated)"
              />
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400 text-center">{user?.bio || "No bio available"}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {user?.researchFields?.map((field, i) => (
                  <span key={i} className="bg-[#334155] px-3 py-1 rounded-full text-xs">
                    {field}
                  </span>
                ))}
              </div>
            </>
          )} */}


          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center bg-opacity-100 backdrop-blur-xs"
            >
                <ProfileUpdateForm 
                  userData={user}
                  onUpdate={handleUpdateProfile}
                  onCancel={() => setIsEditing(false)}
                />
            </motion.div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Users size={16} className="text-[#38BDF8]" />
            <span>Role: <span className="font-medium">{user?.role || "Not specified"}</span></span>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="w-3/4 h-full flex flex-col space-y-4 pl-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {['overview', 'requests'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm capitalize ${activeTab === tab ? 'text-[#38BDF8] border-b-2 border-[#38BDF8]' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Recent Activity */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#38BDF8] mb-4 flex items-center">
                <BarChart2 size={18} className="mr-2" /> Recent Activity
              </h3>
              <div className="space-y-3 h-50 overflow-y-auto overflow-hidden">
                {console.log(recentActivities.length)}
                {recentActivities.length > 0 ? (
                  recentActivities.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                      <div className="bg-[#334155] p-2 rounded-full">
                        <Clock size={16} className="text-[#38BDF8]" />
                      </div>
                      <div>
                        <p className="text-sm">{item.message}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                    <p>No Recent Activities</p>
                  </div>
                )}
              </div>
            </div>

            {/* Research Groups */}
            {/* <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#38BDF8] mb-4 flex items-center">
                <Users size={18} className="mr-2" /> Your Teams
              </h3>
              {user.groups.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {user.groups.map((group, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition cursor-pointer">
                      <h4 className="font-medium">{group.Team_name}</h4>
                      <p className="text-sm text-gray-400 mt-1">5 members</p>
                      <div className="flex mt-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-gray-500 -ml-2 first:ml-0 border-2 border-gray-700"></div>
                        ))}
                        <div className="w-6 h-6 rounded-full bg-gray-800 -ml-2 border-2 border-gray-700 flex items-center justify-center text-xs">
                          +2
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">You haven't joined any teams yet.</p>
              )}
            </div> */}
          </div>
        )}

        {/* {activeTab === 'teams' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#38BDF8] mb-4">Your Research Groups</h3>
            {user.groups.length > 0 ? (
              <div className="space-y-4">
                {user.groups.map((group, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{group.Team_name}</h4>
                      <span className="text-xs bg-[#334155] px-2 py-1 rounded">
                        {group.members?.length || 0} members
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{group.description || "No description"}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex -space-x-2">
                        {group.members?.slice(0, 5).map((member, i) => (
                          <img 
                            key={i}
                            src={member.profilePicture} 
                            alt={member.name}
                            className="w-6 h-6 rounded-full border-2 border-gray-700"
                          />
                        ))}
                        {group.members?.length > 5 && (
                          <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-xs">
                            +{group.members.length - 5}
                          </div>
                        )}
                      </div>
                      <button className="text-xs bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1 rounded transition">
                        View Team
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">You haven't joined any research groups yet.</p>
                <button className="mt-4 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] rounded transition">
                  Browse Groups
                </button>
              </div>
            )}
          </div>
        )} */}

        {/* {activeTab === 'tasks' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#38BDF8] mb-4">Your Tasks</h3>
            {user.assignedTasks.length > 0 ? (
              <div className="space-y-3">
                {user.assignedTasks.map((task, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{task.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        task.status === 'completed' ? 'bg-green-900 text-green-300' : 
                        task.status === 'in-progress' ? 'bg-yellow-900 text-yellow-300' : 
                        'bg-red-900 text-red-300'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Calendar size={14} />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      <button className="text-xs bg-[#2563EB] hover:bg-[#1D4ED8] px-3 py-1 rounded transition">
                        View Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">You don't have any assigned tasks.</p>
              </div>
            )}
          </div>
        )} */}

        {activeTab === 'requests' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#38BDF8] mb-4 flex items-center">
              <Bell size={18} className="mr-2" /> Pending Requests
            </h3>
            {user.pendingRequests.length > 0 ? (
              <div className="space-y-3">
                {user.pendingRequests.map((notification, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={notification.requestedBy.profilePicture} 
                        alt={notification.requestedBy.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium">{notification.requestedBy.name}</h4>
                        <p className="text-sm text-gray-400">
                          Wants to join <span className="text-[#38BDF8]">{notification.relatedTeam.Team_name}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => giveAccess(notification._id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition"
                      >
                        <Check size={16} />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => rejectRequest(notification._id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
                      >
                        <X size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No pending requests.</p>
              </div>
            )}
          </div>
        )}
        {/* Stats */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-[#38BDF8] mb-4 flex items-center">
            <BarChart2 size={18} className="mr-2" /> Your Stats
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#38BDF8]">{stats.documents || 0}</div>
              <div className="text-sm text-gray-400">Documents</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#38BDF8]">{stats.tasks || 0}</div>
              <div className="text-sm text-gray-400">Tasks Completed</div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#38BDF8]">{stats.Teams_Admin || 0}</div>
              <div className="text-sm text-gray-400">Teams Admin</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfilePage;
// import React, { useEffect } from 'react'
// import { useState} from 'react';
// import Select from 'react-select';
// import toast from 'react-hot-toast';
// import { motion } from "framer-motion";
// import { Search ,PlusCircle,X} from "lucide-react";

// function YourTeams() {
//     const [teams,setTeams] = useState([]);
//     const [Team,setTeam] = useState(null);
//     const [ShowTeam,setShowTeam] = useState(false);
//     const [isHovered,setIsHovered] = useState(false);
//     const [isAdmin,setIsAdmin] = useState(null);
//     const [isOpenForm,setIsOpenForm] = useState(false);
//     const [users,setUsers] = useState([]);
//     const [search, setSearch] = useState('');
//     const [selectedTeam, setSelectedTeam] = useState(null);
//     const [stage,setstage] = useState({
//         no : 0,
//         title : "",
//         members : [],
//     });
//     const [count,setCount] = useState(0);
//     const [filteredTeams, setFilteredTeams] = useState([]);



//     useEffect(() => {
//         setFilteredTeams(
//             teams.filter((team) =>
//                 team?.Team_name?.toLowerCase().includes(search.toLowerCase())
//             )
//         );
//     }, [search, teams]);


//     const [task,settask] = useState({
//         title:"",
//         description:"",
//         startDate : "",
//         deadline:"",
//         progress:0,
//         relatedTeam : null ,
//         stages : [],
//     })

//     const defaultTaskState = {
//         title: "",
//         description: "",
//         startDate: "",
//         deadline: "",
//         progress: 0,
//         relatedTeam: null,
//         stages: [],
//     };
    

//     const fetchTeams = async () =>{
//         try{
//           const token = localStorage.getItem('token');
//           console.log("Token before fetch:", token);
//           const response = await fetch('http://localhost:5000/api/yourTeams/getYourTeams',{
//             method : 'GET',
//             headers : {
//               'Content-Type' : 'application/json',
//               Authorization : `Bearer ${token}`,
//             }
//           });
    
//           if(!response.ok){
//             throw new Error('failed to fetch teams');
//           }
//           const data = await response.json();
//           console.log("Yourteams : ",data);
//           setTeams(data);
//         }
//         catch(error){
//           console.error("Error in fetchTeams in Frontend",error);
//         }
//     }

//     const fetchParticularTeam = async (team) =>{
//         if (!team) {
//             console.error("Invalid teamId provided!");
//             return;
//         }
//         try{
//             // if (!Team || !Team.team || !Team.team.Admin) return;
//             setShowTeam(true);
//             CheckIsAdmin(team);
//             console.log("entered in fetchParticularTeam in YourTeams.jsx");
//             const token = localStorage.getItem('token');
//             console.log("Token before fetch:", token);
//             const response = await fetch(`http://localhost:5000/api/yourTeams/getParticularTeam/${team._id}`,{
//                 method : 'GET',
//                 headers : {
//                     'Content-Type' : 'application/json',
//                     Authorization : `Bearer ${token}`,
//                 }
//             });
            
//             if(!response.ok){
//                 throw new Error('failed to fetch teams rrrrr');
//             }
//             const data = await response.json();
//             console.log("Is Admin : ",data);
//             setTeam(data);
//             // console.log("Team : ",Team);
//             // console.log("Team.completedTasks : ",Team.completedTasks);
//             console.log("Completed fetchParticularTeam successfully in YourTeams.jsx");
//             // setShowTeam(false);
//         }
//         catch(error){
//           console.error("Error in fetchTeams in Frontend",error);
//         }
//     }

//     // const CheckIsAdmin = async (id) => {
//     //     try{
//     //         console.log("Entered in CheckIsAdmin in YourTeams.jsx")
//     //         const token = localStorage.getItem("token");
//     //         const response = await fetch(`http://localhost:5000/api/yourTeams/CheckAdminOrNot/${Team.team.Admin._id}`,{
//     //             method : "GET",
//     //             headers : {
//     //                 'Content-Type' : 'application/json',
//     //                 'Authorization' : `Bearer ${token}`
//     //             }
//     //         })

//     //         if(!response.ok){
//     //             throw new Error('failed to check user is Admin of team or not ');
//     //         }
//     //         const data = await response.json();
//     //         console.log("IsAdmin : ",data);
//     //         setIsAdmin(data);
//     //         console.log("Completed CheckIsAdmin successfully in YourTeams.jsx");
//     //     }
//     //     catch(error){
//     //         console.log("Failed to check current user is Admin or not ");
//     //     }
//     // }


//     const CheckIsAdmin = async (team) => {
//         // if (!selectedTeam) return; // Check before proceeding
    
//         try {
//             console.log("Entered in CheckIsAdmin in YourTeams.jsx");
//             const token = localStorage.getItem("token");
//             const response = await fetch(`http://localhost:5000/api/yourTeams/CheckAdminOrNot/${team.Admin._id}`,{
//                 method: "GET",
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });
    
//             if (!response.ok) {
//                 throw new Error('Failed to check if user is Admin');
//             }
//             const data = await response.json();
//             console.log("IsAdmin:", data);
//             setIsAdmin(data);
//             console.log("Completed CheckIsAdmin successfully in YourTeams.jsx");
//         } catch (error) {
//             console.error("Failed to check current user is Admin or not", error);
//         }
//     };
    

//     const handleClick = async (e, relatedTeam) => {
//         e.preventDefault(); // Prevent default form submission behavior
    
//         console.log("relatedTeam : ", relatedTeam);
    
//         if (!task.title || !task.description || !task.deadline || !task.startDate) {
//             toast.error("Please fill in all fields before submitting.");
//             return;
//         }

//         try {
//             await createTasks(relatedTeam); 
//             setIsOpenForm(false);
//             settask(defaultTaskState);
//         } catch (error) {
//             toast.error("Failed to create task. Please try again.");
//             console.error("Error creating task:", error);
//         }
//     };
    

//     const handlechange = (e) => {
//         const { name, value } = e.target;
    
//         let formattedvalue = value;
//         if (name === "deadline" || name === "startDate") {
//             const [year, month, day] = value.split("-");
//             formattedvalue = `${day}-${month}-${year}`;
//         }
    
//         settask((prev) => ({
//             ...prev,
//             [name]: formattedvalue,
//         }));
//     };
    
    

//     const [fadeOutIndex, setFadeOutIndex] = useState(null);

//     const handleRemoveStage = (index) => {
//         setFadeOutIndex(index);
//         setTimeout(() => {
//             settask(prev => ({
//                 ...prev,
//                 stages: prev.stages.filter((_, i) => i !== index),
//             }));
//             setFadeOutIndex(null);
//         }, 300); // 300ms delay for animation
//     };


//     const getUsers = async() => {
//         try{
//           const response = await fetch("http://localhost:5000/api/users/getAllUsers",{
//             method:"GET",
//             headers:{"Content-type" : "application/json"},
//           })
//           if(!response.ok){
//             throw new Error(`Http error! Status:${response.status}`);
//           }
//           const data = await response.json();
//           console.log("Fetched Users:", data); // Debugging
//           const userOptions = data.map((user)=>({
//             value:user._id,
//             label:user.name,
//           }));
  
//           setUsers(userOptions);
//         }catch(error){
//           console.log(error);
//           setUsers([]);
//         }
        
//     }

//     // const handleSelectedMembers = (selected) => {
//     //     const selectedMembers = selected.map((item)=>item.value);
//     //     settask((prev)=>({
//     //       ...prev,
//     //       assignedMembers:selectedMembers,
//     //     }))
//     // }

//     const createTasks = async (relatedTeam) => {
//         try{
//             console.log("Entered into createdTasks in yourTeams.jsx")
//           const token = localStorage.getItem("token");
//             if (!token) {
//               console.error("No token found in localStorage!");
//               toast.success("You are not logged in!");
//               return;
//             }
//             console.log("kjdjfjkfjkf : ",task);
//             console.log("relatedTeam : ",relatedTeam);
//             const response = await fetch("http://localhost:5000/api/tasks/createtask",{
//                 method : "POST",
//                 headers:{
//                     "Content-Type":"application/json",
//                     "Authorization":`Bearer ${token}`
//                 },
//                 body:JSON.stringify({title : task.title,description : task.description,stages : task.stages,startDate : task.startDate,deadline : task.deadline,progress : task.progress,status:"ongoing",relatedTeam : relatedTeam}),
//             })
//             if(response.ok){
//                 toast.success("Task Created Successfully");
//                 console.log("Task created successfully");
//             }
//             else{
//                 console.log("Task not created");
//                 const data = await response.json();
//                 toast.error(data.message || "Task not created")
//             }
//             console.log("Completed createdTasks successfully in yourTeams.jsx")
//         }catch(error){
//             console.log(error.message);
//         }
//     }
    
  
//     // useEffect(()=>{
//     //     if (Team && Team.team && Team.team.Admin) {
//     //         CheckIsAdmin();
//     //     }
//     // },[Team]);

//     useEffect(()=>{
//         getUsers();
//         fetchTeams();
//     },[]);
      
    

//     return (
//         <motion.div className='text-white flex flex-row h-screen w-full bg-gray-900' initial = {{opacity : 0,y:-20}} animate = {{opacity : 1,y : 0}} transition={{duration : 0.4}}>
            
//             <div className='rounded-lg bg-gray-900 w-full h-full m-2 flex flex-col shadow-xl p-6'>
//             <div className="flex justify-between items-center mb-4">
//                     <motion.h1 className="text-3xl font-semibold text-white" whileHover={{scale : 1.05}}>Your Teams</motion.h1>
                    
//                     <div className="relative w-72">
//                         {/* Search Icon */}
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        
//                         {/* Input Field */}
//                         <input 
//                         type="text" 
//                         placeholder="Search" 
//                         value={search}
//                         className="pl-10 pr-4 py-2 w-full rounded-2xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         onChange={(e)=>{setSearch(e.target.value)}}
//                         />
//                     </div>
//                 </div>

//                 <hr className='text-gray-500 mb-4'/>

//                 <div className='w-full h-[60%] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
//                     {
//                         teams.filter(team => team?.Team_name?.toLowerCase().includes(search.toLowerCase())).map((team,index)=>(
//                             <div 
//                                 key={index} 
//                                 className="relative border-2 rounded-lg bg-gradient-to-br from-[#2A2D32] to-[#1F2225] p-6 flex flex-col shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 cursor-pointer space-y-2" 
//                                 onClick={()=>{fetchParticularTeam(team)}}
//                             >
//                                 {console.log(JSON.stringify(team, null, 2))}

//                                 <h1 className='text-xl text-center font-bold '>{team.Team_name}</h1>
//                                 <p>{team.description}</p>
//                                 <p><strong>Admin :</strong> {team.Admin.name}</p>

//                                 {team.members && team.members.length > 0 && (
//                                 <div className="flex gap-2 mt-2 flex-wrap">
//                                     Members : 
//                                     {team.members.map((member) => (
//                                     <img
//                                         key={member._id}
//                                         src={member.profilePicture}
//                                         alt={member.name}
//                                         title={member.name}
//                                         className={`w-10 h-10 rounded-full object-cover border-2 border-gray-600 ${
//                                             index === 0 ? "ml-0" : "-ml-4"
//                                         }`}
//                                     />
//                                     ))}
//                                     {team.members.length > 1 && (
//                                     <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white text-sm font-medium rounded-full border-2 border-gray-600 -ml-3">
//                                       +{team.members.length - 1}
//                                     </div>
//                                   )}
//                                 </div>
//                                 )}
//                             </div>
//                         ))
//                     }   
//                 </div>

//                 {ShowTeam && Team && Team.team && (
//                         <div className='absolute top-0 left-0 w-full h-full bg-opacity-50 flex justify-center items-center backdrop-blur-sm'>
//                             <div className='w-[90%] max-w-lg bg-[#2A2D32] p-4 rounded-lg shadow-lg'>
//                                 {/* Team Header */}
//                                 {console.log("Team:", Team.team)}
                                
//                                 <div 
//                                     className="relative w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg"
//                                     onMouseEnter={() => setIsHovered(true)}
//                                     onMouseLeave={() => setIsHovered(false)}
//                                 >
//                                     <button 
//                                         className='absolute -right-4 -top-4 text-gray-400 hover:text-white transition-colors'
//                                         onClick={() => setShowTeam(false)}
//                                     >
//                                         <X size={20} />
//                                     </button>
//                                     {/* Close Button (Shows on Hover) */}
//                                     <h1 className="text-3xl font-bold text-center text-blue-400">{Team.team.Team_name}</h1>
//                                     <p className="text-center text-gray-300 mt-2">Admin: {Team.team.Admin.name}</p>
//                                 </div>
                                
//                                 {/* Team Members */}
//                                 <div className="w-full max-w-4xl mt-4 bg-gray-800 p-6 rounded-lg shadow-lg">
//                                     <h2 className="text-2xl font-semibold text-blue-400">Team Members</h2>
//                                     <div className="flex mt-2">
//                                         {Team.team.members.map((member,index) => (
//                                         // <div key={member.id} className="flex flex-col space-1 items-center space-x-3 p-3 rounded-lg">
//                                             <img 
//                                                 src={member.profilePicture} 
//                                                 alt={member.name} 
//                                                 title={member.name} 
//                                                 className={`w-10 h-10 rounded-full object-cover border-2 border-gray-600 ${
//                                                     index === 0 ? "ml-0" : "-ml-4"
//                                                 }`}
//                                             />
//                                         ))}
//                                         {Team.team.members.length > 1 && (
//                                         <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white text-sm font-medium rounded-full border-2 border-gray-600 -ml-3">
//                                             +{Team.team.members.length - 1}
//                                         </div>
//                                         )}
//                                     </div>
//                                 </div>
                        
//                                 {isAdmin && (!isOpenForm ? (
//                                         <div className='w-full max-w-4xl mt-4 bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer flex justify-center items-center text-lg space-x-2' onClick={()=>{setIsOpenForm(true)}}>
//                                             <PlusCircle size={30} className="hover:scale-110 transition-transform" />
//                                             <p>Assign Tasks</p>
//                                         </div>
//                                     ):(
//                                         <div className='absolute top-0 left-0 w-full h-full bg-opacity-50 flex justify-center items-cente backdrop-blur-md'>
//                                         <form className="m-4 bg-gray-800 flex flex-col text-white w-3/5 justify-center items-center rounded-md p-6 gap-6">
//                                                 {/* Title Input */}
//                                                 <div className="flex flex-col w-full">
//                                                     <label htmlFor="title" className="mb-1 font-semibold">Title</label>
//                                                     <input 
//                                                         type="text" 
//                                                         id="title" 
//                                                         name="title" 
//                                                         className="w-full h-10 px-3 rounded-md bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                         onChange={handlechange} 
//                                                         placeholder="Enter task title"
//                                                     />
//                                                 </div>

//                                                 {/* Description Input */}
//                                                 <div className="flex flex-col w-full">
//                                                     <label htmlFor="description" className="mb-1 font-semibold">Description</label>
//                                                     <textarea 
//                                                         id="description"  
//                                                         name="description"  
//                                                         className="w-full h-24 p-2 rounded-md bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                                                         onChange={handlechange} 
//                                                         placeholder="Enter task description"
//                                                     />
//                                                 </div>

//                                                 {/* stages Input & Assigned Members */}
//                                             {/* stages Input */}
//                                                 <div className="flex flex-col w-full">
//                                                     <label className="mb-1 font-semibold">Stages</label>

//                                                     {/* Input Fields for Adding a stage */}
//                                                     <div className="flex flex-row justify-stretch gap-2 p-3 border border-white/30 rounded-md bg-white/10">
//                                                         {/* stage Name Input */}
//                                                         <input 
//                                                             type="text"
//                                                             value={stage.title}
//                                                             onChange={(e) => setstage((prev)=>({...prev,["title"] : e.target.value}))}
//                                                             className="border border-white rounded-md px-2 py-1 bg-transparent text-white focus:ring-2 flex-6 focus:ring-blue-500"
//                                                             placeholder="Enter stage name"
//                                                         />

//                                                         {/* Select Members for this stage */}
//                                                         <Select 
//                                                             isMulti
//                                                             options={users} 
//                                                             value={stage.members} 
//                                                             onChange={(selectedOptions) => {
//                                                                 setstage((prev) => ({ ...prev, members: selectedOptions }));
//                                                             }} 
//                                                             className="bg-white text-black rounded-md flex-4"
//                                                             placeholder="Select members"
//                                                             styles={{
//                                                                 control: (provided) => ({
//                                                                     ...provided,
//                                                                     minHeight: "30px",
//                                                                     maxHeight: "100px",
//                                                                     overflowY: "auto",
//                                                                 }),
//                                                                 valueContainer: (provided) => ({
//                                                                     ...provided,
//                                                                     maxHeight: "35px",
//                                                                     overflowY: "auto",
//                                                                 }),
//                                                             }}
//                                                         />

//                                                         {/* Add stage Button - Now Placed Below Members Selection */}
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => {
//                                                                 if (stage.title?.trim() !== '' && stage.members?.length > 0) {
//                                                                     settask(prev => ({
//                                                                         ...prev,
//                                                                         stages: [...(prev.stages || []), { no : count,title: stage.title.trim(), members: stage.members }]
//                                                                     }));
//                                                                     setCount((prev)=>(prev+1));
//                                                                     // Reset stage input fields
//                                                                     setstage({ title: "", members: [] });
//                                                                 }
//                                                             }}
//                                                             className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white flex-1 font-semibold rounded-md"
//                                                         >
//                                                             Add
//                                                         </button>

//                                                     </div>

//                                                     {/* Display List of stages with Assigned Members */}
//                                                     {task.stages.length > 0 && (
//                                                         <ul className="mt-3 space-y-2 overflow-y-auto max-h-20">
//                                                             {task.stages.map((stage, index) => (
//                                                                 <li 
//                                                                     key={index} 
//                                                                     className={`p-3 bg-white/10 rounded-md text-white flex flex-col transition-opacity duration-300 ${fadeOutIndex === index ? 'opacity-0' : 'opacity-100'}`}
//                                                                 >

//                                                                     {/* Display Assigned Members */}

//                                                                     <div className="flex justify-between items-center">
//                                                                         <span className="font-semibold">{index + 1}. {stage.title}</span>
//                                                                         <button
//                                                                             type='button'
//                                                                             onClick={() => {
//                                                                                 settask(prev => {
//                                                                                     const updatedStages = prev.stages.filter((_, i) => i !== index);
//                                                                                     return { ...prev, stages: updatedStages };
//                                                                                 });
//                                                                             }}
//                                                                             className="text-red-500 hover:text-red-700 text-sm"
//                                                                         >
//                                                                             ✖ Remove
//                                                                         </button>
//                                                                     </div>
//                                                                     <div className="mt-1 text-sm text-gray-300">
//                                                                         <strong>Members:</strong> {stage.members.map(m => m.label).join(', ')}
//                                                                     </div>
//                                                                 </li>
//                                                             ))}
//                                                         </ul>
//                                                     )}
//                                                 </div>


//                                                 {/* Start Date & Deadline */}
//                                                 <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
//                                                     <div className="flex flex-col">
//                                                         <label htmlFor="startDate" className="mb-1 font-semibold">Start Date</label>
//                                                         <input 
//                                                             type="date" 
//                                                             id="startDate" 
//                                                             name="startDate" 
//                                                             className="w-full h-10 px-3 rounded-md bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                             onChange={handlechange} 
//                                                         />
//                                                     </div>
//                                                     <div className="flex flex-col">
//                                                         <label htmlFor="deadline" className="mb-1 font-semibold">Deadline</label>
//                                                         <input 
//                                                             type="date" 
//                                                             id="deadline" 
//                                                             name="deadline" 
//                                                             className="w-full h-10 px-3 rounded-md bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                                             onChange={handlechange} 
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 {/* Buttons */}
//                                                 <div className="flex justify-end space-x-6 w-full mt-4">
//                                                     <button
//                                                         type="button"
//                                                         className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-all"
//                                                         onClick={() => setIsOpenForm(false)}
//                                                     >
//                                                         Cancel
//                                                     </button>
//                                                     <button
//                                                         type="submit"
//                                                         className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-all"
//                                                         onClick={(e)=>{handleClick(e,Team.team._id)}}
//                                                     >
//                                                         Submit
//                                                     </button>
//                                                 </div>
//                                             </form>


                                        
//                                         </div>
//                                     )
//                                 )
//                                 }

//                                 {/* Completed Tasks */}
//                                 <div className="w-full max-w-4xl mt-4 bg-gray-800 p-6 rounded-lg shadow-lg">
//                                 <h2 className="text-2xl font-semibold text-green-400">Completed Tasks</h2>
//                                 {Team.completedTasks && Team.completedTasks.length > 0 ? (
//                                     <ul className="mt-4 space-y-2">
//                                     {Team.completedTasks.map((task, index) => (
//                                         <li key={index} className="p-3 bg-gray-700 rounded-lg">{task}</li>
//                                     ))}
//                                     </ul>
//                                 ) : (
//                                     <p className="text-gray-400 mt-2">No completed tasks yet.</p>
//                                 )}
//                                 </div>
//                             </div>
//                     </div>
//                 )}
//             </div>
//         </motion.div> 
//     )
// }

// export default YourTeams



import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Search, PlusCircle, X, Bell } from "lucide-react";
import Select from 'react-select';
import toast from 'react-hot-toast';
import NotificationBadge from '../Components/NotificationBadge';

function YourTeams() {
    const [teams, setTeams] = useState([]);
    const [Team, setTeam] = useState(null);
    const [ShowTeam, setShowTeam] = useState(false);
    const [isAdmin, setIsAdmin] = useState(null);
    const [isOpenForm, setIsOpenForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [stage, setStage] = useState({
        no: 0,
        title: "",
        members: [],
    });
    const [count, setCount] = useState(0);
    const [fadeOutIndex, setFadeOutIndex] = useState(null);
    const [userNotifications, setUserNotifications] = useState({});
    const [task, setTask] = useState({
        title: "",
        description: "",
        startDate: "",
        deadline: "",
        progress: 0,
        relatedTeam: null,
        stages: [],
    });

    const defaultTaskState = {
        title: "",
        description: "",
        startDate: "",
        deadline: "",
        progress: 0,
        relatedTeam: null,
        stages: [],
    };

    useEffect(() => {
        getUsers();
        fetchTeams();
    }, []);

    const checkForNotifications = async (teamId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`http://localhost:5000/api/notification/userUnread/${teamId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUserNotifications(prev => ({
                    ...prev,
                    [teamId]: data.hasUnread
                }));
            }
        } catch (error) {
            console.error("Error checking notifications:", error);
        }
    };

    const fetchTeams = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/yourTeam/getYourTeams', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            
            if (!response.ok) {
                throw new Error('failed to fetch teams');
            }
            const data = await response.json();
            setTeams(data);
            
            // Check notifications for each team
            data.forEach(team => {
                checkForNotifications(team._id);
            });
        }
        catch (error) {
            console.error("Error in fetchTeams in Frontend", error);
        }
    };

    

    

    const fetchParticularTeam = async (team) => {
        if (!team) {
            console.error("Invalid teamId provided!");
            return;
        }
        try {
            // console.log("TEAM : ",team)
            setShowTeam(true);
            CheckIsAdmin(team);
            const token = localStorage.getItem('token');
            console.log("kfjdkfd",team._id);
            const response = await fetch(`http://localhost:5000/api/yourTeam/getParticularTeam/${team._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('failed to fetch teams');
            }
            const data = await response.json();
            setTeam(data);
        }
        catch (error) {
            console.error("Error in fetchTeams in Frontend", error);
        }
    }

    const CheckIsAdmin = async (team) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/yourTeam/CheckAdminOrNot/${team.Admin._id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to check if user is Admin');
            }
            const data = await response.json();
            setIsAdmin(data);
        } catch (error) {
            console.error("Failed to check current user is Admin or not", error);
        }
    };

    const handleClick = async (e, relatedTeam) => {
        e.preventDefault();
        if (!task.title || !task.description || !task.deadline || !task.startDate) {
            toast.error("Please fill in all fields before submitting.");
            return;
        }

        try {
            await createTasks(relatedTeam);
            setIsOpenForm(false);
            setTask(defaultTaskState);
        } catch (error) {
            toast.error("Failed to create task. Please try again.");
            console.error("Error creating task:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "deadline" || name === "startDate") {
            const [year, month, day] = value.split("-");
            formattedValue = `${day}-${month}-${year}`;
        }

        setTask((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));
    };

    const handleRemoveStage = (index) => {
        setFadeOutIndex(index);
        setTimeout(() => {
            setTask(prev => ({
                ...prev,
                stages: prev.stages.filter((_, i) => i !== index),
            }));
            setFadeOutIndex(null);
        }, 300);
    };

    const getUsers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/users/getAllUsers", {
                method: "GET",
                headers: { "Content-type": "application/json" },
            })
            if (!response.ok) {
                throw new Error(`Http error! Status:${response.status}`);
            }
            const data = await response.json();
            const userOptions = data.map((user) => ({
                value: user._id,
                label: user.name,
            }));

            setUsers(userOptions);
        } catch (error) {
            console.log(error);
            setUsers([]);
        }
    }

    const createTasks = async (relatedTeam) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/tasks/createtask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    stages: task.stages,
                    startDate: task.startDate,
                    deadline: task.deadline,
                    progress: task.progress,
                    status: "ongoing",
                    relatedTeam: relatedTeam
                }),
            })
            if (response.ok) {
                toast.success("Task Created Successfully");
            }
            else {
                const data = await response.json();
                toast.error(data.message || "Task not created")
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        getUsers();
        fetchTeams();
    }, []);

    return (
        <motion.div className='text-white flex flex-row h-screen w-full bg-gray-900'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>

            <div className='rounded-lg bg-gray-900 w-full h-full m-2 flex flex-col shadow-xl p-6 overflow-hidden'>
                <div className="flex justify-between items-center mb-4">
                    <motion.h1 className="text-3xl font-semibold text-white" whileHover={{ scale: 1.05 }}>Your Teams</motion.h1>

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            className="pl-10 pr-4 py-2 w-full rounded-2xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => { setSearch(e.target.value) }}
                        />
                    </div>
                </div>

                <hr className='text-gray-500 mb-4' />

                <div className='flex-1 min-h-0 overflow-y-auto'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
                        {teams.filter(team => team?.Team_name?.toLowerCase().includes(search.toLowerCase())).map((team, index) => (
                            <motion.div
                                key={index}
                                className="relative border-2 rounded-lg bg-gradient-to-br from-[#2A2D32] to-[#1F2225] p-6 flex flex-col shadow-lg min-h-60 cursor-pointer space-y-2"
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => { fetchParticularTeam(team) }}
                            >
                                {/* User-specific notification indicator */}
                                {userNotifications[team._id] && (
                                    <motion.div
                                        className="absolute -top-2 -right-2"
                                        animate={{ 
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 10, -10, 0],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{ 
                                            duration: 1.5, 
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }}
                                    >
                                        <div className="relative">
                                            <Bell 
                                                size={24} 
                                                className="text-yellow-400 fill-yellow-400/20" 
                                                strokeWidth={2}
                                            />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                                                <span>!</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* <div className="absolute -top-2 -right-2">
                                    <NotificationBadge 
                                        userId={localStorage.getItem('userId')}
                                        customFilter={{ team: team._id }}
                                        size="sm"
                                    />
                                </div> */}

                                <h1 className='text-xl text-center font-bold text-white'>{team.Team_name}</h1>
                                <p className='text-gray-300'>{team.description}</p>
                                <p className='text-blue-300'><strong>Admin:</strong> {team.Admin.name}</p>

                                <div className="relative group">
                                    <div className="flex mt-2">
                                        {team.members.slice(0, 3).map((member, idx) => (
                                            <img
                                                key={member._id}
                                                src={member.profilePicture}
                                                alt={member.name}
                                                className={`w-8 h-8 rounded-full object-cover border-2 border-gray-600 ${idx !== 0 ? "-ml-3" : ""}`}
                                            />
                                        ))}
                                        {team.members.length > 3 && (
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-700 text-xs text-white rounded-full border-2 border-gray-600 -ml-3">
                                                +{team.members.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute z-10 hidden group-hover:block bg-gray-800 p-2 rounded shadow-lg text-xs">
                                        {team.members.map(m => m.name).join(', ')}
                                    </div>
                                </div>

                            </motion.div>
                        ))}
                    </div>
                </div>

                {ShowTeam && Team && Team.team && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'>
                        <div className='w-[90%] max-w-3xl max-h-[90vh] bg-[#2A2D32] p-6 rounded-lg shadow-lg overflow-y-auto'>
                            <div className="relative bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                    {/* User-specific notification in team modal */}
                                    {/* {userNotifications[Team.team._id] && (
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="relative"
                                            
                                        >
                                            <Bell 
                                                size={28} 
                                                className="text-yellow-400 fill-yellow-400/20 cursor-pointer" 
                                                strokeWidth={2}
                                            />
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                                                <span>!</span>
                                            </div>
                                        </motion.div>
                                    )} */}

                                    <NotificationBadge 
                                        // userId={localStorage.getItem('userId')}
                                        customFilter={{ team: Team.team._id }}
                                        size="md"
                                    />
                                    <button
                                        className='text-gray-400 hover:text-white transition-colors'
                                        onClick={() => setShowTeam(false)}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <h1 className="text-3xl font-bold text-center text-blue-400">{Team.team.Team_name}</h1>
                                <p className="text-center text-gray-300 mt-2">Admin: {Team.team.Admin.name}</p>
                            </div>

                            {/* Team Members */}
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
                                <h2 className="text-2xl font-semibold text-blue-400 mb-4">Team Members</h2>
                                <div className="flex flex-wrap gap-2">
                                    {Team.team.members.map((member, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-full">
                                            <img
                                                src={member.profilePicture}
                                                alt={member.name}
                                                className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
                                            />
                                            <span className="text-sm">{member.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* {console.log(isAdmin," jhkjhkjdh ", isOpenForm)} */}
                            {isAdmin && (!isOpenForm ? (
                                <div className='w-full bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer flex justify-center items-center text-lg space-x-2 mb-4 hover:bg-gray-700 transition-colors'
                                    onClick={() => { setIsOpenForm(true) }}>
                                    <PlusCircle size={30} className="hover:scale-110 transition-transform" />
                                    <p>Assign Tasks</p>
                                </div>
                            ) : (
                                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4'>
                                    <div className="relative bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                        <button
                                            className='absolute top-4 right-4 text-gray-400 hover:text-white'
                                            onClick={() => setIsOpenForm(false)}
                                        >
                                            <X size={24} />
                                        </button>
                                        
                                        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Create New Task</h2>
                                        
                                        <form className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={task.title}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    placeholder="Task title"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium mb-1">Description</label>
                                                <textarea
                                                    name="description"
                                                    value={task.description}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                                                    placeholder="Task description"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                                    <input
                                                        type="date"
                                                        name="startDate"
                                                        id="startDate"
                                                        // value={task.startDate}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Deadline</label>
                                                    <input
                                                        type="date"
                                                        id="deadline"
                                                        name="deadline"
                                                        // value={task.deadline}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    />
                                                    {/* <input 
                                                            type="date" 
                                                            id="deadline" 
                                                            name="deadline" 
                                                            className="w-full h-10 px-3 rounded-md bg-transparent border border-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            onChange={handleChange} 
                                                        /> */}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium">Stages</label>
                                                
                                                {task.stages.length > 0 && (
                                                    <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                                                        {task.stages.map((stage, index) => (
                                                            <div 
                                                                key={index} 
                                                                className={`p-3 bg-gray-700 rounded-lg flex justify-between items-center ${fadeOutIndex === index ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                                                            >
                                                                <div>
                                                                    <p className="font-medium">{stage.title}</p>
                                                                    <p className="text-xs text-gray-400">
                                                                        Members: {stage.members.map(m => m.label).join(', ')}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveStage(index)}
                                                                    className="text-red-400 hover:text-red-600"
                                                                >
                                                                    <X size={18} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <div className="border border-gray-600 rounded-lg p-4">
                                                    <div className="flex gap-3 mb-3">
                                                        <input
                                                            type="text"
                                                            value={stage.title}
                                                            onChange={(e) => setStage(prev => ({...prev, title: e.target.value}))}
                                                            className="flex-1 px-3 py-2 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                            placeholder="Stage title"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                            if (stage.title.trim() && stage.members.length > 0) {
                                                                setTask(prev => ({
                                                                ...prev,
                                                                stages: [...prev.stages, { 
                                                                    no: count, 
                                                                    title: stage.title.trim(), 
                                                                    members: stage.members 
                                                                }]
                                                                }));
                                                                setCount(prev => prev + 1);
                                                                setStage({ title: "", members: [] });
                                                            }
                                                            }}
                                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                                        >
                                                            Add Stage
                                                        </button>
                                                    </div>

                                                    <Select
                                                        isMulti
                                                        options={users}
                                                        value={stage.members}
                                                        onChange={(selected) => setStage(prev => ({...prev, members: selected}))}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        placeholder="Select members for this stage"
                                                        styles={{
                                                            control: (provided) => ({
                                                                ...provided,
                                                                backgroundColor: '#374151',
                                                                borderColor: '#4B5563',
                                                                minHeight: '42px'
                                                            }),
                                                            menu: (provided) => ({
                                                                ...provided,
                                                                backgroundColor: '#374151',
                                                            }),
                                                            option: (provided, state) => ({
                                                                ...provided,
                                                                backgroundColor: state.isSelected ? '#1E40AF' : '#374151',
                                                                ':hover': {
                                                                    backgroundColor: '#4B5563',
                                                                },
                                                            }),
                                                            multiValue: (provided) => ({
                                                                ...provided,
                                                                backgroundColor: '#1E40AF',
                                                            }),
                                                            multiValueLabel: (provided) => ({
                                                                ...provided,
                                                                color: 'white',
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsOpenForm(false);
                                                        setTask(defaultTaskState);
                                                    }}
                                                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    onClick={(e) => handleClick(e, Team.team._id)}
                                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                                                >
                                                    Create Task
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ))}

                            {/* Completed Tasks */}
                            {/* <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-green-400 mb-4">Completed Tasks</h2>
                                {Team.completedTasks && Team.completedTasks.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {Team.completedTasks.map((task, index) => (
                                            <div key={index} className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                                                {task}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400">No completed tasks yet.</p>
                                )}
                            </div> */}

                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-green-400 mb-4">Completed Tasks</h2>
                            {Team?.completedTasks?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Team.completedTasks.map((task) => (
                                    <div 
                                    key={task._id} 
                                    className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                    <h3 className="font-medium text-white">{task.title}</h3>
                                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                                        <span>{task.stages?.length || 0} stages</span>
                                        <span>{task.progress}%</span>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <p className="text-gray-400">No completed tasks yet.</p>
                            )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default YourTeams;




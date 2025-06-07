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
    const [teamUsers,setTeamUsers] = useState([]);
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

    const BASE_URL = "https://researchub-pbl.onrender.com"


    useEffect(() => {
        getUsers();
        fetchTeams();
    }, []);

    const checkForNotifications = async (teamId) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${BASE_URL}/api/notification/userUnread/${teamId}`, {
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
            const response = await fetch(`${BASE_URL}/api/yourTeam/getYourTeams`, {
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
            const response = await fetch(`${BASE_URL}/api/yourTeam/getParticularTeam/${team._id}`, {
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
            const response = await fetch(`${BASE_URL}/api/yourTeam/CheckAdminOrNot/${team.Admin._id}`, {
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
            const response = await fetch(`${BASE_URL}/api/users/getAllUsers`, {
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
    const getUsersRelatedToTeam = async () => {
        try {
            const teamId = Team.team._id;
            const response = await fetch(`${BASE_URL}/api/yourTeam/getUsersRealtedToTeam/:${teamId}`, {
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

            setTeamUsers(userOptions);
        } catch (error) {
            console.log(error);
            setUsers([]);
        }
    }

    const createTasks = async (relatedTeam) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/api/tasks/createtask`, {
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
        <motion.div className='text-white flex flex-col h-[calc(100vh-3rem)] sm:h-full w-full bg-gray-900 p-2 sm:p-4'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>

                <div className='sticky top-0 z-30 bg-gray-900 pb-2'>
                    <div className="flex justify-between items-center mb-4 sticky">
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
                </div>

                <div className='flex-1 min-h-0 overflow-y-auto'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
                        {teams.filter(team => team?.Team_name?.toLowerCase().includes(search.toLowerCase())).map((team, index) => (
                            <motion.div
                                key={index}
                                className="relative border-2 rounded-lg bg-gradient-to-br from-[#2A2D32] to-[#1F2225] p-6 flex flex-col shadow-lg min-h-60 cursor-pointer space-y-2"
                                whileHover={{ y: -5, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => { fetchParticularTeam(team);}}
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
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm'>
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
                            
                            {isAdmin && (!isOpenForm ? (
                                <div className='w-full bg-gray-800 p-6 rounded-lg shadow-lg cursor-pointer flex justify-center items-center text-lg space-x-2 mb-4 hover:bg-gray-700 transition-colors'
                                    onClick={() => { setIsOpenForm(true);}}>
                                    <PlusCircle size={30} className="hover:scale-110 transition-transform" />
                                    <p>Assign Tasks</p>
                                </div>
                            ) : (
                                <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-opacity-10 p-4'>
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
                                                            Add
                                                        </button>
                                                    </div>
                                                    <Select
                                                    isMulti
                                                    options={Team.team.members.map((member) => ({
                                                        label: member.name,
                                                        value: member._id,
                                                        profilePicture: member.profilePicture,
                                                    }))}
                                                    value={stage.members}
                                                    onChange={(selected) => setStage(prev => ({ ...prev, members: selected }))}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    placeholder="Select members for this stage"
                                                    styles={{
                                                        control: (provided) => ({
                                                        ...provided,
                                                        backgroundColor: '#374151',
                                                        borderColor: '#4B5563',
                                                        minHeight: '42px',
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
        </motion.div>
    )
}

export default YourTeams;




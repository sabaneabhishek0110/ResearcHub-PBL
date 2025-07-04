import React, { useState,useEffect } from 'react'
import Select from 'react-select';
import toast from 'react-hot-toast';
import {Search,Paperclip,RefreshCcw} from 'lucide-react'
import {motion } from 'framer-motion' 
import { useNavigate } from 'react-router-dom';
import TaskDrawer from '../Components/TaskDrawer';

function To_Do_List() {
  const [task,settask] = useState({
    title:"",
    description:"",
    stages:[],
    deadline:"",
    progress:0,
  })

  const [Ongoing,setOngoing] = useState([]);
  const [Completed,setCompleted] = useState([]);
  const [Upcoming,setUpcoming] = useState([]);
  const [teams,setTeams] = useState(null);
  const [selectedTeam,setSelectedTeam] = useState('');
  const [showAllTasks,setShowAllTasks] = useState(true);
  const [search,setSearch] = useState("");
  const [selectedTask,setSelectedTask] = useState(null);
  const [showDrawer,setShowDrawer] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = "https://researchub-pbl.onrender.com"
  
  const fetchTeams = async() =>{
    try{
      const token = localStorage.getItem("token");
      console.log("entered in fetchTeams in To_Do_List.jsx");
      const response = await fetch(`${BASE_URL}/api/yourTeam/getYourTeams`,{
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json',
          Authorization : `Bearer ${token}`,
        }
      });

      if(!response.ok){
        throw new Error('failed to fetch teams');
      }
      const data = await response.json();

      console.log("Your Teams : ",data);
      setTeams(data);

      console.log("completed fetchTeams successfully in To_Do_List.jsx");
    }
    catch(error){
      console.log("failed to fetch teams in To_Do_List.jsx");
    }
  }    

  const fetchUserTasks = async () => {
    console.log(selectedTeam);
    if(!selectedTeam){ return;}
    try{
      const token = localStorage.getItem("token");
      console.log("entered in fetchUserTasks in To_Do_List.jsx");
      console.log(selectedTeam);
      const response = await fetch(`${BASE_URL}/api/tasks/getUserTasks/${selectedTeam}`,{
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json',
          Authorization : `Bearer ${token}`,
        }
      });

      if(!response.ok){
        throw new Error('failed to fetch User Tasks');
      }
      const data = await response.json();

      console.log("User Tasks : ",data);
      setOngoing(data.Ongoing);
      setCompleted(data.Completed);
      setUpcoming(data.Upcoming);

      console.log("completed fetchUserTasks successfully in To_Do_List.jsx");
    }
    catch(error){
      console.log("failed to fetch tasks in To_Do_List.jsx");
    }
  }


  const fetchAllTasks = async () => {
    if(!selectedTeam){ return;}
    try{
      const token = localStorage.getItem("token");
      console.log("entered in fetchAllTasks in To_Do_List.jsx");
      console.log(selectedTeam);
      const response = await fetch(`${BASE_URL}/api/tasks/getAllTasks/${selectedTeam}`,{
        method : 'GET',
        headers : {
          'Content-Type' : 'application/json',
          Authorization : `Bearer ${token}`,
        }
      });

      if(!response.ok){
        throw new Error('failed to fetch All Tasks');
      }
      const data = await response.json();

      console.log("All Tasks : ",data);
      setOngoing(data.Ongoing);
      setCompleted(data.Completed);
      setUpcoming(data.Upcoming);

      console.log("completed fetchAllTasks successfully in To_Do_List.jsx");
    }
    catch(error){
      console.log("failed to fetch tasks in To_Do_List.jsx");
    }
  }


  const CustomWindow = ({selectedTask,onClose}) => {

    return (
      <div className="p-4 bg-gray-900 text-white rounded-md shadow-lg w-96">
        {/* Task Title and Description */}
        <h2 className="text-xl font-semibold">{selectedTask.title}</h2>
        <p className="text-gray-400">{selectedTask.description}</p>

        {/* Stages Section */}
        <div className="mt-4">
          <p className="font-semibold text-gray-300">Stages:</p>
          <div className="space-y-3">
            {selectedTask?.stages?.map((stage, index) => (
              <div key={index} className="bg-gray-800 p-3 rounded-md shadow-md">
                <p className="text-lg font-medium">{stage.title}</p>

                {/* Assigned Members */}
                <div className="flex items-center space-x-2 mt-2">
                  {stage.members.map((member, key) => (
                    <img
                      key={key}
                      src={member.profilePicture}
                      alt="Member"
                      title={member.name}
                      className="w-6 h-6 rounded-full border border-gray-600"
                    />
                  ))}
                </div>

                {/* Attachment & Update Buttons */}
                {(selectedTask.status=="ongoing") && 
                  <div className="flex justify-between items-center mt-3">
                    <Paperclip size={20} className="text-gray-400 cursor-pointer hover:text-white" />
                    <button className="p-2 bg-blue-500 rounded-md text-white hover:bg-blue-600 flex items-center space-x-1">
                      <RefreshCcw size={18} />
                      <span>Update</span>
                    </button>
                  </div>
                }
                
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };


  const UpdateProgress = async (taskToUpdate,stage) =>{
    try{
      const token = localStorage.getItem("token");
      const response1 = fetch(`${BASE_URL}/api/users/getUser`,{
        method : "GET",
        headers : {
          'Content-Type' : 'application/json',
          "Authorization" : `Bearer ${token}`
        }
      })

      if(!response1.ok){
        console.log("failed to get user");
      }
      console.log("gdgfdf : ",response1.json());
      const data = response1.json();
      const user = data._id;
      console.log("Entered in UpdateTaskProgress in To_Do_List.jsx");

      const isAuthorized = taskToUpdate.assignedMembers.some(member=>member._id===user);

      if (!isAuthorized) {
        return;
      }

      const newProgress = prompt("Enter new progress (0-100):");
      if (newProgress === null || newProgress.trim() === "" || isNaN(newProgress)) {
        toast.error("Enter a valid numeric progress!");
        return;
      }
      const updatedProgress = Number(newProgress);
      setOngoing((prevOngoing) =>
        prevOngoing.map((task) =>
          task === taskToUpdate ? { ...task, progress: Number(newProgress) } : task
    )
  );
  if(updatedProgress){
    const response = fetch(`${BASE_URL}/api/task/updateProgress`,{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json',
        Authorization : `Bearer ${token}`,
      },
      body : JSON.stringify({task : taskToUpdate,stage : stage})
    })
    console.log(response);
    if(!response.ok){
      toast.error("Task Progress Not Upadated");
      return;
    }
    const data = await response.json();
    console.log("Completed UpdateTaskProgress successfully in To_Do_List.jsx"); 
    toast.success("Task Progress get Updated");
  }
}
catch(error){
      console.log("Failed to update task progress");
    }
  }


  function handleCompleted() {
    let completedTasks = [];
  
    setOngoing((prev) => {
      const remainingTasks = prev.filter((currTask) => {
        if (currTask.progress === 100) {
          completedTasks.push({
            title: currTask.title,
            description: currTask.description,
            members: currTask.members,
          });
          return false; // Remove from Ongoing
        }
        return true;
      });
  
      return remainingTasks; // Update Ongoing state
    });

    if (completedTasks.length > 0) {
      setTimeout(() => {
        setCompleted((prevCompleted) => [...prevCompleted, ...completedTasks]);
      }, 0); // Using setTimeout to ensure batching is complete
    }
  }


  function handleCompleted() {
    const completedTasks = Ongoing.filter((task) => task.progress === 100);
    const remainingTasks = Ongoing.filter((task) => task.progress !== 100);

    setOngoing(remainingTasks);
    setCompleted((prevCompleted) => [...prevCompleted, ...completedTasks]);
  }
  
  useEffect(()=>{
    fetchTeams();
  },[]);

  useEffect(()=>{
    if(selectedTeam){
      console.log("showAllTasks : ",showAllTasks);
      showAllTasks?fetchAllTasks() : fetchUserTasks();
    }
  },[showAllTasks,selectedTeam]);


  useEffect(()=>{
    setShowDrawer(true);
    console.log("showDrawer : ",showDrawer)
  },[selectedTask]);


  return (
    <motion.div 
      className='flex flex-col w-full h-screen overflow-hidden p-2 sm:p-4 bg-gray-900 rounded-lg'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header and filters */}
      <div className='shrink-0'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4'>
          <motion.h1 className='text-3xl font-semibold text-white' whileHover={{ scale: 1.05 }}>
            Tasks
          </motion.h1>
          <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
            <select
              className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="" disabled>Select Team</option>
              {teams?.length > 0 ? (
                teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.Team_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No Teams Available</option>
              )}
            </select>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search" 
                value={search}
                className="pl-10 pr-4 py-2 w-full rounded-2xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e)=>{setSearch(e.target.value)}}
              />
            </div>
          </div>
        </div>

        <hr className='text-gray-500 mb-4' />

        {/* Radio Filter */}
        <div className='flex flex-wrap gap-4 mb-4'>
          <label className='text-white flex items-center gap-2'>
            <input type='radio' name='taskFilter' value='all' className='accent-blue-500' defaultChecked onChange={()=>{setShowAllTasks(true)}}/>
            All Tasks
          </label>
          <label className='text-white flex items-center gap-2'>
            <input type='radio' name='taskFilter' value='my' className='accent-blue-500' onChange={()=>{setShowAllTasks(false)}}/>
            My Tasks
          </label>
        </div>
      </div>

      {/* Scrollable Grid Area */}
      <div className="flex-grow overflow-hidden">
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 h-full'>
          {[{ label: "On Going", color: "text-blue-400", data: Ongoing },
            { label: "Completed", color: "text-green-400", data: Completed },
            { label: "Upcoming", color: "text-yellow-400", data: Upcoming }]
            .map(({ label, color, data }, idx) => (
            <div 
              key={idx} 
              className='bg-gray-800 px-4 pb-4 rounded-lg flex flex-col h-full overflow-y-auto scrollbar-hide'
            >
              <div className='sticky top-0 bg-gray-800 z-10 pt-4'>
                <h2 className={`text-lg font-semibold ${color} mb-3 `}>
                  {label} ({data.length})
                </h2>
              </div>
              <div className='space-y-3'>
                {data.filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
                  .map((task, index) => (
                    <div 
                      key={index} 
                      className='bg-gray-600 p-3 rounded-md shadow-md text-white cursor-pointer' 
                      onClick={() => {
                        setSelectedTask(() => task);
                        setTimeout(() => setShowDrawer(true), 0);
                      }}
                    >
                      <h3 className='text-lg font-semibold'>{task.title}</h3>
                      <p className='text-md text-gray-400'>{task.description}</p>
                      <div className='text-sm text-gray-500 flex space-x-2'>
                        <p>{task.startDate ? "StartDate" : "Deadline"}:</p> 
                        <div className='flex space-x-1'>
                          <p>{new Date(task.startDate || task.deadline).toLocaleDateString('en-US', { month: "long" })}</p>
                          <p>{new Date(task.startDate || task.deadline).getDate()} ,</p>
                          <p>{new Date(task.startDate || task.deadline).getFullYear()}</p>
                        </div>
                      </div>
                      {task.startDate && (
                        <div className='text-sm text-gray-500 flex space-x-2'>
                          <p>Deadline:</p> 
                          <div className='flex space-x-1'>
                            <p>{new Date(task.deadline).toLocaleDateString('en-US', { month: "long" })}</p>
                            <p>{new Date(task.deadline).getDate()} ,</p>
                            <p>{new Date(task.deadline).getFullYear()}</p>
                          </div>
                        </div>
                      )}
                      <div className='mt-2 flex items-center space-x-2'>
                        <div className='relative w-full h-2 bg-gray-700 rounded-full'>
                          <div className='h-2 bg-blue-500 rounded-full' style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <p>{task.progress}%</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drawer */}
      {showDrawer && selectedTask && (
        <div className='fixed inset-0 flex items-center justify-center bg-opacity-100 backdrop-blur-xs z-50'>
          <TaskDrawer selectedTask={selectedTask} selectedTeam={selectedTeam} onClose={() => setShowDrawer(false)} />
        </div>
      )}
    </motion.div>
  )
}

export default To_Do_List
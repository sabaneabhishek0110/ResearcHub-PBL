import React,{useEffect,useState} from 'react'
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { PlusCircle,Search} from 'lucide-react'
import {motion} from 'framer-motion'

function Dashboard() {

  const [Project,setProject] = useState({
    Team_name : "",
    description: "",
    members : [],
    Admin : ""
  });

  const BASE_URL = "https://researchub-pbl.onrender.com";

  const [showForm,setShowForm] = useState(false);
  const [cancelForm,setCancelForm] = useState(false);
  const [AllProjects,setAllProjects] = useState([]);

  const [search,setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {  
          localStorage.setItem("token", token);
          toast.success("You are logged in...");
          navigate("/dashboard", { replace: true }); 
      }
  }, []);
  
  
  const createTeam = async () =>{
    try{
      const token = localStorage.getItem("token");
      console.log("Entered into createTeam in DashBoard at Frontend");
      
      const response = await fetch(`${BASE_URL}/api/dashboard/createTeam`,{
        method : 'POST',
        headers : {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...Project, Admin: localStorage.getItem("userId") }),
      })

      if (!response.ok) {
        throw new Error("Failed to create team");
      }

      const data = await response.json();
      return data;
    }
    catch(error){
      console.error(error.message);
      return null;
    }
  }

  const fetchTeams = async () =>{
    try{
      const token = localStorage.getItem('token');
      console.log("Token before fetch:", token);
      const response = await fetch(`${BASE_URL}/api/dashboard/getAllTeams`,{
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
      setAllProjects(data);
    }
    catch(error){
      console.error("Error in fetchTeams in Frontend",error);
    }
  }

  const sendRequest = async (team_Id) =>{
    try{
      console.log("Entered in sendRequest in DashBoard.jsx");
      
      const token = localStorage.getItem("token");
      console.log(token);

      const selectedTeam = AllProjects.find(team => team._id === team_Id);

      if(!selectedTeam){
        console.error("failed to find team in Allprojects in DashBoard.jsx");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/notification/addRequest`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Bearer ${token}`
        },
        body : JSON.stringify({"Admin" : selectedTeam.Admin,"Team_Id" : selectedTeam._id})
      })

      if(!response.ok){
        throw new Error("Request Not sent successfully");
      }

      const data = await response.json();
      toast.success("Join Request Sent Successfully");

      console.log("Completed sendRequest in DashBoard.jsx");
    }
    catch(error){
      console.error(error.message);
    }
  }

  const handleCreateTeam = async (e) =>{
    e.preventDefault();
    if(!Project.Team_name || !Project.description){
      toast.error("Fill all the details");
      return;
    }
    const response = await createTeam();
    if(response){
      fetchTeams();
      setAllProjects((prev)=>[...prev,{...Project}]);
      setProject({
        Team_name : "",
        description : "",
        Admin:localStorage.getItem('userId'),
        members:[],
      })
      setShowForm((prev) => !prev);
    }
  }

  useEffect(()=>{
    fetchTeams();
  },[]);

  const handleChange = (e) =>{
    const {name,value} = e.target;
    setProject((prev)=>({...prev,[name]:value}))
  }

  return (
  <motion.div
      className="text-white flex flex-col h-[calc(100vh-3rem)] sm:h-full w-full bg-gray-900 p-2 sm:p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Fixed Top Section */}
      <div className="sticky top-0 z-30 bg-gray-900 pb-2">
        {/* Top Bar */}
        <div className="flex md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <motion.h1 className="text-2xl sm:text-3xl font-semibold text-white" whileHover={{ scale: 1.05 }}>
            Dashboard
          </motion.h1>
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              value={search}
              className="pl-10 pr-4 py-2 w-full rounded-2xl bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <hr className="text-gray-600 mb-2" />

        {/* Create Button */}
        <div className="w-full flex items-center justify-center mb-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-all"
          >
            <PlusCircle size={40} className="hover:scale-110 transition-transform" />
            <span className="text-lg font-medium">Create Team</span>
          </button>
        </div>
      </div>

      {/* Scrollable Team Cards Section */}
      <div className="flex-grow overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 sm:p-4">
        {AllProjects.length > 0 ? (
          AllProjects.filter(team => team.Team_name.toLowerCase().includes(search.toLowerCase())).map((team) => (
            <div
              key={team._id}
              className="border-2 rounded-lg bg-gradient-to-br from-[#2A2D32] to-[#1F2225] p-6 flex flex-col min-h-70 max-h-80 shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1"
            >
              <h1 className="text-xl text-center font-bold text-white mb-2">{team.Team_name}</h1>
              <p className="text-gray-300">{team.description}</p>
              <p className="text-gray-400 mt-2">
                <strong>Admin :</strong> {team.Admin.name}
              </p>

              {team.members?.length > 0 && (
                <div className="flex mt-4 items-center flex-wrap gap-2">
                  <span className="text-gray-400"><strong>Members :</strong></span>
                  {team.members.slice(0, 1).map((member, index) => (
                    <img
                      key={member._id}
                      src={member.profilePicture}
                      alt={member.name}
                      title={member.name}
                      className={`w-10 h-10 rounded-full object-cover border-2 border-gray-600 ${index === 0 ? "ml-0" : "-ml-4"}`}
                    />
                  ))}
                  {team.members.length > 1 && (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white text-sm font-medium rounded-full border-2 border-gray-600 -ml-3">
                      +{team.members.length - 1}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-auto flex justify-center">
                <button
                  onClick={() => sendRequest(team._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all"
                >
                  Join Team
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex items-center justify-center text-2xl text-gray-500">
            <p>No Research Teams Available</p>
          </div>
        )}
      </div>

      {/* Create Team Form Modal */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="w-[90%] max-w-lg bg-gray-900 p-6 rounded-lg shadow-lg transform transition-all scale-100">
            <h2 className="text-white font-bold text-xl mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="flex flex-col space-y-4">
              <label htmlFor="Team_name" className="text-white font-medium">Team Name</label>
              <input
                type="text"
                id="Team_name"
                name="Team_name"
                placeholder="Enter team name"
                onChange={handleChange}
                value={Project.Team_name}
                className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label htmlFor="description" className="text-white font-medium">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter team description"
                onChange={handleChange}
                value={Project.description}
                rows="4"
                className="p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  className="w-20 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition-all"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-20 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  </motion.div>
);

};

export default Dashboard;
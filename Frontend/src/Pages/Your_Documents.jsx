import React,{useState,useEffect} from 'react'
import {FileText,FilePlus ,MoreVertical} from 'lucide-react';
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TeamSelector from '../Components/TeamSelector';
import ShowPropertiesOfDocument from '../Components/ShowPropertiesOfDocument';

function Your_Documents() {
    const [documents,setDocuments] = useState([]);
    const [isOpen,setIsOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [team,setTeam] = useState(null);
    const [userTeams,setuserTeams] = useState([]);
    const [openProperties,setOpenProperties] = useState(false);
    const [selectedDocument,setSelectedDocument] = useState(null);
    const navigate = useNavigate();

    const BASE_URL = "https://researchub-pbl.onrender.com"

    const fetchDocuments = async() =>{
        try{
            console.log("entered in fetchDocuments in Your_Documents.jsx");
            const token = localStorage.getItem('token');

            const response = await fetch(`${BASE_URL}/api/yourDocuments/getUserDocuments`,{
                method : 'GET',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                }
            })

            if(!response.ok){
                console.log("failed to fetch user Documents");
                return ;
            }

            const data = await response.json();
            console.log("fetched documents : ",data);
            setDocuments(data.documents);
            console.log("completed fetchDocuments successfully in Your_Documents.jsx");
        }
        catch(error){
            console.log("failed to fetch user Documents");
            console.log(error);
        }
    }

    const createDocument = async() =>{
        try{
            console.log("entered in createDocument in Your_Documents.jsx");
            const token = localStorage.getItem('token');

            const response = await fetch(`${BASE_URL}/api/yourDocuments/createDocument`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body : JSON.stringify({team : team._id})
            })

            if(!response.ok){
                console.log("failed to create Document");
                return ;
            }
            const data = await response.json();
            navigate(`/textEditor/${data.documentId}/owner`);
            
            console.log("completed createDocument successfully in Your_Documents.jsx");
        }
        catch(error){
            console.log("failed to create Document");
            console.log(error);
        }
    }

    const removeDocument = async (id) => {
      try {
        const response = await fetch(`${BASE_URL}/api/yourDocuments/removeDocument/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to remove document");
        console.log("document removed successfully ");
        fetchDocuments();
      } catch (error) {
        console.log("Error revoking access:", error);
      }
    };

    const showDocument = async(id) =>{
      try{
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/yourDocuments/getUserAccess/${id}`,{
          method : "GET",
          headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
          }
        })
        if(!response.ok){
          console.log("failed to get accessType of user");
          return;
        }
        const data = await response.json();
        const accessType = data.accessType;
        navigate(`/textEditor/${id}/${accessType}`);
        console.log("documed shown successfully");
      }
      catch(error){
        console.log("failed to show document");
        console.log(error);
        return;
      }
    }

    const fetchUserTeams = async () =>{
      try{
          console.log("khdkjfhjdh")
          const token = localStorage.getItem("token");
          const response = await fetch(`${BASE_URL}/api/yourDocuments/getUserTeams`,{
              method : "GET",
              headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
              }
            })
            if(!response.ok){
              console.log("failed to get user teams");
              return;
            }
            const data = await response.json();
            console.log("dkjhsh",data);
            setuserTeams(data);
            console.log("user teams fetched successfully");
      }
      catch(error){
          console.log("failed to fetch user teams",error);
      }
    }

    useEffect(()=>{
        fetchDocuments();
        fetchUserTeams();
    },[isOpen]);
  return (
    <motion.div
      className="flex flex-col items-center h-screen w-full bg-gray-900 p-4 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-7xl h-full rounded-lg bg-gray-900 flex flex-col shadow-xl p-2">
        <div className="sticky top-0 z-30 bg-gray-900">
          <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
            <h2 className="text-white text-2xl sm:text-3xl font-bold">Your Documents</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              onClick={() => {
                if (userTeams.length === 0) {
                  toast.error("You should join at least one team to create your document");
                  return;
                }
                setIsOpen(true);
              }}
            >
              <FilePlus size={20} />
              <span className="text-white hidden sm:block">Create New</span>
            </button>
          </div>
          <hr className="border-gray-700 mb-6" />
        </div>

        {documents?.length > 0 ? (
          <div className="text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((document) => (
              <div
                key={document._id}
                onClick={() => showDocument(document._id)}
                className="relative flex justify-between items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition cursor-pointer shadow-lg"
              >
                <div className="flex flex-row space-x-2 items-center w-full">
                  <FileText size={24} className="text-gray-400 shrink-0" />
                  <p className="truncate w-full text-lg">{document.title}</p>
                </div>

                <div className="relative shrink-0">
                  <button
                    className="cursor-pointer hover:bg-gray-700 p-1 border border-transparent rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(prev => (prev === document._id ? null : document._id));
                    }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openMenuId === document._id && (
                    <div
                      className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDocument(document._id);
                          setOpenMenuId(null);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenProperties(true);
                          setSelectedDocument(document._id);
                          setOpenMenuId(null);
                        }}
                      >
                        Properties
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FileText size={50} className="mb-4" />
            <p className="text-lg">No Documents Available</p>
          </div>
        )}
      </div>

      {openProperties && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ShowPropertiesOfDocument
            onClose={() => setOpenProperties(false)}
            documentId={selectedDocument}
          />
        </div>
      )}

      {isOpen && (
        <TeamSelector
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          teams={userTeams}
          team={team}
          setTeam={setTeam}
          onDone={() => {
            if (!team) {
              toast.error("Please select a team");
              return;
            }
            createDocument();
            setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </motion.div>
  )
}

export default Your_Documents
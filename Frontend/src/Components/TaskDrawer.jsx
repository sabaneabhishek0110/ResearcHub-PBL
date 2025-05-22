// import React,{useState,useEffect} from 'react';
// import Delete from '../Components/Delete';
// import { Paperclip, RefreshCcw,X,MoreVertical } from 'lucide-react';
// import UploadWindow from '../Components/upLoadWindow';

// function TaskDrawer({ selectedTask , selectedTeam,onClose}) {
//   if (!selectedTask) return null; // Prevent errors if no task is selected
//   const [isOpen , setIsOpen]=useState(false);
//   const [openStageMenuIndex, setOpenStageMenuIndex] = useState(null);
//   const [isOpenDeleteStage , setIsOpenDeleteStage]=useState(false);
//   const [showUploadWindow, setShowUploadWindow] = useState(false);
//   const [teamDocuments, setTeamDocuments] = useState([]);
//   const [uploadingStageIndex, setUploadingStageIndex] = useState(null);

//   const fetchUserDocOfTeam = async () =>{
//     try{
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:5000/api/yourDocuments/getUserDocumentRelatedToTeam/${selectedTeam}`,{
//         method : "GET",
//         headers : {
//           "Content-Type" : "application/json",
//           "Authorization" : `Bearer ${token}`
//         }
//       })
//       if(!response.ok){
//         console.log("failed to fetch user documents related to team");
//         return;
//       }
//       const data = await response.json();
//       // console.log(data);
//       setTeamDocuments(data.documents);
//       console.log("User documents related to team fetched successfully");
//     }
//     catch(error){
//       console.log("failed to fetch document of user related to team",error);
//     }
//   }

//   const handleUploadComplete = (file) => {
//     // Handle the uploaded file
//     console.log('Uploaded file:', file);
//   };

//   const handleTeamDocSelect = (document) => {
//     // Handle selected team document
//     console.log('Selected team document:', document);
//   };

//   const deleteTask = async() =>{
//     try{
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/tasks/deleteTask",{
//         method : "PUT",
//         headers : {
//           "Content-Type" : "application/json",
//           "Authorization" : `Bearer ${token}`,
//         },
//         body : JSON.stringify({task : selectedTask}) 
//       })

//       if(!response.ok){
//         console.log("failed to delete task");
//         return ;
//       }
//       toast.success("task deleted successfully");
//       onClose();
//     }
//     catch(error){
//       console.log("failed to delete task");
//       console.log(error);
//     }
//   }
//   useEffect(()=>{
//     if (selectedTeam) fetchUserDocOfTeam();
//   },[selectedTeam]);

//   return (
//     <div className="p-4 bg-gray-900 text-white rounded-md shadow-lg w-[80%] relative">
      
//       <button className='absolute right-1 top-1 text-gray-400' onClick={onClose}>
//         <X size={20} />
//       </button>

      
//       <div className='flex flex-row items-start justify-between'>
//         <div>
//           <h2 className="text-xl font-semibold">{selectedTask?.title}</h2>
//           <p className="text-gray-400">{selectedTask?.description}</p>
//         </div>

//         <div className='relative mt-1'>
//           <MoreVertical size={20} className='cursor-pointer text-white hover:text-gray-600'
//             onClick={() => setIsOpen(true)}
//             />

//           {isOpen && (
//             <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg">
//               {/* <Delete 
//                 onClick={() => setIsOpen(false) }
//               /> */}
//               <button className="w-full text-left px-4 py-2 cursor-pointer" onClick={() => setIsOpen(false) }>
//                   Delete
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Stages Section */}
//       <div className="mt-4">
//         <p className="font-semibold text-gray-300 mb-4">Stages:</p>
//         <div className="space-y-3">
//           {selectedTask?.stages?.length > 0 ? (  selectedTask?.stages?.map((stage, index) => (

//             <div key={index} className="bg-gray-800 p-4 rounded-md shadow-md">
//               {/* Stage Title & Actions */}
//               <div className="flex justify-between items-center">
//                 <p className="text-lg font-medium text-white">{stage?.title}</p>

//                 {/* Attachment & Update Buttons (Shown for Ongoing Tasks) */}
//                 {selectedTask?.status === "ongoing" && (
//                   <div className="flex items-center space-x-3">
//                     {/* Attachment Icon */}
//                     <button onClick={() => setShowUploadWindow(true)}>
//                       <Paperclip size={20} className="text-gray-400 cursor-pointer hover:text-white transition-colors"/>
//                     </button >

//                     {/* Update Button */}
//                     <button className="px-3 py-1 bg-blue-500 rounded-md text-white hover:bg-blue-600 flex items-center space-x-2 transition">
//                       <RefreshCcw size={18} />
//                       <span>Update</span>
//                     </button>
//                     <div className='relative mt-1'>
//                       <MoreVertical size={20} className='cursor-pointer text-white hover:text-gray-600'
//                         onClick={() => setIsOpenDeleteStage(true)}
//                         />

//                       {isOpenDeleteStage && (
//                         <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg">
//                           {/* <Delete 
//                             onClick={() => setIsOpen(false) }
//                           /> */}
//                           <button className="w-full text-left px-4 py-2 cursor-pointer" onClick={() => setIsOpenDeleteStage(false) }>
//                               Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Assigned Members */}
//               <div className="flex mt-2">
//                 {stage?.members.slice(0,1).map((member, key) => (
//                       <img
//                         key={key}
//                         src={member?.profilePicture} // Fallback if no image
//                         alt={member?.name || "Unknown"}
//                         title={member?.name || "No Name"}
//                         className={`w-10 h-10 rounded-full object-cover border-2 border-gray-600 ${
//                           index === 0 ? "ml-0" : "-ml-4"
//                         }`}
//                       />
//                 ))}
//                 {stage.members.length > 1 && (
//                   <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white text-sm font-medium rounded-full border-2 border-gray-600 -ml-3">
//                       +{stage.members.length - 1}
//                   </div>
//                 )}
//               </div>

//             </div>

//           ))): (
//             <p className="text-gray-500">No stages available.</p>
//           )}
//         </div>
//       </div>
//       {showUploadWindow && (
//         <UploadWindow
//           onClose={() => setShowUploadWindow(false)}
//           teamDocuments={teamDocuments}
//           onFilesSelected={handleUploadComplete}
//           onSelectTeamDocument={handleTeamDocSelect}
//         />
//       )}
//     </div>
//   );
// }

// export default TaskDrawer;
    



import React, { useState, useEffect } from 'react';
import { Paperclip, RefreshCcw, X, MoreVertical, FileText,CheckCircle,Clock} from 'lucide-react';
import UploadWindow from './UploadWindow';
import { toast } from 'react-hot-toast';

function TaskDrawer({ selectedTask, selectedTeam, onClose }) {
  // Existing state
  const [isOpen, setIsOpen] = useState(false);
  const [openStageMenuIndex, setOpenStageMenuIndex] = useState(null);
  const [isOpenDeleteStage, setIsOpenDeleteStage] = useState(false);
  const [showUploadWindow, setShowUploadWindow] = useState(false);
  const [teamDocuments, setTeamDocuments] = useState([]);
  const [uploadingStageIndex, setUploadingStageIndex] = useState(null);


  const [stageStatus, setStageStatus] = useState({});
  // New state for stage updates
  const [updateDescription, setUpdateDescription] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStageIndex, setSelectedStageIndex] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [selectedTeamDocuments, setSelectedTeamDocuments] = useState([]);

  const fetchUserDocOfTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/yourDocuments/getUserDocumentRelatedToTeam/${selectedTeam}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        console.log("Failed to fetch user documents related to team");
        return;
      }
      
      const data = await response.json();
      setTeamDocuments(data.documents);
    } catch (error) {
      console.log("Failed to fetch document of user related to team", error);
    }
  };

  const deleteTask = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tasks/deleteTask", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ task: selectedTask }) 
      });

      if (!response.ok) {
        console.log("Failed to delete task");
        return;
      }
      toast.success("Task deleted successfully");
      onClose();
    } catch (error) {
      console.log("Failed to delete task", error);
      toast.error("Failed to delete task");
    }
  };

  const handleStageUpdate = async () => {
    try {
      console.log(selectedTask._id ," ",selectedStageIndex, " ",updateDescription, " ",attachedFiles , " ",selectedTeamDocuments," ",selectedTeam);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/tasks/submitStageUpdate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: selectedTask._id,
          stageIndex: selectedStageIndex,
          description: updateDescription,
          files: attachedFiles,
          teamDocuments: selectedTeamDocuments,
          teamId: selectedTeam,
          status : "For_Approval"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit stage update");
      }

      // Update local state
      setStageStatus(prev => ({
        ...prev,
        [selectedStageIndex]: "For_Approval"
      }));

      toast.success("Stage update submitted for approval");
      setShowUpdateModal(false);
      setUpdateDescription('');
      setAttachedFiles([]);
      setSelectedTeamDocuments([]);
    } catch (error) {
      console.log("Failed to submit stage update", error);
      toast.error(error.message);
    }
  };

  const handleUploadComplete = (files) => {
    setAttachedFiles(files);
    setShowUploadWindow(false);
    setShowUpdateModal(true);
  };

  const handleTeamDocSelect = (document) => {
    setSelectedTeamDocuments([document]);
    setShowUploadWindow(false);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    if (selectedTeam) fetchUserDocOfTeam();
  }, [selectedTeam]);

  useEffect(() => {
    if (selectedTask?.stages) {
      const initialStatus = {};
      selectedTask.stages.forEach((stage, index) => {
        initialStatus[index] = stage.status || 'pending'; // Default to 'pending' if no status
      });
      setStageStatus(initialStatus);
    }
  }, [selectedTask]);

  if (!selectedTask) return null;

  return (
    <div className="p-4 bg-gray-900 text-white rounded-md shadow-lg w-[80%] relative">
      <button className='absolute right-1 top-1 text-gray-400' onClick={onClose}>
        <X size={20} />
      </button>

      <div className='flex flex-row items-start justify-between'>
        <div>
          <h2 className="text-xl font-semibold">{selectedTask?.title}</h2>
          <p className="text-gray-400">{selectedTask?.description}</p>
        </div>

        <div className='relative mt-1'>
          <MoreVertical size={20} className='cursor-pointer text-white hover:text-gray-600'
            onClick={() => setIsOpen(true)}
          />

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg">
              <button 
                className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-700"
                onClick={() => {
                  setIsOpen(false);
                  deleteTask();
                }}
              >
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stages Section */}
      <div className="mt-4">
        <p className="font-semibold text-gray-300 mb-4">Stages:</p>
        <div className="space-y-3">
          {selectedTask?.stages?.length > 0 ? (
            selectedTask.stages.map((stage, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-md shadow-md">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-white">{stage?.title}</p>

                  {selectedTask?.status === "ongoing" && (
                    // (stageStatus[index]==="Pending" || stageStatus[index]==="For_Approval")?(
                    (stage.status==="Pending" || stage.status==="For_Approval")?(
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => {
                            setUploadingStageIndex(index);
                            setSelectedStageIndex(index);
                            // setShowUploadWindow(stageStatus[index]==="Pending"?true:false);
                            setShowUploadWindow(stage.status==="Pending"?true:false)
                          }}
                          // disabled={stageStatus[index] === "For_Approval"}
                          // className={stageStatus[index] === "For_Approval" ? "opacity-50 cursor-not-allowed" : ""}
                          disabled={stage.status === "For_Approval"}
                          className={stage.status === "For_Approval" ? "opacity-50 cursor-not-allowed" : ""}
                        >
                          <Paperclip size={20} className={`text-gray-400 cursor-pointer hover:text-white transition-colors ${
                            stage.status === "For_Approval" ? "opacity-50" : ""
                          }`}/>
                        </button>


                        
                        <button 
                          className="px-3 py-1 bg-blue-500 rounded-md text-white hover:bg-blue-600 flex items-center space-x-2 transition"
                          onClick={() => {
                            setSelectedStageIndex(index);
                            setShowUpdateModal(true);
                          }}
                          // disabled={stageStatus[index]==="For_Approval"}
                          disabled={stage.status==="For_Approval"}
                        >
                          {/* {stageStatus[index] === "For_Approval" ? ( */}
                          {stage.status === "For_Approval" ? (
                            <Clock size={18} />
                          ) : (
                            <RefreshCcw size={18} />
                          )}
                          <span>Update</span>
                        </button>
                      </div>
                    ):(
                      <button 
                          className="px-3 py-1 bg-blue-500 rounded-md text-white hover:bg-blue-600 flex items-center space-x-2 transition"
                          onClick={() => {
                            disabled="true"
                          }}
                      >
                        <CheckCircle size={18} />
                        <span>Completed</span>
                      </button>
                    )
                  )}
                </div>

                {/* Assigned Members */}
                <div className="flex mt-2">
                  {stage?.members?.slice(0,1).map((member, key) => (
                    <img
                      key={key}
                      src={member?.profilePicture}
                      alt={member?.name || "Unknown"}
                      className={`w-10 h-10 rounded-full object-cover border-2 border-gray-600 ${key === 0 ? "ml-0" : "-ml-4"}`}
                    />
                  ))}
                  {stage.members?.length > 1 && (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 text-white text-sm font-medium rounded-full border-2 border-gray-600 -ml-3">
                      +{stage.members.length - 1}
                    </div>
                  )}
                </div>

                {/* Stage Updates */}
                {stage.updates?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-400 mb-1">Updates:</p>
                    <div className="space-y-2">
                      {stage.updates.map((update, updateIndex) => (
                        <div key={updateIndex} className="bg-gray-700 p-2 rounded">
                          <p className="text-xs text-gray-400">
                            {new Date(update.updatedAt).toLocaleString()} by {update.updatedBy?.name || 'User'}
                          </p>
                          <p className="text-sm text-gray-300 mt-1">{update.comments}</p>
                          {update.attachment && (
                            <a 
                              href={update.attachment} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-400 text-xs mt-1"
                            >
                              <FileText size={12} className="mr-1" />
                              View attachment
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No stages available.</p>
          )}
        </div>
      </div>

      {/* Upload Window */}
      {showUploadWindow && (
        <UploadWindow
          onClose={() => setShowUploadWindow(false)}
          teamDocuments={teamDocuments}
          onFilesSelected={handleUploadComplete}
          onSelectTeamDocument={handleTeamDocSelect}
        />
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Submit Stage Update</h3>
              <button onClick={() => setShowUpdateModal(false)}>
                <X size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Update Description</label>
              <textarea
                className="w-full bg-gray-700 text-white rounded p-2"
                rows={4}
                value={updateDescription}
                onChange={(e) => setUpdateDescription(e.target.value)}
                placeholder="Describe what changes you've made..."
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Attachments</label>
              <div className="space-y-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-700 rounded">
                    <FileText size={16} className="text-blue-400 mr-2" />
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <span className="text-xs text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
                {selectedTeamDocuments.map((doc, index) => (
                  <div key={`team-doc-${index}`} className="flex items-center p-2 bg-gray-700 rounded">
                    <FileText size={16} className="text-green-400 mr-2" />
                    <span className="text-sm truncate flex-1">{doc.title}</span>
                    <span className="text-xs text-gray-400">
                      Team Document
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleStageUpdate}
                disabled={!updateDescription}
                className={`px-4 py-2 rounded ${
                  !updateDescription ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDrawer;
import React, { useState, useEffect } from 'react';
import { Check, X, FileText, Clock } from 'lucide-react';

function AdminApprovalPanel({ teamId }) {
  const [updateRequests, setUpdateRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdateRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/tasks/getPendingUpdates/${teamId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch update requests");
      }
      
      const data = await response.json();
      setUpdateRequests(data.updateRequests);
    } catch (error) {
      console.error("Failed to fetch update requests", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleDecision = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/tasks/handleStageUpdate/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      
      if (!response.ok) throw new Error("Failed to process update request");
      
      // Refresh the list
      fetchUpdateRequests();
      toast.success(`Update ${action === 'Approved' ? 'approved' : 'rejected'}`);
    } catch (error) {
      console.error("Failed to process update request", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchUpdateRequests();
    }
  }, [teamId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Pending Stage Updates</h3>
    
    {updateRequests.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <Clock size={32} className="mx-auto mb-2" />
        <p>No pending updates</p>
      </div>
    ) : (
      <div className="space-y-4">
        {updateRequests.map((request) => (
          <div key={request._id} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{request.task?.title || 'Task'}</h4>
                <p className="text-sm text-gray-400">
                  Stage: {request.task?.stages[request.stageIndex]?.title || 'Stage'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Submitted by: {request.submittedBy?.name || 'User'}
                </p>
              </div>
              <div className="text-xs text-gray-400">
                {new Date(request.submittedAt).toLocaleString()}
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-gray-300">{request.description}</p>
            </div>
            
            {/* Attachments Section */}
            {(request.files?.length > 0 || request.teamDocuments?.length > 0) && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-400 mb-1">Attachments:</h5>
                <div className="space-y-2">
                  {/* Uploaded Files */}
                  {request.files?.map((file, index) => (
                    <div key={`file-${index}`} className="flex items-center text-sm">
                      <FileText size={14} className="mr-2 text-blue-400" />
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {file.name}
                      </a>
                      <span className="text-xs text-gray-400 ml-2">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                  
                  {/* Team Documents */}
                  {request.teamDocuments?.map((doc, index) => (
                    <div key={`doc-${index}`} className="flex items-center text-sm">
                      <FileText size={14} className="mr-2 text-green-400" />
                      <a 
                        href={`/documents/${doc._id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {doc.title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => handleDecision(request._id, 'Declined')}
                className="px-3 py-1 bg-red-600 rounded hover:bg-red-500 flex items-center"
              >
                <X size={16} className="mr-1" /> Reject
              </button>
              <button
                onClick={() => handleDecision(request._id, 'Approved')}
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 flex items-center"
              >
                <Check size={16} className="mr-1" /> Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
}

export default AdminApprovalPanel;
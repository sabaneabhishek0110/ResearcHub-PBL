import React, { useState, useEffect } from 'react';

function ShowPropertiesOfDocument({ documentId, onClose = () => {} }) {
  const BASE_URL = "https://researchub-pbl.onrender.com";
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentId) return;

    const fetchParticularDocument = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/yourDocuments/getParticularDocument/${documentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.log("Failed to get document");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setDocument(data);
        console.log("Document fetched successfully");
      } catch (error) {
        console.log("Failed to fetch document", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticularDocument();
  }, [documentId]);

  if (!documentId) {
    return (
      <div className="text-white px-6 py-4 bg-gray-800 rounded-xl shadow-md w-full max-w-md">
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-300">No document selected</p>
        </div>
      </div>
    );
  }

  if (loading || !document) {
    return (
      <div className="text-white px-6 py-4 bg-gray-800 rounded-xl shadow-md w-full max-w-md">
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-gray-100 px-6 py-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Document Properties
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-400">Title</p>
          <p className="text-white font-semibold truncate">{document.title}</p>
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-purple-500">
          <p className="text-sm font-medium text-gray-400">Description</p>
          <p className="text-white font-semibold">{document.description || 'N/A'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-400">Format</p>
            <p className="text-white font-semibold">Text File</p>
          </div>

          <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-gray-400">Owner</p>
            <p className="text-white font-semibold truncate">
              {document.owner?.name || document.owner?._id || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-pink-500">
            <p className="text-sm font-medium text-gray-400">Created</p>
            <p className="text-white font-semibold text-sm">
              {new Date(document.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-indigo-500">
            <p className="text-sm font-medium text-gray-400">Updated</p>
            <p className="text-white font-semibold text-sm">
              {new Date(document.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-800/50 p-3 rounded-lg border-l-4 border-teal-500">
          <p className="text-sm font-medium text-gray-400">Team</p>
          <p className="text-white font-semibold">
            {document.team?.Team_name || 'None'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShowPropertiesOfDocument;
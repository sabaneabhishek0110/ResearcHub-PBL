import React, { useState, useEffect } from 'react';

function ShowPropertiesOfDocument({ documentId, onClose = () => {} }) {
  const BASE_URL = "https://researchub-pbl.onrender.com";
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize as true

  useEffect(() => {
    if (!documentId) {
      setLoading(false); // If no documentId, set loading to false
      return;
    }

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
          throw new Error("Failed to fetch document");
        }

        const data = await response.json();
        setDocument(data);
      } catch (error) {
        console.log("Failed to fetch document", error);
      } finally {
        setLoading(false);
      }
    };

    // Add slight delay to demonstrate loading (you can remove this in production)
    const timer = setTimeout(() => {
      fetchParticularDocument();
    }, 200);

    return () => clearTimeout(timer);
  }, [documentId]);

  if (!documentId) {
    return (
      <div className="text-white px-6 py-4 bg-gray-900 rounded-xl shadow-md w-full max-w-md">
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-200">No document selected</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-white px-6 py-4 bg-gray-900 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
          <div className="h-8 w-40 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-5 w-5 bg-gray-800 rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800/70 p-3 rounded-lg border-l-2 border-gray-500">
              <div className="h-4 w-24 bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-5 w-full bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-white px-6 py-4 bg-gray-900 rounded-xl shadow-md w-full max-w-md">
        <div className="flex items-center justify-center h-32">
          <p className="text-blue-200">Failed to load document</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white px-6 py-4 bg-gray-900 rounded-xl shadow-xl w-full max-w-md border">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">
          Document Properties
        </h2>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-gray-800"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-800/70 p-3 rounded-lg border-l-2 border-gray-500">
          <p className="text-sm font-medium text-gray-300">Title</p>
          <p className="text-white font-semibold truncate">{document.title}</p>
        </div>

        <div className="bg-gray-800/70 p-3 rounded-lg border-l-2 border-gray-500">
          <p className="text-sm font-medium text-gray-300">Description</p>
          <p className="text-white font-semibold">{document.description || 'N/A'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/70 p-3 rounded-lg border-l-2 border-gray-500">
            <p className="text-sm font-medium text-gray-300">Format</p>
            <p className="text-white font-semibold">Text File</p>
          </div>

          <div className="bg-gray-800/70 p-3 rounded-lg border-l-2 border-gray-500">
            <p className="text-sm font-medium text-gray-300">Owner</p>
            <p className="text-white font-semibold truncate">
              {document.owner?.name || document.owner?._id || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800/70 p-3 rounded-lg border-l-2 border-gray-500">
            <p className="text-sm font-medium text-gray-300">Created</p>
            <p className="text-white font-semibold text-sm">
              {new Date(document.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-800/70 p-3 rounded-lg border-l-2 border-gray-500">
            <p className="text-sm font-medium text-gray-300">Updated</p>
            <p className="text-white font-semibold text-sm">
              {new Date(document.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-800/70 p-3 rounded-lg border-l-2 border-gray-500">
          <p className="text-sm font-medium text-gray-300">Team</p>
          <p className="text-white font-semibold">
            {document.team?.Team_name || 'None'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShowPropertiesOfDocument;
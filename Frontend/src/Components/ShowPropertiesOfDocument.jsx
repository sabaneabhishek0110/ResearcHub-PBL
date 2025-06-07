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
    return <div className="text-white px-4 py-2">No document selected.</div>;
  }

  if (loading || !document) {
    return <div className="text-white px-4 py-2">Loading document...</div>;
  }

  return (
    <div className="text-white px-4 py-2 bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Document Properties</h2>
        <button
          onClick={onClose}
          className="text-red-400 hover:text-red-600 font-semibold text-sm"
        >
          Close ✕
        </button>
      </div>

      <p><strong>Title:</strong> {document.title}</p>
      <p><strong>Description:</strong> {document.description || 'N/A'}</p>
      <p><strong>Format:</strong> Text File</p>
      <p><strong>Owner:</strong> {document.owner?.name || document.owner?._id || 'N/A'}</p>
      <p><strong>Created At:</strong> {new Date(document.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(document.updatedAt).toLocaleString()}</p>
      <p><strong>Team:</strong> {document.team?.Team_name || 'None'}</p>
    </div>
  );
}

export default ShowPropertiesOfDocument;

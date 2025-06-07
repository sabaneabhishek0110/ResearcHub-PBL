import React,{useState,useEffect} from 'react';

function ShowPropertiesOfDocument({ documentId , onClose = () => {} }) {

    const BASE_URL = "https://researchub-pbl.onrender.com";

    const [document,setDocument] = useState(null);

    if (!documentId) {
        return <div className="text-white px-4 py-2">No document selected.</div>;
    }

    const fetchParticularDocument = async () =>{
        try{
            const token = localStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/api/yourDocuments/getParticularDocument/${documentId}`,{
                method : "GET",
                headers : {
                  "Content-Type" : "application/json",
                  "Authorization" : `Bearer ${token}`
                }
              })
              if(!response.ok){
                console.log("failed to get document");
                return;
              }
              const data = await response.json();
              setDocument(data);
              console.log("p document fetched successfully");
        }
        catch(error){
            console.log("failed to fetch doucment",error);
        }
    }

    useEffect(()=>{
        if (!documentId) return;

        fetchParticularDocument();
    },[]);

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
            <p><strong>Format:</strong> {document.format}</p>
            <p><strong>Owner:</strong> {document.owner?.name || document.owner?._id || 'N/A'}</p>
            <p><strong>Created At:</strong> {new Date(document.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(document.updatedAt).toLocaleString()}</p>
            <p><strong>Team:</strong> {document.team?.Team_name || 'None'}</p>
        </div>
    );
}

export default ShowPropertiesOfDocument;

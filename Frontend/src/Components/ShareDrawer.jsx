import React, { useState, useEffect } from "react";
import Select from "react-select";

function ShareDrawer({ title, id,accessType, onClose }) {
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [accessType1, setAccessType1] = useState("Viewer");
  const [accessedMembers, setAccessedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [owner,setOwner] = useState({});
  
   const BASE_URL = "https://researchub-pbl.onrender.com"


  // Fetch all users
  const fetchTeamMembers = async () => {
    try {
      // fetchAccessedMembers();
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/yourDocuments/getTeamMembers/${id}`, {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${token}` 
        }
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setAllMembers(data.map((user) => ({ value: user._id, label: user.name })));
    } catch (error) {
      console.log("Error fetching users:", error);
      setAllMembers([]);
    }
  };

  // Fetch members who already have access
  const fetchAccessedMembers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/yourDocuments/getAccessedMembers/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch accessed members");
      const data = await response.json();
      console.log(data)
      setAccessedMembers(data.accessedMembers);
    } catch (error) {
      console.log("Error fetching accessed members:", error);
    }
  };

  // Give access to selected members
  const giveAccess = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/yourDocuments/giveAccess/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          selectedMembers: selectedMembers.map((m) => m.value),
          accessType: accessType1,
        }),
      });
      if (!response.ok) throw new Error("Failed to give access");
      console.log("Access granted successfully");
      fetchAccessedMembers(); // Refresh list
    } catch (error) {
      console.log("Error giving access:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update access type of a member
  const updateAccess = async (memberId, newAccessType) => {
    try {
      const response = await fetch(`${BASE_URL}/api/yourDocuments/updateAccess/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ member: memberId, accessType: newAccessType }),
      });
      if (!response.ok) throw new Error("Failed to update access");
      console.log("Access updated successfully");
      fetchAccessedMembers(); // Refresh list
    } catch (error) {
      console.log("Error updating access:", error);
    }
  };

  // Revoke access from a member
  const revokeAccess = async (memberId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/yourDocuments/revokeAccess/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ member: memberId }),
      });
      if (!response.ok) throw new Error("Failed to revoke access");
      console.log("Access revoked successfully");
      fetchAccessedMembers(); // Refresh list
    } catch (error) {
      console.log("Error revoking access:", error);
    }
  };

  const getOwner = async() =>{
    try{
      const response = await fetch(`${BASE_URL}/api/yourDocuments/getOwner/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      if (!response.ok) throw new Error("Failed to fetch owner of document");
      const data = await response.json();
      console.log("Owner fetched:", data.owner);
      setOwner(data.owner);
      console.log("owner of the document fetched successfully");
    }
    catch(error){
      console.log("failed to get owner of the document",error);
    }
  }


  useEffect(() => {
    fetchTeamMembers();
    fetchAccessedMembers();
    getOwner();
  }, [id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50 px-4 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-xl shadow-lg mt-10 mb-10 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-semibold text-black">{title}</h2>

        {accessType === "owner" && (
          <div>
            <div className="mt-4">
              <Select
                isMulti
                options={allMembers}
                value={selectedMembers}
                onChange={setSelectedMembers}
                className="text-black"
                placeholder="Select members..."
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:gap-6 gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600">
                <input
                  type="radio"
                  name="accessType"
                  value="Viewer"
                  checked={accessType1 === "Viewer"}
                  onChange={() => setAccessType1("Viewer")}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center ${
                    accessType1 === "Viewer" ? "border-blue-500" : ""
                  }`}
                >
                  {accessType1 === "Viewer" && (
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </span>
                Viewer
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600">
                <input
                  type="radio"
                  name="accessType"
                  value="Editor"
                  checked={accessType1 === "Editor"}
                  onChange={() => setAccessType1("Editor")}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center ${
                    accessType1 === "Editor" ? "border-blue-500" : ""
                  }`}
                >
                  {accessType1 === "Editor" && (
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  )}
                </span>
                Editor
              </label>
            </div>

            <button
              onClick={giveAccess}
              className="mt-4 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded transition w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        )}

        {/* List of Accessed Members */}
        <h3 className="mt-6 font-semibold">People with access:</h3>
        <ul className="mt-2">
          <div className="flex justify-between items-center p-2 border-b">
            <span>{owner?.name || "Loading..."}</span>
            <p>Owner</p>
          </div>

          {accessType === "owner"
            ? accessedMembers.map((member) => (
                <li
                  key={member.user._id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <span>{member.user.name}</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={member.access}
                      onChange={(e) =>
                        updateAccess(member.user._id, e.target.value)
                      }
                      className="px-2 py-1 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Viewer">👀 Viewer</option>
                      <option value="Editor">✏️ Editor</option>
                    </select>
                    <button
                      onClick={() => revokeAccess(member.user._id)}
                      className="text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))
            : accessedMembers.map((member) => (
                <li
                  key={member.user._id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <span>{member.user.name}</span>
                  <p>{member.access === "Viewer" ? "👀 Viewer" : "✏️ Editor"}</p>
                </li>
              ))}
        </ul>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </div>


  );
}

export default ShareDrawer;






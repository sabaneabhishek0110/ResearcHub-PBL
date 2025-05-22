// import React from 'react';

// const TeamSelector = ({ className, teams, team, setTeam, onDone, onClose }) => {
//   return (
//     <div className={className}>
//       <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-white">
//         <h2 className="text-xl font-semibold mb-4">Select a Team</h2>

//         <select
//           value={team?._id || ''}
//           onChange={(e) => {
//             const selectedTeam = teams.find(t => t._id === e.target.value);
//             setTeam(selectedTeam);
//             console.log(selectedTeam)
//           }}
//           className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="" disabled>Select a team</option>
//           {teams.map((t) => (
//             <option key={t._id} value={t._id} className="text-white">
//               {t.Team_name}
//             </option>
//           ))}
//         </select>


//           <div className="mt-4 flex justify-start">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
//             >
//               Cancel
//             </button>
//           </div>

//         <div className="mt-4 flex justify-end">
//           <button
//             onClick={onDone}
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition"
//           >
//             Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamSelector;




import React from 'react';

const TeamSelector = ({ className, teams, team, setTeam, onDone, onClose }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 ${className}`}
      onClick={onClose} // Close when clicking backdrop
    >
      <div 
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm text-white mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent click propagation
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select a Team</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <select
          value={team?._id || ''}
          onChange={(e) => {
            const selectedTeam = teams.find(t => t._id === e.target.value);
            setTeam(selectedTeam);
          }}
          className="w-full p-2 mb-6 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select a team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.Team_name || t.name} {/* Handle both possible property names */}
            </option>
          ))}
        </select>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={onDone}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition disabled:opacity-50"
            disabled={!team} // Disable if no team selected
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamSelector;
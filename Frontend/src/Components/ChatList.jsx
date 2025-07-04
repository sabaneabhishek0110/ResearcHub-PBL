import { useChat } from '../context/ChatContext';
import { Users, User, MessageSquare } from 'lucide-react';

function ChatList({ searchQuery }) {
  const { chats, currentChat, setCurrentChat, activeUsers, currentUser, allUsers } = useChat();

  const filteredChats = chats.filter(chat => {
    if (chat.isGroup) {
      return chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      // For 1:1 chats, find the other participant
      const otherParticipant = chat.participants.find(p => p._id !== currentUser._id);
      return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  return (
    <div className="overflow-y-auto h-full">
      {filteredChats.map(chat => {
        const otherParticipant = !chat.isGroup 
          ? chat.participants.find(p => p._id !== currentUser._id)
          : null;

        return (
          <div 
            key={chat._id}
            className={`flex items-center p-3 cursor-pointer transition-colors hover:bg-gray-400 ${
              currentChat?._id === chat._id ? 'bg-gray-600' : ''
            }`}
            onClick={() => setCurrentChat(chat)}
          >
            {/* Group Chat */}
            {chat.isGroup ? (
              <div className="flex items-center w-full">
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center mr-3">
                  <Users size={20} className="text-gray-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    {chat.name}
                    <span className="text-xs bg-gray-500 px-2 py-0.5 rounded-full">Group</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate">
                    <MessageSquare size={14} className="opacity-60" />
                    {chat.lastMessage?.content || 'No messages yet'}
                  </p>
                </div>
              </div>
            ) : (
              /* 1:1 Chat */
              <div className="flex items-center w-full">
                {otherParticipant?.profilePicture ? (
                  <img 
                    src={otherParticipant.profilePicture} 
                    alt={otherParticipant.name} 
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center mr-3">
                    <User size={20} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium flex items-center gap-1.5">
                    {otherParticipant?.name || 'Unknown'}
                    {activeUsers.includes(otherParticipant?._id) && (
                      <span 
                        className="w-2 h-2 rounded-full bg-green-500 inline-block"
                        title="Online"
                      ></span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {chat.lastMessage?.content || 'Start chatting'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;


// function ChatList({ searchQuery }) {
//   const { chats, currentChat, setCurrentChat, activeUsers, allUsers } = useChat();

//   const filteredChats = chats.filter(chat => {
//     if (chat.isGroup) {
//       return chat.name.toLowerCase().includes(searchQuery.toLowerCase());
//     } else {
//       // For 1:1 chats, find the other participant
//       const otherParticipant = allUsers.find(u => 
//         chat.participants.includes(u._id) && u._id !== currentUser._id
//       );
//       return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase());
//     }
//   });

//   return (
//     <div className="users-list">
//       {filteredChats.map(chat => (
//         <div 
//           key={chat._id}
//           className={`user-item ${currentChat?._id === chat._id ? 'active' : ''}`}
//           onClick={() => setCurrentChat(chat)}
//         >
//           {chat.isGroup ? (
//             <>
//               <div className="user-avatar">
//                 <img src={chat.image || 'https://via.placeholder.com/40'} alt={chat.name} />
//               </div>
//               <div className="user-info">
//                 <div className="user-name">{chat.name}</div>
//                 <div className="user-email">Group chat</div>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="user-avatar">
//                 {allUsers.find(u => chat.participants.includes(u._id) && u._id !== currentUser._id)?.profilePicture || 'https://via.placeholder.com/40'} 
//                 <div className={`status-indicator ${activeUsers.includes(/* other participant id */) ? 'online' : 'offline'}`} />
//               </div>
//               <div className="user-info">
//                 <div className="user-name">
//                   {allUsers.find(u => chat.participants.includes(u._id) && u._id !== currentUser._id)?.name}
//                 </div>
//                 <div className="user-email">
//                   {allUsers.find(u => chat.participants.includes(u._id) && u._id !== currentUser._id)?.email}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ChatList; 
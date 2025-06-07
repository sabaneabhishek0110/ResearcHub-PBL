// import React from 'react'
// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar';


// function Layout() {
//   return (
//     <div className='flex h-screen w-full'>
//         <div className='min-w-[200px] p-2'>
//           <Sidebar />
//         </div>
//         <div className=' flex-grow rounded-md flex flex-col shadow-lg'>
//             <Outlet />
//         </div>
//     </div>
//   );
// };

// export default Layout;



import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth <= 770;

  return (
    <div className='flex flex-col h-screen w-full relative'>

      {/* Mobile Top Navbar */}
      {isMobile && (
        <div className="w-[calc(100%-14px)] h-16 bg-gray-900 mx-2 mt-2 text-white flex items-center justify-between rounded-md px-4 shadow-md z-50 ">
          {/* Logo */}
          <div className="font-bold text-lg w-10 h-10">
            <img src="./research-logo.svg"/>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar for Desktop */}
      {!isMobile && (
        <div className="flex h-full">
          <div className="min-w-[200px] p-2 bg-gray-900 text-white">
            <Sidebar />
          </div>
          <div className="flex-grow p-2 overflow-auto flex flex-col">
            <Outlet />
          </div>
        </div>
      )}

      {/* Sidebar Drawer for Mobile */}
      {isMobile && sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-10 z-40" onClick={() => setSidebarOpen(false)}></div>

          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 z-50 transition-transform transform translate-x-0 p-4">
              <button
                className="absolute text-white text-2xl right-4 top-2 z-10"
                onClick={() => setSidebarOpen(false)}
              >
                ✖
              </button>
            <Sidebar onClose={()=>setSidebarOpen(false)}/>
          </div>
        </>
      )}

      {/* Main content for mobile */}
      {isMobile && (
        <div className={`flex-grow p-2 overflow-auto ${!isMobile ? "mt-2" : "" }`}>
          <Outlet />
        </div>
      )}
    </div>
  );
}

export default Layout;


// import React from 'react'
// import { useNavigate } from 'react-router-dom'

// function HomePage() {
//   const navigate = useNavigate();
//   return (
//     <div className='flex flex-col text-white h-screen'>
//         <div className='self-center w-[100%] h-60 flex justify-center items-center'>
//             <p className='text-3xl' style={{fontFamily:'cursive'}}>HomePage</p>
//         </div>
//         <button className='w-30 h-10 border-white border-2 cursor-pointer rounded-md m-auto' onClick={()=>navigate('/Authpage')}>Get Started</button>
        
//     </div>
//   )
// }

// export default HomePage





import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCode, FiUsers, FiFileText, FiLock, FiShare2 } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const featureCards = [
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: "Real-time Collaboration",
      description: "Edit documents simultaneously with your team"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Team Management",
      description: "Organize your team members with different access levels"
    },
    {
      icon: <FiLock className="w-8 h-8" />,
      title: "Secure Sharing",
      description: "Control who can view or edit your documents"
    },
    {
      icon: <FiShare2 className="w-8 h-8" />,
      title: "Version History",
      description: "Track changes and restore previous versions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white  overflow-y-auto scrollbar-hide"
    style={{
      scrollbarWidth: 'none',  /* Firefox */
      msOverflowStyle: 'none',  /* IE 10+ */
    }}>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        {/* Animated background elements */}
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="absolute bottom-20 right-20 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-500">
              Collaborative
            </span>{' '}
            <br />
            Research Platform
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto"
          >
            Work together in real-time with your team. Create, edit and share documents seamlessly.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/Authpage')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto"
          >
            Get Started
            <FiArrowRight className="ml-2" />
          </motion.button>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          animate={{
            y: [0, 20, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop'
          }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-blue-300 rounded-full flex justify-center">
            <motion.div
              animate={{
                y: [0, 10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop'
              }}
              className="w-1 h-2 bg-blue-300 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-900 to-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            variants={item}
            className="text-4xl font-bold text-center mb-16"
          >
            Powerful Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -10 }}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-all duration-300"
              >
                <div className="text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of teams who are already collaborating more effectively.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/Authpage')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start For Free
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
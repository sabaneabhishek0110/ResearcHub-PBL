// import React, { useState, useEffect } from 'react';
// import { Pencil, Save, X, User, Mail, BookOpen, Briefcase } from 'lucide-react';
// import { motion } from 'framer-motion';

// const ProfileUpdateForm = ({ userData, onUpdate, onCancel }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     bio: '',
//     researchFields: '',
//     role: ''
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   // Initialize form with user data
//   useEffect(() => {
//     if (userData) {
//       setFormData({
//         name: userData.name || '',
//         email: userData.email || '',
//         bio: userData.bio || '',
//         researchFields: userData.researchFields?.join(', ') || '',
//         role: userData.role || ''
//       });
//     }
//   }, [userData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user makes changes
//     if (error) setError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError(null);

//     try {
//       // Convert researchFields string to array
//       const submitData = {
//         ...formData,
//         researchFields: formData.researchFields
//           .split(',')
//           .map(field => field.trim())
//           .filter(field => field !== '')
//       };

//       await onUpdate(submitData);
//     } catch (err) {
//       console.error('Update failed:', err);
//       setError(err.message || 'Failed to update profile');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.2 }}
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 bg-opacity-50"
//       onClick={onCancel} // Close modal when clicking outside
//     >
//       <motion.div
//         initial={{ scale: 0.95 }}
//         animate={{ scale: 1 }}
//         className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl"
//         onClick={(e) => e.stopPropagation()} // Prevent click-through
//       >
//         <div className="relative p-6">
//           {/* Close button */}
//           <button
//             onClick={onCancel}
//             className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
//             aria-label="Close"
//           >
//             <X size={24} />
//           </button>

//           <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
//             <Pencil className="mr-2" size={20} /> Edit Profile
//           </h2>

//           {error && (
//             <div className="mb-4 p-3 bg-red-900 text-red-100 rounded text-sm">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {/* Name Field */}
//             <div className="mb-4">
//               <label htmlFor="name" className=" text-gray-300 text-sm mb-2 flex items-center">
//                 <User className="mr-2" size={16} /> Full Name
//               </label>
//               <input
//                 id="name"
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//                 maxLength={50}
//               />
//             </div>

//             {/* Email Field */}
//             <div className="mb-4">
//               <label htmlFor="email" className=" text-gray-300 text-sm mb-2 flex items-center">
//                 <Mail className="mr-2" size={16} /> Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 className="w-full bg-gray-700 rounded px-3 py-2 text-gray-400 focus:outline-none cursor-not-allowed"
//                 disabled
//                 readOnly
//               />
//             </div>

//             {/* Bio Field */}
//             <div className="mb-4">
//               <label htmlFor="bio" className=" text-gray-300 text-sm mb-2 flex items-center">
//                 <BookOpen className="mr-2" size={16} /> Bio
//               </label>
//               <textarea
//                 id="bio"
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleChange}
//                 className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows={3}
//                 maxLength={250}
//                 placeholder="Tell us about yourself..."
//               />
//               <p className="text-xs text-gray-400 mt-1 text-right">
//                 {formData.bio.length}/250 characters
//               </p>
//             </div>

//             {/* Research Fields */}
//             <div className="mb-4">
//               <label htmlFor="researchFields" className=" text-gray-300 text-sm mb-2 flex items-center">
//                 <Briefcase className="mr-2" size={16} /> Research Fields
//               </label>
//               <input
//                 id="researchFields"
//                 type="text"
//                 name="researchFields"
//                 value={formData.researchFields}
//                 onChange={handleChange}
//                 className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., AI, Machine Learning, Data Science"
//                 aria-describedby="fieldsHelp"
//               />
//               <p id="fieldsHelp" className="text-xs text-gray-400 mt-1">
//                 Separate multiple fields with commas
//               </p>
//             </div>

//             {/* Role (if editable) */}
//             {userData?.role === 'SuperAdmin' && (
//               <div className="mb-6">
//                 <label htmlFor="role" className="block text-gray-300 text-sm mb-2">
//                   Role
//                 </label>
//                 <select
//                   id="role"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="Researcher">Researcher</option>
//                   <option value="GroupAdmin">Group Admin</option>
//                   <option value="SuperAdmin">Super Admin</option>
//                 </select>
//               </div>
//             )}

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
//               {/* <button
//                 type="button"
//                 onClick={onCancel}
//                 className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition flex items-center"
//                 disabled={isSubmitting}
//               >
//                 <X className="mr-2" size={16} /> Cancel
//               </button> */}
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition flex items-center"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="mr-2" size={16} /> Save Changes
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ProfileUpdateForm;












import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Save, X, User, Mail, BookOpen, Briefcase, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_PROFILE_PIC = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ProfileUpdateForm = ({ userData, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    researchFields: '',
    role: '',
    profilePicture : '',
  });

  const [previewImage, setPreviewImage] = useState(DEFAULT_PROFILE_PIC);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize form with user data
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        researchFields: userData.researchFields?.join(', ') || '',
        role: userData.role || '',
        profilePicture : userData.profilePicture || '',
      });
      setPreviewImage(userData.profilePicture || DEFAULT_PROFILE_PIC);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.match('image.*')) {
      setError('Please select an image file (JPEG, PNG)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setError('Image size should be less than 2MB');
      return;
    }

    setSelectedFile(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setFormData(prev =>({
        ...prev,["profilePicture"] : reader.result
      }))
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setError(null);

  //   try {
  //     const submitData = new FormData();
    
  //     // Add text fields
  //     submitData.append('name', formData.name);
  //     submitData.append('bio', formData.bio);
      
  //     // Handle researchFields properly
  //     if (formData.researchFields) {
  //       const fieldsArray = formData.researchFields
  //         .split(',')
  //         .map(field => field.trim())
  //         .filter(field => field !== '');
        
  //       // Append each field individually or as JSON string
  //       submitData.append('researchFields', JSON.stringify(fieldsArray));
  //     }
      
  //     submitData.append('role', formData.role);
      
  //     // Add file if selected
  //     if (selectedFile) {
  //       submitData.append('profilePicture', selectedFile);
  //     }

  //     // Debug: Log FormData contents
  //     // for (let [key, value] of submitData.entries()) {
  //     //   console.log("kjhkjh",key, value);
  //     // }
  //     // await onUpdate(submitData);
  //     await onUpdate(formData);
  //     onCancel(); // Close the modal after successful update
  //   } catch (err) {
  //     console.error('Update failed:', err);
  //     setError(err.message || 'Failed to update profile');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    

    try {
      await onUpdate({
        ...formData,
        profilePicture: selectedFile, // Send the File object (not base64)
      });
      onCancel();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 bg-opacity-50 overflow-y-auto" // Added overflow-y-auto
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl max-h-[90vh] flex flex-col" // Added max-h and flex-col
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Pencil className="mr-2" size={20} /> Edit Profile
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-100 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile Picture Upload */}
            <div className="mb-6 flex flex-col items-center">
              <div 
                className="relative group cursor-pointer"
                onClick={triggerFileInput}
              >
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil size={20} className="text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center"
              >
                <ImageIcon className="mr-1" size={14} /> Change Photo
              </button>
            </div>

            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="text-gray-300 text-sm mb-2 flex items-center">
                <User className="mr-2" size={16} /> Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                maxLength={50}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-300 text-sm mb-2 flex items-center">
                <Mail className="mr-2" size={16} /> Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                className="w-full bg-gray-700 rounded px-3 py-2 text-gray-400 focus:outline-none cursor-not-allowed"
                disabled
                readOnly
              />
            </div>

            {/* Bio Field */}
            <div className="mb-4">
              <label htmlFor="bio" className="text-gray-300 text-sm mb-2 flex items-center">
                <BookOpen className="mr-2" size={16} /> Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={250}
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {formData.bio.length}/250 characters
              </p>
            </div>

            {/* Research Fields */}
            <div className="mb-4">
              <label htmlFor="researchFields" className="text-gray-300 text-sm mb-2 flex items-center">
                <Briefcase className="mr-2" size={16} /> Research Fields
              </label>
              <input
                id="researchFields"
                type="text"
                name="researchFields"
                value={formData.researchFields}
                onChange={handleChange}
                className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., AI, Machine Learning, Data Science"
                aria-describedby="fieldsHelp"
              />
              <p id="fieldsHelp" className="text-xs text-gray-400 mt-1">
                Separate multiple fields with commas
              </p>
            </div>

            {/* Role (if editable) */}
            {userData?.role === 'SuperAdmin' && (
              <div className="mb-6">
                <label htmlFor="role" className="block text-gray-300 text-sm mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Researcher">Researcher</option>
                  <option value="GroupAdmin">Group Admin</option>
                  <option value="SuperAdmin">Super Admin</option>
                </select>
              </div>
            )}

            {/* Single Update Button */}
            <div className="border-t border-gray-700 p-5 sticky bg-gray-800">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={16} /> Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileUpdateForm;
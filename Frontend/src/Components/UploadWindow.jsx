import React, { useState } from 'react';
import { X, UploadCloud, Folder, Users, FileText, Image as ImageIcon } from 'lucide-react';

const UploadWindow = ({ onClose, teamDocuments, onFilesSelected, onSelectTeamDocument }) => {
  const [activeTab, setActiveTab] = useState('device');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTeamDoc, setSelectedTeamDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const BASE_URL = "https://researchub-pbl.onrender.com"


  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleConfirmSelection = () => {
    if (activeTab === 'device' && selectedFiles.length > 0) {
      setIsUploading(false);
      onFilesSelected(selectedFiles); // Pass array of files to parent
      onClose();
    } else if (activeTab === 'team' && selectedTeamDoc) {
      setIsUploading(false);
      onSelectTeamDocument(selectedTeamDoc);
      onClose();
    }
  };

  // File type icon component
  const FileIcon = ({ file }) => {
    const extension = file.name.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
    
    return isImage ? (
      <ImageIcon size={20} className="text-blue-500 mr-2" />
    ) : (
      <FileText size={20} className="text-blue-500 mr-2" />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add Attachments</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'device' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('device')}
            >
              <div className="flex items-center gap-2">
                <UploadCloud size={18} />
                Your Device
              </div>
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'team' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('team')}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Team Documents
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'device' ? (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud size={32} className="text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Images, PDF, DOCX, PPTX, XLSX (Max 10MB each)
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  multiple
                />
              </label>

              {/* Selected files list */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                    <FileIcon file={file} />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {teamDocuments.length > 0 ? (
                teamDocuments.map(doc => (
                  <div 
                    key={doc.id}
                    className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedTeamDoc?.id === doc.id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => setSelectedTeamDoc(doc)}
                  >
                    <div className="flex items-center">
                      <FileText size={18} className="text-gray-500 mr-2" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-gray-500">{doc.title}</p>
                        <p className="text-xs text-gray-500">
                          Updated {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Folder size={32} className="mx-auto mb-2" />
                  <p>No team documents available</p>
                </div>
              )}
            </div>
          )}
        </div>
        {isUploading && (
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}


        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={(activeTab === 'device' && selectedFiles.length === 0) || (activeTab === 'team' && !selectedTeamDoc) || isUploading}
            className={`px-4 py-2 text-white rounded-md ${
              (activeTab === 'device' && selectedFiles.length === 0) || (activeTab === 'team' && !selectedTeamDoc) || isUploading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {activeTab === 'device' ? 'Add Files' : 'Select Document'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadWindow;
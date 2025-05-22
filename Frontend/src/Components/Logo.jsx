// Logo.jsx
export const Logo = ({ size = 40 }) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100"
      className="cursor-pointer"
    >
      {/* Infinity-shaped documents */}
      <path 
        d="M30,50 Q50,20 70,50 Q50,80 30,50 Z" 
        fill="#38BDF8" 
        stroke="#0EA5E9" 
        strokeWidth="2"
      />
      <path 
        d="M30,50 Q50,30 70,50 Q50,70 30,50 Z" 
        fill="white" 
        opacity="0.8"
      />
      
      {/* Document lines */}
      <line x1="35" y1="45" x2="65" y2="45" stroke="#0EA5E9" strokeWidth="1" />
      <line x1="35" y1="50" x2="65" y2="50" stroke="#0EA5E9" strokeWidth="1" />
      <line x1="35" y1="55" x2="65" y2="55" stroke="#0EA5E9" strokeWidth="1" />
    </svg>
  );
  
  // Text version
  export const LogoWithText = () => (
    <div className="flex items-center gap-2">
      <Logo size={36} />
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        SyncDocs
      </span>
    </div>
  );
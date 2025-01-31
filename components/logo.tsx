export function Logo() {
  return (
    <div className="w-8 h-8">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/toString">
        {/* Base circle */}
        <circle cx="16" cy="16" r="15" fill="#738678" />
        
        {/* Stylized 'h' with leaf motifs */}
        <path
          d="M11 8C11 8 13 8 13 10V22M13 15C13 13 15 12 17 12C19 12 21 13 21 15V22"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Decorative leaves */}
        <path
          d="M8 12C10 12 12 10 12 8C12 10 10 12 8 12Z"
          fill="white"
          opacity="0.8"
        />
        <path
          d="M24 20C22 20 20 18 20 16C20 18 22 20 24 20Z"
          fill="white"
          opacity="0.8"
        />
      </svg>
    </div>
  )
}


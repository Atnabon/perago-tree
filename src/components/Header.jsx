import React from 'react'

const Header = () => {
  return (
    <div>
          <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white text-center py-4 shadow-md font-bold text-lg sticky top-0 z-10">
        <div className="flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <div>ORGANIZATION</div>
          <div className="ml-1 font-bold">EMPLOYEES</div>
          <div className="ml-1">HIERARCHY</div>
        </div>
      </div>
    </div>
  )
}

export default Header
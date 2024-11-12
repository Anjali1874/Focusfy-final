import React from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-transparent fixed top-0 left-0 right-0 z-10 shadow-md">
    <h1 className="text-xl font-bold text-white">FocusFy</h1>
    <div className="flex items-center space-x-4">
      <Link to="/" className="text-white font-semibold bg-transparent p-2 hover:bg-gray-700 rounded-full">
        Back to Home
      </Link>
      <Link to="/profile" className="p-2 bg-gray-700 rounded-full">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png" // Profile icon URL, change as needed
          alt="Profile"
          className="w-6 h-6"
        />
      </Link>
    </div>
  </div>
  )
}

export default Contact

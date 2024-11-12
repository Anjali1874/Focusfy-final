import React from 'react';
import { Link } from 'react-router-dom';
import ProfileHeader from '../components/ProfileHeader';
import Statistics from '../components/Statistics';
import Streaks from '../components/Streaks';

const ProfilePage = () => {
  // Hardcoded user data
  const userData = {
    username: "codeMaster",
    fullName: "John Doe",
    profilePic: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png", // Profile picture URL
    rating: 1200,
    rank: 5,
    ratingHistory: [1000, 1100, 1200, 1150], // Example rating history
    badges: ["Achievement 1", "Achievement 2"], // Example badges
    currentStreak: 5,
    maxStreak: 10
  };

  return (
    <>
      <div className="flex justify-between items-center p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 fixed top-0 left-0 right-0 z-10 shadow-lg">
        <h1 className="text-2xl font-bold text-white tracking-wide">FocusFy</h1>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white font-semibold bg-transparent p-3 rounded-full hover:bg-gray-700 transition-colors duration-300">
            Back to Home
          </Link>
          <Link to="/profile" className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-300">
            <img
              src={userData.profilePic} // Use hardcoded profile picture
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto mt-24 p-6 space-y-8 bg-white shadow-lg rounded-xl">
        <ProfileHeader 
          username={userData.username} 
          fullName={userData.fullName} 
          profilePic={userData.profilePic} 
          rating={userData.rating} 
          rank={userData.rank} 
        />
        
        <div className="space-y-6">
          <Statistics 
            ratingHistory={userData.ratingHistory} 
            badges={userData.badges} 
          />
          
          <Streaks 
            currentStreak={userData.currentStreak} 
            maxStreak={userData.maxStreak} 
          />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

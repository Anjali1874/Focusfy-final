import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileHeader from '../components/ProfileHeader';
import Statistics from '../components/Statistics';
import Streaks from '../components/Streaks';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const username = "codeMaster"; // Dynamic value, or hardcoded for testing

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${username}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [username]);

  if (!userData) return <p>Loading...</p>;

  return (
    <><div className="flex justify-between items-center p-4 bg-transparent fixed top-0 left-0 right-0 z-10 shadow-md">
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
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <ProfileHeader 
        username={userData.username} 
        fullName={userData.fullName} 
        profilePic={userData.profilePic} 
        rating={userData.rating} 
        rank={userData.rank} 
      />
      <Statistics 
        ratingHistory={userData.ratingHistory} 
        badges={userData.badges} 
      />
      <Streaks 
        currentStreak={userData.currentStreak} 
        maxStreak={userData.maxStreak} 
      />
    </div>
    </>
  );
};

export default ProfilePage;

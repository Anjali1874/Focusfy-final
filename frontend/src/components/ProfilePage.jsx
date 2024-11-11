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
  );
};

export default ProfilePage;

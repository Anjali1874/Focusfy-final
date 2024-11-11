// src/components/ProfileHeader.jsx
import React from 'react';

const ProfileHeader = ({ username, fullName, profilePic, rating, rank }) => (
  <header className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-lg">
    <img src={profilePic} alt={`${username}'s Profile`} className="w-20 h-20 rounded-full" />
    <div>
      <h2 className="text-2xl font-semibold">{fullName}</h2>
      <p className="text-gray-500">@{username}</p>
      <p className="text-gray-700">
        Rating: <span className="font-bold">{rating}</span> | Rank: <span className="font-bold">{rank}</span>
      </p>
    </div>
  </header>
);

export default ProfileHeader;

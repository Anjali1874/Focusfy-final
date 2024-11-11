// src/components/Streaks.jsx
import React from 'react';

const Streaks = ({ currentStreak, maxStreak }) => (
  <div className="p-4 bg-blue-50 rounded-lg shadow-lg mt-4 text-center">
    <h3 className="text-lg font-semibold">Streaks</h3>
    <p className="text-3xl font-bold text-blue-600">{currentStreak}🔥</p>
    <p className="text-sm text-gray-500">Current Streak</p>
    <p className="mt-2 text-sm">
      Longest Streak: <span className="font-semibold">{maxStreak} days</span>
    </p>
  </div>
);

export default Streaks;

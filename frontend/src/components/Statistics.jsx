// src/components/Statistics.jsx
import React from 'react';

const Statistics = ({ ratingHistory, badges }) => (
  <section className="p-4 bg-white rounded-lg shadow-lg mt-4">
    <h3 className="text-lg font-semibold mb-2">Rating Over Time</h3>
    {/* Add a chart library here, like Chart.js */}
    <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
      [Graph Placeholder]
    </div>
    <div className="flex gap-2">
      <h3 className="text-lg font-semibold">Badges</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <img key={index} src={badge} alt="Badge" className="w-16 h-16" />
        ))}
      </div>
    </div>
  </section>
);

export default Statistics;

// ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function Card({ title, description, imgSrc, link }) {
  return (
    <div className="bg-gradient-to-r from-yellow-200 service-card h-auto w-full p-10 m-10 border-white border-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl flex flex-col items-center">
      <div className="icon mb-4">
        {/* Larger image sizes with responsive classes */}
        <img 
          src={imgSrc} 
          alt={title} 
          className="w-full max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto object-contain rounded"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-800 text-center text-md">{description}</p>
      <Link to= {link} ><button>Explore More !</button></Link>
      
    </div>
  );
}

export default Card;

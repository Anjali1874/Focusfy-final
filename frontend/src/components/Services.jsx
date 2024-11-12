import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import ServiceCard from './Card.jsx'; // Adjust the import path if needed

function Services() {
  const servicesData = [
    {
      title: 'Personalized Study Plans',
      description: 'Tailored study plans to enhance your learning experience based on your focus levels and preferences.',
      imgSrc: 'https://designtemplate.tech/Online-Learning-Boy-Unique-3D-Model-Illustration-700.webp',
      link: "/timetable"
    },
    {
      title: 'Real-Time Feedback',
      description: 'Get immediate feedback on your study habits to help you stay on track and improve productivity.',
      imgSrc: 'https://curiousminds.info/wp-content/uploads/2024/06/Surprising-Habits-of-Highly-Curious-People-That-Will-Change-Your-Life.jpg',
      link: "/webcam",
    },
    {
      title: 'Quote Charge',
      description: 'Track your progress over time and make adjustments to your study strategies for optimal results.',
      imgSrc: 'https://info.ehl.edu/hubfs/employee-performance-improvement.jpeg',
      link: "/quotes"
    },
  ];

  return (
    <>
      {/* Navbar */}
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

      {/* Services Section */}
      <div className="services-container flex flex-col items-center justify-center py-10 mt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              imgSrc={service.imgSrc}
              link={service.link}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Services;

import React from 'react';
import ServiceCard from './Card.jsx'; // Adjust the import path if needed

function Services() {
  const servicesData = [
    {
      title: 'Personalized Study Plans',
      description: 'Tailored study plans to enhance your learning experience based on your focus levels and preferences.',
      imgSrc: 'https://designtemplate.tech/Online-Learning-Boy-Unique-3D-Model-Illustration-700.webp',
      link:"/timetable"
    },
    {
      title: 'Real-Time Feedback',
      description: 'Get immediate feedback on your study habits to help you stay on track and improve productivity.',
      imgSrc: 'https://curiousminds.info/wp-content/uploads/2024/06/Surprising-Habits-of-Highly-Curious-People-That-Will-Change-Your-Life.jpg', // Updated 3D image
      link:"/webcam",
    },
    {
      title: 'Quote Charge',
      description: 'Track your progress over time and make adjustments to your study strategies for optimal results.',
      imgSrc: 'https://info.ehl.edu/hubfs/employee-performance-improvement.jpeg', // Updated 3D image
      link:"/quotes"
    },
  ];

  return (
    <div className="services-container flex flex-col items-center justify-center py-10 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            imgSrc={service.imgSrc}
            link= {service.link}
          />
        ))}
      </div>
    </div>
  );
}

export default Services;

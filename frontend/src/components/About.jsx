import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import backHome from './backHome';

function About() {
  const imageRef = useRef(null);

  // Use Intersection Observer to trigger the animation when "About" comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            imageRef.current.classList.add('image-in-view');
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is in view
    );

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      observer.observe(aboutSection);
    }

    return () => {
      if (aboutSection) {
        observer.unobserve(aboutSection);
      }
    };
  }, []);

  return (
    <>
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
    <div>
      <div className="flex flex-col md:flex-row justify-evenly items-center mt-36">
        {/* Card-like Paragraph with Glassy Effect and Dark 3D Shadow */}
        <div className="w-11/12 md:w-2/3 bg-gradient-to-r from-yellow-200 to-white p-10 rounded-xl shadow-2xl hover:shadow-dark transform hover:-translate-y-2 transition-all duration-500 ease-in-out text-left">
          {/* Title */}
          <div className="w-11/12 md:w-2/3 mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
              <span className="text-yellow-500 block mb-5">Who Are We?</span>
            </h1>
          </div>
          <p className="text-2xl md:text-2xl text-black leading-relaxed">
  At <span className="text-yellow-500 font-bold">FocusFy</span>, we’re here to make studying less of a struggle and more of a success story. Our mission is simple: help students stay focused and boost productivity using advanced technology that’s both powerful and easy to use. Through your webcam, FocusFy uses AI and image processing to monitor things like posture, gestures, and lighting conditions. 

  <br/><br/>
  With real-time feedback and insights, you’ll know how to make the most of every study session. Plus, our daily plans and performance tracking features help keep you on track for long term success. We’ve also added fun gamification elements like earning coins and maintaining streaks to help you stay motivated and make focusing feel rewarding.

  <br/><br/>
  FocusFy isn’t just for students looking to avoid distractions; it’s designed for anyone who wants a smarter way to study. Whether you’re in high school or college, dealing with posture issues, or struggling with time management, we’re here to support you with tools that adapt to your goals.

  <br/><br/>
  Let’s change how students study and succeed. Join us on this journey to make learning more effective, engaging, and focused.
</p>

          
        </div>
      </div>
    </div>
    </>
  );
}

export default About;

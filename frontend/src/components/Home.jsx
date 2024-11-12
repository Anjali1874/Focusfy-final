import React from "react";
import RunningText from "./RunningText";
import About from "./About";
import Navbar from './Navbar'

const quotes = [
  "Let your tomorrow thank your today.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you."
];

function Home() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <><Navbar />
  
    <div
  className="flex flex-col items-center text-center min-h-screen bg-cover bg-center bg-no-repeat w-100vw"
  style={{
    backgroundImage: "url('/bg.webp')", // Add your image path here
    backgroundSize: "cover",
    filter: "blur(0px)", // Adjust the blur level
    WebkitBackdropFilter: "blur(8px)", // For Safari support
  }}
       >  
      {/* Hero Section */}
      <div className="hero-section mt-12 flex flex-col items-center space-y-8">
        <h1 className="text-7xl font-bold text-white mt-32">Welcome to FocusFy</h1>
        <p className="text-lg text-white max-w-lg">
          Empower yourself to focus, grow, and succeed with FocusFy’s personalized focus tools.
        </p>
      </div>

      {/* Running Text */}
      <div className="text-container mt-16 w-full max-w-lg">
        <RunningText quotes={quotes} speed={100} />
      </div><br /><br /><br /><br />
      <button className="bg-yellow-500 text-white px-6 py-3 text-2xl rounded-lg shadow-md hover:bg-yellow-600 transition duration-300">
          Get Started
        </button>
        <br /><br /><br />
    </div>
    </>
  );
}

export default Home;

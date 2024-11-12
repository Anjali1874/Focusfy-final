import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Quotes = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [minutes, setMinutes] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    getQuote();
  }, []);

  const getQuote = () => {
    const url = "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
        setQuote(randomQuote.quote);
        setAuthor(randomQuote.author);
      });
  };

  const handleClick = () => {
    getQuote();
  };

  const handleStartTimer = () => {
    const timeInMinutes = parseInt(minutes, 10);
    if (!isNaN(timeInMinutes) && timeInMinutes > 0) {
      setIsVisible(true);
      const totalTimeInSeconds = timeInMinutes * 60;
      setRemainingTime(totalTimeInSeconds);
      
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      alert("Please enter a valid number of minutes.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
    <div className="min-h-screen mt-20 flex flex-col items-center justify-center bg-yellow-300 bg-transparent p-6">
      {isVisible && (
        <div id="quote-box" className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-lg text-center transform transition-all hover:scale-105 duration-300">
          <h1 className="text-3xl font-bold text-yellow-800 dark:text-white mb-4">Daily Inspiration</h1>
          <div id="text" className="mb-4">
            <p className="text-2xl font-semibold text-yellow-700 dark:text-gray-300 italic">{quote}</p>
          </div>
          <div id="author" className="mb-6">
            <p className="text-lg font-light text-yellow-500 dark:text-gray-400">- {author}</p>
          </div>
          <button 
            onClick={handleClick} 
            id="new-quote"
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            New Quote
          </button>
          <div id="timer" className="mt-6 text-lg text-yellow-700 dark:text-gray-300 font-semibold">
            Time Remaining: {formatTime(remainingTime)}
          </div>
        </div>
      )}

      <div className="mt-12 flex flex-col items-center">
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Enter time in minutes"
          className="w-72 p-4 text-lg rounded-full shadow-md border border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
        />
        <button 
          onClick={handleStartTimer} 
          className="w-72 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Start Timer
        </button>
      </div>

      <Link to="/services" className="mt-12">
        <button className="w-40 py-2 bg-yellow-600 text-white font-bold rounded-full shadow-md hover:bg-yellow-700 transition-colors duration-200">
          Back to Services
        </button>
      </Link>
    </div>
    </>
  );
};

export default Quotes;

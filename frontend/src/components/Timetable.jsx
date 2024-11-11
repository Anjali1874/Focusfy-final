import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";

const Timetable = () => {
  const [subjects, setSubjects] = useState("");
  const [interval, setInterval] = useState(1);
  const [breakTime, setBreakTime] = useState(15);
  const [timetable, setTimetable] = useState([]);
  const [markedItems, setMarkedItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showBreaks, setShowBreaks] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const generateTimetable = (subjectArray, interval) => {
    const startTime = new Date();
    let currentTime = startTime;

    const timetableWithBreaks = subjectArray.reduce((acc, subject, index) => {
      const time = new Date(currentTime.getTime());
      acc.push({
        id: index * 2,
        name: subject.trim(),
        time: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        marked: false,
        isBreak: false,
        startTime: new Date(currentTime),
      });

      setTimeout(
        () =>
          sendNotification(
            `Time to Study: ${subject.trim()}, Start studying ${subject.trim()} now!`
          ),
        currentTime.getTime() - startTime.getTime()
      );
      currentTime = new Date(time.getTime() + interval * 60 * 60 * 1000);

      if (showBreaks && index < subjectArray.length - 1) {
        const breakTimeSlot = new Date(currentTime.getTime());
        currentTime = new Date(currentTime.getTime() + breakTime * 60 * 1000);
        acc.push({
          id: index * 2 + 1,
          name: "Break Time",
          time: breakTimeSlot.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          marked: false,
          isBreak: true,
        });

        setTimeout(
          () =>
            sendNotification(
              `'Break Time!', Take a break for ${breakTime} minutes!`
            ),
          breakTimeSlot.getTime() - startTime.getTime()
        );
        setTimeout(
          () =>
            sendNotification("Break Over", "Get back to your study session!"),
          currentTime.getTime() - startTime.getTime()
        );
      }

      return acc;
    }, []);

    return timetableWithBreaks;
  };

  const handleGetTimetable = () => {
    const subjectArray = subjects.split(",").map((subj) => subj.trim());
    const newTimetable = generateTimetable(subjectArray, interval);
    setTimetable(newTimetable);
  };

  const toggleMark = (id) => {
    const updatedTimetable = timetable.map((item) =>
      item.id === id ? { ...item, marked: !item.marked } : item
    );
    setTimetable(updatedTimetable);
    setMarkedItems(
      updatedTimetable.filter((item) => item.marked).map((item) => item.name)
    );
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center gap-10 py-10 px-5 transition-colors duration-300 mt-20 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="md:w-1/2 mb-6 md:mb-0">
        <img
          src="https://img.freepik.com/free-vector/tiny-people-sitting-huge-clock_74855-7880.jpg?w=996"
          alt="Clock Illustration"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center bg-gradient-to-b from-blue-100 to-blue-50 dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-700 shadow-xl rounded-lg p-8 max-w-4xl w-full">
        <div className="md:w-1/2 flex flex-col items-center md:items-start">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-blue-800 dark:text-white">
            📚 Study Timetable Generator
          </h2>

          <textarea
            className="w-full p-4 bg-blue-50 dark:bg-gray-800 dark:text-white border border-blue-200 dark:border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            rows={3}
            placeholder="Enter subjects separated by commas"
          />

          <div className="mb-4 w-full">
            <label className="block text-lg font-semibold mb-1 text-white">
              Study Interval (hours):
            </label>
            <input
              type="number"
              className="w-full p-3 bg-blue-50 dark:bg-gray-800 dark:text-white border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              min="1"
            />
          </div>

          <div className="mb-6 w-full">
            <label className="block text-lg font-semibold mb-1 text-white">
              Break Time (minutes):
            </label>
            <input
              type="number"
              className="w-full p-3 bg-blue-50 dark:bg-gray-800 dark:text-white border border-blue-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={breakTime}
              onChange={(e) => setBreakTime(e.target.value)}
              min="5"
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            onClick={handleGetTimetable}
          >
            Generate Timetable
          </button>

          {timetable.length > 0 && (
            <div className="mt-8 w-full">
              <h3 className="text-2xl font-bold text-center text-blue-800 dark:text-white mb-4">
                Your Timetable
              </h3>
              <ul className="space-y-3">
                {timetable.map((item) => (
                  <li
                    key={item.id}
                    className={`p-3 rounded-lg flex justify-between items-center shadow-md ${
                      item.isBreak
                        ? "bg-yellow-100 dark:bg-yellow-700"
                        : item.marked
                        ? "bg-green-100 dark:bg-green-700"
                        : "bg-blue-50 dark:bg-gray-800"
                    } cursor-pointer`}
                    onClick={() => toggleMark(item.id)}
                  >
                    <span
                      className={`${
                        item.isBreak
                          ? "text-yellow-800 dark:text-yellow-200"
                          : "text-gray-900 dark:text-white"
                      } font-medium`}
                    >
                      {item.name} - {item.time}
                    </span>
                    {item.marked && (
                      <span className="text-green-600 dark:text-green-200 font-bold">
                        ✔
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="w-full mt-6 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition duration-300"
            onClick={() => setFocusMode(!focusMode)}
          >
            {focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
          </button>

          <Link
            to="/services"
            className="w-full mt-6 inline-block text-center bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Back to Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Timetable;

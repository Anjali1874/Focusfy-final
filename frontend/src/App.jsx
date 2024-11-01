import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Service from "./components/Services";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useAuth } from "./context/authProvider";
import { Toaster } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";

function App() {
  const { authUser } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-fixed flex flex-col dark:text-white">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/services" element={authUser ? <Service /> : <Navigate to="/login" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;

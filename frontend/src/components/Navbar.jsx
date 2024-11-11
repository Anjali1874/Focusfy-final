import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authProvider";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const { authUser, setAuthUser } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    const element = document.documentElement;
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthUser(null);
    navigate("/");
  };

  const navItems = (
    <>
      <li>
        <Link to="/" className="py-2 text-xl text-white rounded-md hover:bg-yellow-500 hover:text-white">Home</Link>
      </li>
      <li>
        <Link to="/services" className="py-2 text-xl text-white rounded-md hover:bg-yellow-500 hover:text-white">Services</Link>
      </li>
      <li>
        <Link to="/contact" className="py-2 text-xl text-white rounded-md hover:bg-yellow-500 hover:text-white">Contact</Link>
      </li>
      <li>
        <Link to="/about" className="py-2 text-xl text-white rounded-md hover:bg-yellow-500 hover:text-white">About</Link>
      </li>
    </>
  );

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 max-w-screen-2xl mx-auto px-4 md:px-20 transition-all duration-300 ease-in-out ${
        sticky ? "shadow-lg" : ""
      }`}
      style={{
        backdropFilter: "blur(15px) saturate(180%)", // Enhanced blur and color saturation for glassy effect
        backgroundColor: "rgba(255, 255, 255, 0.2)", // Adjust opacity for transparency
        border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border for definition
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Shadow for depth
        borderRadius: "12px", // Rounded corners for smooth look
      }}
    >
      <div className="navbar text-white">
        <div className="navbar-start">
          <div className="dropdown">
            <button tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              {navItems}
            </ul>
          </div>
          <Link to="/" className="text-3xl font-bold text-yellow-500">FocusFy</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-yellow-500">{navItems}</ul>
        </div>
        <div className="navbar-end space-x-3">
          {authUser ? (
            <>
              <button onClick={handleLogout} className="px-4 py-2 bg-yellow-500 text-white rounded-md">Logout</button>
              <Link to='/profile'><span className="material-symbols-outlined">account_circle</span></Link>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 bg-yellow-500 text-white rounded-md">LogIn</Link>
              <Link to="/signup" className="px-4 py-2 bg-yellow-500 text-white rounded-md">SignUp</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

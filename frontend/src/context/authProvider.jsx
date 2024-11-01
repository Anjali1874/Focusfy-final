import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth context
const AuthContext = createContext();

// AuthProvider component to wrap the application
export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);

    // Check for token in localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Optionally, decode the token to get user details if it's a JWT
            const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT token payload
            setAuthUser(user); // Set user details in state
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('authToken', token);
        const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT token payload
        setAuthUser(user); // Set user details in state
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthUser(null);
    };

    return (
        <AuthContext.Provider value={{ authUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authProvider';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');  // Reset any previous error
    
        try {
            const response = await axios.post('http://localhost:4125/api/auth/login', {
                email,
                password,
            }); 
            if (response.status === 200) {  // Check for 200 status code 
                const token = response.data.token;
                localStorage.setItem('authToken', token); // Save token to localStorage
                setAuthUser(token);
                // Navigate to the 'services' page
                alert("Succesfully Logged in!!")
                navigate('/services');
            } else {
                // In case the server response is not 200 but some other status code
                alert("error");
                setError(response.data.message || 'Invalid login credentials');
            }
        } catch (err) {
            // Handle errors such as network issues or server failures
            setError('An error occurred. Please try again later.');
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

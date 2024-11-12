import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/authProvider';
import bg from '../assets/bg.mp4';

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
                alert("Successfully Logged in!!")
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
        <div className="relative h-screen w-full bg-[#3E2723] p-4 flex justify-center items-center">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                loop
                muted
            >
                <source src={bg} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="relative z-10 flex items-center justify-center w-full p-8">
                <div className="grid gap-8 w-full max-w-md mx-auto">
                    <section
                        id="back-div"
                        className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] rounded-3xl"
                    >
                        <div className="border-8 border-transparent rounded-xl bg-[#4E342E] shadow-xl p-8 m-2">
                            <h1 className="text-5xl font-bold text-center cursor-default text-[#FFECB3]">
                                Log in
                            </h1>
                            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-lg text-[#FFECB3]"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        className="border p-3 shadow-md bg-[#6D4C41] text-[#FFECB3] border-[#5D4037] rounded-lg w-full focus:ring-2 focus:ring-[#FFB74D] transition transform hover:scale-105 duration-300"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-lg text-[#FFECB3]"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        className="border p-3 shadow-md bg-[#6D4C41] text-[#FFECB3] border-[#5D4037] rounded-lg w-full focus:ring-2 focus:ring-[#FFB74D] transition transform hover:scale-105 duration-300"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <a
                                    href="#"
                                    className="text-[#FFB74D] text-sm transition hover:underline"
                                >
                                    Forget your password?
                                </a>
                                <button
                                    className="w-full p-3 mt-4 text-white bg-[#FFB74D] rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FFD54F]"
                                    type="submit"
                                >
                                    LOG IN
                                </button>
                            </form>
                            <div className="flex flex-col mt-4 text-sm text-center text-[#FFECB3]">
                                <p>
                                    Don't have an account?
                                    <a
                                        href="/signup"
                                        className="text-[#FFB74D] transition hover:underline"
                                    >
                                        Sign Up
                                    </a>
                                </p>
                            </div>
                            <div id="third-party-auth" className="flex justify-center gap-4 mt-5">
                                <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                                    <img
                                        className="w-6 h-6"
                                        src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                                        alt="Google"
                                    />
                                </button>
                                <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                                    <img
                                        className="w-6 h-6"
                                        src="https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/"
                                        alt="LinkedIn"
                                    />
                                </button>
                                <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                                    <img
                                        className="w-6 h-6 dark:invert"
                                        loading="lazy"
                                        src="https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/"
                                        alt="GitHub"
                                    />
                                </button>
                            </div>
                            <div className="mt-4 text-center text-sm text-[#8D6E63]">
                                <p>
                                    By signing in, you agree to our{" "}
                                    <a href="#" className="text-[#FFB74D] transition hover:underline">
                                        Terms
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-[#FFB74D] transition hover:underline">
                                        Privacy Policy
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Login;

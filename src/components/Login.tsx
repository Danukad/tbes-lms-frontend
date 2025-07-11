import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginResponse, ApiError } from '../types';

const Login: React.FC = () => {
    const [uniqueID, setUniqueID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post<LoginResponse>('/api/auth/login', {
                uniqueID,
                password,
            });
            localStorage.setItem('token', response.data.token);
            const { role } = response.data.user;

            if (role === 'superadmin') {
                navigate('/superadmin');
            } else if (role === 'manager') {
                navigate('/manager');
            } else if (role === 'tutor') {
                navigate('/tutor');
            } else if (role === 'student') {
                navigate('/student');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            const apiError = err.response?.data as ApiError;
            setError(apiError?.error || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="uniqueID" className="block text-gray-700 mb-2">
                            Unique ID
                        </label>
                        <input
                            type="text"
                            id="uniqueID"
                            value={uniqueID}
                            onChange={(e) => setUniqueID(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserManagement from './UserManagement';
import CourseManagement from './CourseManagement';
import ActivateAccount from './ActivateAccount';
import TutorManagement from './TutorManagement'; // New import
import WebsiteSettings from './Settings';
const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [userRole, setUserRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/loginUser');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const role = response.data.role;
                setUserRole(role);
                if (role !== 'manager' && role !== 'student') {
                    navigate('/dashboard');
                }
            }
            catch (err) {
                setError('Failed to authenticate. Please log in again.');
                navigate('/loginUser');
            }
        };
        fetchUserRole();
    }, [navigate]);
    if (!userRole) {
        return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#364CE2] to-[#010D60]">
                <div className="text-white text-xl">Loading...</div>
            </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-br from-[#364CE2] to-[#010D60] font-inter">
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-[#010D60] p-6 h-screen sticky top-0">
                    <h1 className="text-2xl font-bold text-white mb-8">LMS Admin</h1>
                    <nav className="space-y-2">
                        {(userRole === 'manager') && (<>
                                <button onClick={() => setActiveTab('users')} className={`w-full text-left py-3 px-4 rounded-lg ${activeTab === 'users' ? 'bg-[#C9A500] text-black' : 'text-white hover:bg-[#C9A500] hover:text-black'}`}>
                                    User Management
                                </button>
                                <button onClick={() => setActiveTab('activate')} className={`w-full text-left py-3 px-4 rounded-lg ${activeTab === 'activate' ? 'bg-[#C9A500] text-black' : 'text-white hover:bg-[#C9A500] hover:text-black'}`}>
                                    Activate Account
                                </button>
                                <button onClick={() => setActiveTab('tutors')} className={`w-full text-left py-3 px-4 rounded-lg ${activeTab === 'tutors' ? 'bg-[#C9A500] text-black' : 'text-white hover:bg-[#C9A500] hover:text-black'}`}>
                                    Tutor Management
                                </button>

                            </>)}
                        {userRole === 'manager' && (<>
                                <button onClick={() => setActiveTab('courses')} className={`w-full text-left py-3 px-4 rounded-lg ${activeTab === 'courses' ? 'bg-[#C9A500] text-black' : 'text-white hover:bg-[#C9A500] hover:text-black'}`}>
                                    Course Management
                                </button>
                                <button onClick={() => setActiveTab('settings')} className={`w-full text-left py-3 px-4 rounded-lg ${activeTab === 'settings' ? 'bg-[#C9A500] text-black' : 'text-white hover:bg-[#C9A500] hover:text-black'}`}>
                                    Website Settings
                                </button>
                            </>)}
                        <button onClick={() => {
            localStorage.removeItem('token');
            navigate('/loginUser');
        }} className="w-full text-left py-3 px-4 rounded-lg text-white hover:bg-red-600">
                            Logout
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {error && (<div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                                {error}
                            </div>)}
                        <div className="bg-white rounded-xl shadow-xl p-8">
                            {activeTab === 'users' && (userRole === 'admin' || userRole === 'manager') && <UserManagement />}
                            {activeTab === 'activate' && (userRole === 'superadmin' || userRole === 'manager') && <ActivateAccount />}
                            {activeTab === 'tutors' && (userRole === 'admin' || userRole === 'manager') && <TutorManagement />}
                            {activeTab === 'courses' && (userRole === 'admin' || userRole === 'manager') && <CourseManagement />}
                            {activeTab === 'settings' && userRole === 'superadmin' && <WebsiteSettings />}

                        </div>
                    </div>
                </div>
            </div>
        </div>);
};
export default ManagerDashboard;

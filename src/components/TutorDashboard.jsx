import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const TutorDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No authentication token found');
                    navigate('/loginUser');
                    return;
                }
                const userRes = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (userRes.data.role !== 'tutor') {
                    setError('Access denied: Tutor only');
                    navigate('/dashboard');
                    return;
                }
                const coursesRes = await axios.get('/api/admin/my-courses', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourses(coursesRes.data);
                setLoading(false);
            }
            catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch courses');
                navigate('/loginUser');
            }
        };
        fetchCourses();
    }, [navigate]);
    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }
    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }
    return (<div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Tutor Dashboard</h1>
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Your Assigned Courses</h2>
                {courses.length === 0 ? (<p className="text-gray-600">No courses assigned</p>) : (<div className="space-y-4">
                        {courses.map((course) => (<div key={course._id} className="p-4 bg-gray-50 rounded-md">
                                <h3 className="text-xl font-medium">{course.title}</h3>
                                <p className="text-gray-600">{course.description}</p>
                                <p className="text-gray-600">Duration: {course.duration}</p>
                            </div>))}
                    </div>)}
                <button onClick={() => navigate('/dashboard')} className="mt-6 w-full max-w-xs mx-auto block bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                    Back to Dashboard
                </button>
            </div>
        </div>);
};
export default TutorDashboard;

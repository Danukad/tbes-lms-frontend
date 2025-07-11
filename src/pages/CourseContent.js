import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const CourseContent = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const BASE_URL = 'http://192.168.8.130:5000';
    useEffect(() => {
        const fetchCourseContent = async () => {
            if (!courseId) {
                setError('No course ID provided');
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/api/courses/${courseId}/content`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000,
                });
                setCourse(response.data);
            }
            catch (err) {
                setError(err.response?.data?.error || 'Failed to load course content');
            }
            finally {
                setLoading(false);
            }
        };
        fetchCourseContent();
        const handleContentUpdated = () => {
            if (courseId)
                fetchCourseContent();
        };
        window.addEventListener('courseContentUpdated', handleContentUpdated);
        return () => {
            window.removeEventListener('courseContentUpdated', handleContentUpdated);
        };
    }, [courseId]);
    if (loading)
        return <div className="text-center p-4">Loading...</div>;
    if (error)
        return <div className="text-center p-4 text-red-600">{error}</div>;
    if (!course)
        return <div className="text-center p-4">Course not found</div>;
    return (<div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto p-4">
                <h1 className="text-3xl font-bold">{course.title}</h1>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Panel */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="text-yellow-500">{'★'.repeat(Math.floor(course.rating))}</span>
                        <span>{course.rating} ({course.reviews} reviews)</span>
                    </div>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <ul className="text-green-600 list-disc list-inside mb-4">
                        <li>Comprehensive Curriculum</li>
                        <li>Expert Instructors</li>
                        <li>Hands-On Projects</li>
                        <li>Career-Ready Skills</li>
                    </ul>
                    <div className="space-x-2">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">Enroll Now</button>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">See Curriculum</button>
                    </div>
                    <img src="https://via.placeholder.com/150" alt="Student" className="mt-4 rounded-lg" onError={(e) => {
            console.error('Failed to load placeholder image, using fallback');
            e.currentTarget.src = 'https://placehold.co/150'; // Alternative placeholder service
        }}/>
                </div>

                {/* Right Panel */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between mb-4">
                        <button className="text-orange-500 font-semibold">Overview</button>
                        <button className="text-gray-600 hover:text-orange-500">Course Info</button>
                        <button className="text-gray-600 hover:text-orange-500">Download Material</button>
                        <button className="text-gray-600 hover:text-orange-500">Testimonials</button>
                        <button className="text-gray-600 hover:text-orange-500">Pricing</button>
                        <button className="text-gray-600 hover:text-orange-500">FAQ</button>
                    </div>

                    {/* What You'll Learn */}
                    <h3 className="text-xl font-semibold mb-2">What You'll Learn</h3>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                        {course.objectives.map((obj, index) => (<li key={index}>{obj}</li>))}
                    </ul>

                    {/* Tech Stack */}
                    <h3 className="text-xl font-semibold mb-2">Stack</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        {course.stack.map((tech, index) => (<span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded">{tech}</span>))}
                    </div>

                    {/* Course Overview */}
                    <h3 className="text-xl font-semibold mb-2">Course Overview</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        {course.overview.map((item, index) => (<li key={index}>{item}</li>))}
                    </ul>

                    {/* Stats */}
                    <div className="flex space-x-4 text-sm text-gray-600 mt-4">
                        <span>{course.enrolled} Total Enrolled</span>
                        <span>Full-Time: {course.duration}</span>
                        <span>{course.seats} Seats Free</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">{course.levels} | {course.certificate}</div>
                </div>
            </div>

            {/* Video Section */}
            <div className="max-w-7xl mx-auto p-4 mt-6">
                <h3 className="text-xl font-semibold mb-4">Free Preview Chapters</h3>
                {course.freeVideos.map((video, index) => (<div key={index} className="mb-4">
                        <video controls className="w-full h-64 rounded-lg">
                            <source src={video.url} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                        <h4 className="mt-2 text-lg font-medium">{video.title}</h4>
                    </div>))}
            </div>
        </div>);
};
export default CourseContent;

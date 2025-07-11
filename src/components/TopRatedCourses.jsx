import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import courseImage1 from '../assets/AdobeStock_109156115.jpg';
import courseImage2 from '../assets/AdobeStock_408757426.jpg';
import courseImage3 from '../assets/AdobeStock_1254882567.jpg';
import courseImage4 from '../assets/AdobeStock_1254882567.jpg';
const coursesData = [
    {
        id: 1,
        title: "25 Days Spoken English Camp",
        instructor: "Sajith Gamage",
        rating: 4.8,
        price: "Rs 35,000",
        image: courseImage1,
    },
    {
        id: 2,
        title: "17 Days Special English Camp",
        instructor: "Sajith Gamage",
        rating: 4.9,
        price: "Rs 35,000",
        image: courseImage2,
    },
    {
        id: 3,
        title: "After O/l Spoken English Camp",
        instructor: "Sajith Gamage",
        rating: 4.7,
        price: "Rs 35,000",
        image: courseImage3,
    },
];
const TopRatedCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState(coursesData);
    const [newCourseAnimation, setNewCourseAnimation] = useState([]);
    const handleClick = () => {
        navigate('/coursecontent');
    };
    useEffect(() => {
        const updateCourses = () => {
            const lastUpdate = localStorage.getItem('lastCourseUpdate');
            const today = new Date().toDateString();
            if (!lastUpdate || lastUpdate !== today) {
                const newCourse = {
                    id: courses.length + 1,
                    title: `New Course ${courses.length + 1}`,
                    instructor: "New Instructor",
                    rating: 4.5,
                    price: `$${(Math.random() * 40 + 40).toFixed(2)}`,
                    image: courseImage4,
                };
                setCourses((prev) => [newCourse, ...prev]);
                setNewCourseAnimation((prev) => [newCourse.id, ...prev]);
                localStorage.setItem('lastCourseUpdate', today);
            }
        };
        updateCourses();
        const interval = setInterval(updateCourses, 24 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [courses.length]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setNewCourseAnimation((prev) => prev.filter((id) => !courses.find((c) => c.id === id)));
        }, 2000); // Animation lasts 2 seconds
        return () => clearTimeout(timer);
    }, [newCourseAnimation, courses]);
    return (<div className="bg-[#ebedf0] min-h-screen flex flex-col items-center py-16 overflow-hidden">
            <h1 className="text-[40px] text-center font-bold bg-gradient-to-r from-[#364CE2] via-[#283BBE] to-[#010D60] text-transparent bg-clip-text leading-tight w-full max-w-[800px] mb-16">
                Top Rated Courses
            </h1>
            <div className="w-full max-w-[1200px] px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (<div key={course.id} className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${newCourseAnimation.includes(course.id) ? 'animate-new-course' : 'hover:shadow-lg'}`}>
                        <img src={course.image} alt={course.title} className="w-full h-[200px] object-cover"/>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {course.title}
                            </h2>
                            <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
                            <div className="flex items-center mb-2">
                                <span className="text-yellow-500">★</span>
                                <span className="ml-1 text-gray-800">{course.rating}</span>
                            </div>
                            <p className="text-gray-800 font-bold">{course.price}</p>
                            <button className="mt-4 bg-[#C9A500] text-white px-4 py-2 rounded-md hover:bg-[#A78A00] transition-colors" onClick={handleClick}>
                                Enroll Now
                            </button>
                        </div>
                        {newCourseAnimation.includes(course.id) && (<style>
                                {`
                  @keyframes newCourse {
                    0% { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0.2); }
                    50% { transform: scale(1.05); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); }
                    100% { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0.2); }
                  }
                  .animate-new-course {
                    animation: newCourse 2s ease-in-out;
                  }
                `}
                            </style>)}
                    </div>))}
            </div>
        </div>);
};
export default TopRatedCourses;

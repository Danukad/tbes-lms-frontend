import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer.tsx';

interface Course {
    _id: string;
    title: string;
    description: string;
    duration: string;
    instructor: string;
    price: number;
    image?: string;
}

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageError, setImageError] = useState('');
    const BASE_URL = 'http://192.168.8.130:5000';
    const IMAGE_BASE_URL = 'http://192.168.8.130:5000';
    const navigate = useNavigate();

    const fetchCourses = async (retryCount = 0) => {
        setLoading(true);
        setError('');
        const url = `${BASE_URL}/api/courses?page=${page}&limit=10`;
        console.log(`Fetching courses from ${url}`);
        try {
            const response = await axios.get(url, { timeout: 15000 });
            console.log('Courses response:', response.data);
            const fetchedCourses = response.data.courses || response.data || [];
            const total = response.data.total || fetchedCourses.length || 1;
            setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
            setTotalPages(Math.ceil(total / 10));
        } catch (err: any) {
            console.error('Fetch courses error:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                url: url,
            });
            const errorMsg = err.response?.data?.error || `Failed to load courses: ${err.message}`;
            setError(errorMsg);
            if (retryCount < 2 && err.response?.status !== 401 && err.response?.status !== 403) {
                console.log(`Retrying fetch courses (${retryCount + 1}/2)...`);
                setTimeout(() => fetchCourses(retryCount + 1), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = async (courseId: string) => {
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please log in to purchase a course');
                return;
            }
            await axios.post(`${BASE_URL}/api/courses/${courseId}/enroll`, {}, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000,
            });
            alert(`Successfully enrolled in course ${courseId}`);
        } catch (err: any) {
            console.error('Buy now error:', err);
            setError(err.response?.data?.error || 'Failed to purchase course');
        }
    };

    const handleViewCourse = (courseId: string) => {
        if (!courseId) {
            console.error('Course ID is undefined');
            return;
        }
        navigate(`/coursecontent/${courseId}`);
    };

    useEffect(() => {
        fetchCourses();

        const handleCourseCreated = () => {
            setPage(1);
            fetchCourses();
        };
        window.addEventListener('courseCreated', handleCourseCreated);

        return () => {
            window.removeEventListener('courseCreated', handleCourseCreated);
        };
    }, [page]);

    return (
        <>
            <div className="min-h-[100vh] xs:min-h-[80vh] sm:min-h-[85vh] flex flex-col items-center font-['Montserrat',sans-serif] py-4 xs:py-4 sm:py-6 px-3 xs:px-3 sm:px-4">
                <div className="w-full max-w-[90vw] xs:max-w-[92vw] sm:max-w-[1000px] md:max-w-[1200px] bg-white rounded-xl shadow-2xl p-4 xs:p-4 sm:p-6 md:p-8 absolute top-28">
                    <h2 className="text-xl xs:text-xl sm:text-2xl md:text-3xl font-bold mb-4 xs:mb-6 text-center">Our Courses</h2>
                    {(error || imageError) && (
                        <div className="bg-red-100 text-red-700 p-3 xs:p-4 rounded-lg mb-4 xs:mb-6 text-xs xs:text-xs sm:text-sm text-center max-w-[260px] xs:max-w-[260px] sm:max-w-[400px] mx-auto">
                            {error || imageError}
                            {error && (
                                <button
                                    onClick={() => fetchCourses()}
                                    className="ml-2 xs:ml-3 bg-[#C9A500] text-black px-2 xs:px-3 py-1 xs:py-1.5 rounded-md hover:bg-[#A78A00] text-xs xs:text-xs sm:text-sm mt-2 xs:mt-0"
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                    )}
                    <>
                        {loading && <div className="text-gray-500 text-xs xs:text-xs sm:text-sm text-center">Loading...</div>}
                        <div className="grid gap-3 xs:gap-4 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {courses.map((course: Course) => {
                                const imagePath = course.image ? course.image.replace(/^courses\//, '') : '';
                                return (
                                    <div key={course._id} className="border rounded-lg p-3 xs:p-4 bg-gray-50 flex flex-col">
                                        {imagePath ? (
                                            <img
                                                src={`${IMAGE_BASE_URL}/uploads/courses/${imagePath}`}
                                                alt={course.title}
                                                className="w-full h-[150px] xs:h-[150px] sm:h-[200px] object-contain rounded-md mb-2 xs:mb-3"
                                                onError={(e) => {
                                                    console.error(`Failed to load image: ${IMAGE_BASE_URL}/uploads/courses/${imagePath}`);
                                                    e.currentTarget.src = `https://placehold.co/300x200?text=${encodeURIComponent(course.title)}`;
                                                    setImageError('Some course images failed to load.');
                                                }}
                                                onLoad={() => console.log(`Loaded image: ${IMAGE_BASE_URL}/uploads/courses/${imagePath}`)}
                                            />
                                        ) : (
                                            <img
                                                src={`https://placehold.co/300x200?text=${encodeURIComponent(course.title)}`}
                                                alt={course.title}
                                                className="w-full h-[150px] xs:h-[150px] sm:h-[200px] object-contain rounded-md mb-2 xs:mb-3"
                                            />
                                        )}
                                        <h3 className="font-bold text-base xs:text-base sm:text-lg">{course.title}</h3>
                                        <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">{course.description}</p>
                                        <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">Duration: {course.duration}</p>
                                        <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">Instructor: {course.instructor}</p>
                                        <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-2 xs:mb-3 flex-1">Price: ${course.price}</p>
                                        <div className="flex gap-2 xs:gap-3 mt-auto">
                                            <button
                                                onClick={() => handleBuyNow(course._id)}
                                                className="flex-1 bg-[#C9A500] text-black px-2 xs:px-3 py-1 xs:py-1.5 rounded-md hover:bg-[#A78A00] text-xs xs:text-xs sm:text-sm"
                                            >
                                                Buy Now
                                            </button>
                                            <button
                                                onClick={() => handleViewCourse(course._id)}
                                                className="flex-1 bg-gray-600 text-white px-2 xs:px-3 py-1 xs:py-1.5 rounded-md hover:bg-gray-700 text-xs xs:text-xs sm:text-sm"
                                            >
                                                View Course
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                    <div className="flex justify-between mt-4 xs:mt-6">
                        <button
                            onClick={() => setPage(page > 1 ? page - 1 : 1)}
                            disabled={page === 1}
                            className="px-3 xs:px-4 py-1.5 xs:py-2 bg-[#C9A500] text-black rounded-lg disabled:opacity-50 text-xs xs:text-xs sm:text-sm"
                        >
                            Previous
                        </button>
                        <span className="text-xs xs:text-xs sm:text-sm">Page {page} of {totalPages}</span>
                        <button
                            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                            disabled={page === totalPages}
                            className="px-3 xs:px-4 py-1.5 xs:py-2 bg-[#C9A500] text-black rounded-lg disabled:opacity-50 text-xs xs:text-xs sm:text-sm"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <div className="relative top-60">
                <Footer />
            </div>
        </>
    );
};

export default Courses;
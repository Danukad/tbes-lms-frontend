import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Course {
    _id: string;
    title: string;
    description: string;
    duration: string;
    instructor: string;
    price: number;
    image?: string;
}

interface JwtPayload {
    id: string;
    role: string;
}

const CourseManagement: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [newCourse, setNewCourse] = useState({
        title: '',
        description: '',
        duration: '',
        instructor: '',
        price: '',
        image: null as File | null,
    });
    const [userRole, setUserRole] = useState<string>('');
    const BASE_URL = 'http://192.168.8.130:5000';
    const IMAGE_BASE_URL = 'http://192.168.8.130:5000';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<JwtPayload>(token);
                setUserRole(decoded.role);
            } catch (err) {
                console.error('JWT decode error:', err);
                setError('Invalid token');
            }
        }
        fetchCourses();
    }, [page]);

    const fetchCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/admin/courses?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000,
            });
            setCourses(response.data.courses || []);
            setTotalPages(Math.ceil(response.data.total / 10));
        } catch (err: any) {
            console.error('Fetch courses error:', err);
            setError(err.response?.data?.error || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const { title, description, duration, instructor, price, image } = newCourse;

        if (!title || !description || !duration || !instructor || !price) {
            setError('All fields except image are required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('duration', duration);
            formData.append('instructor', instructor);
            formData.append('price', price);
            if (image) {
                formData.append('image', image);
                console.log(`Uploading image: ${image.name}`);
            }

            const response = await axios.post(`${BASE_URL}/api/courses`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 15000,
            });

            console.log('Created course:', response.data);
            setCourses([...courses, response.data]);
            setNewCourse({
                title: '',
                description: '',
                duration: '',
                instructor: '',
                price: '',
                image: null,
            });

            window.dispatchEvent(new Event('courseCreated'));
        } catch (err: any) {
            console.error('Create course error:', err);
            setError(err.response?.data?.error || 'Failed to create course');
        }
    };

    const handleDeleteCourse = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/api/courses/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000,
            });
            setCourses(courses.filter((c) => c._id !== id));
            window.dispatchEvent(new Event('courseCreated'));
        } catch (err: any) {
            console.error('Delete course error:', err);
            setError(err.response?.data?.error || 'Failed to delete course');
        }
    };

    if (!['superadmin', 'admin', 'manager'].includes(userRole)) {
        return <div className="text-red-700 text-center mt-4 xs:mt-6 text-xs xs:text-sm sm:text-base">Access Denied</div>;
    }

    return (
        <div className="min-h-[75vh] xs:min-h-[80vh] sm:min-h-[85vh] bg-[#f6f5f7] flex flex-col items-center font-['Montserrat',sans-serif] py-4 xs:py-4 sm:py-6 px-3 xs:px-3 sm:px-4">
            <div className="w-full max-w-[90vw] xs:max-w-[92vw] sm:max-w-[1000px] md:max-w-[1200px] bg-white rounded-xl shadow-2xl p-4 xs:p-4 sm:p-6 md:p-8">
                <h2 className="text-xl xs:text-xl sm:text-2xl md:text-3xl font-bold mb-4 xs:mb-6 text-center">Manage Courses</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 xs:p-4 rounded-lg mb-4 xs:mb-6 text-xs xs:text-xs sm:text-sm text-center max-w-[260px] xs:max-w-[260px] sm:max-w-[400px] mx-auto">
                        {error}
                        <button
                            onClick={() => fetchCourses()}
                            className="ml-2 xs:ml-3 bg-[#C9A500] text-black px-2 xs:px-3 py-1 xs:py-1.5 rounded-md hover:bg-[#A78A00] text-xs xs:text-xs sm:text-sm mt-2 xs:mt-0"
                        >
                            Retry
                        </button>
                    </div>
                )}
                {loading && <div className="text-gray-500 text-xs xs:text-xs sm:text-sm text-center">Loading...</div>}

                {['superadmin', 'admin', 'manager'].includes(userRole) && (
                    <form onSubmit={handleCreateCourse} className="mb-6 xs:mb-8 grid gap-3 xs:gap-4 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-[260px] xs:max-w-[260px] sm:max-w-[800px] mx-auto">
                        <input
                            type="text"
                            placeholder="Title"
                            value={newCourse.title}
                            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                            className="border p-2 xs:p-2 sm:p-3 rounded-lg text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                            className="border p-2 xs:p-2 sm:p-3 rounded-lg text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Duration"
                            value={newCourse.duration}
                            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                            className="border p-2 xs:p-2 sm:p-3 rounded-lg text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Instructor"
                            value={newCourse.instructor}
                            onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                            className="border p-2 xs:p-2 sm:p-3 rounded-lg text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={newCourse.price}
                            onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                            className="border p-2 xs:p-2 sm:p-3 rounded-lg text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]"
                            required
                        />
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={(e) => setNewCourse({ ...newCourse, image: e.target.files?.[0] || null })}
                            className="border p-2 xs:p-2 sm:p-3 rounded-lg text-xs xs:text-xs sm:text-sm"
                        />
                        <button
                            type="submit"
                            className="bg-[#C9A500] text-black p-2 xs:p-2 sm:p-3 rounded-lg hover:bg-[#A78A00] text-xs xs:text-xs sm:text-sm font-bold uppercase col-span-1 xs:col-span-1 sm:col-span-2 md:col-span-3"
                        >
                            Create Course
                        </button>
                    </form>
                )}

                <div className="grid gap-3 xs:gap-4 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {courses.map((course: Course) => {
                        const imagePath = course.image ? course.image.replace(/^courses\//, '') : '';
                        return (
                            <div key={course._id} className="border rounded-lg p-3 xs:p-4 bg-gray-50 flex flex-col">
                                {imagePath ? (
                                    <img
                                        src={`${IMAGE_BASE_URL}/Uploads/courses/${imagePath}`}
                                        alt={course.title}
                                        className="w-full h-[150px] xs:h-[150px] sm:h-[200px] object-contain rounded-md mb-2 xs:mb-3"
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${IMAGE_BASE_URL}/Uploads/courses/${imagePath}`);
                                            e.currentTarget.src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(course.title)}`;
                                        }}
                                        onLoad={() => console.log(`Loaded image: ${IMAGE_BASE_URL}/Uploads/courses/${imagePath}`)}
                                    />
                                ) : (
                                    <img
                                        src={`https://via.placeholder.com/300x200?text=${encodeURIComponent(course.title)}`}
                                        alt={course.title}
                                        className="w-full h-[150px] xs:h-[150px] sm:h-[200px] object-contain rounded-md mb-2 xs:mb-3"
                                    />
                                )}
                                <h3 className="font-bold text-base xs:text-base sm:text-lg">{course.title}</h3>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">{course.description}</p>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">Duration: {course.duration}</p>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">Instructor: {course.instructor}</p>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-2 xs:mb-3 flex-1">Price: ${course.price}</p>
                                {['superadmin', 'admin', 'manager'].includes(userRole) && (
                                    <button
                                        onClick={() => handleDeleteCourse(course._id)}
                                        className="text-red-600 hover:underline text-xs xs:text-xs sm:text-sm mt-auto"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

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
    );
};

export default CourseManagement;
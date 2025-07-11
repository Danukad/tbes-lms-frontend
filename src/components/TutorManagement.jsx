import { useState, useEffect } from 'react';
import axios from 'axios';
const TutorManagement = () => {
    const [tutors, setTutors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [assignForm, setAssignForm] = useState({ tutorId: '', courseId: '' });
    useEffect(() => {
        fetchTutors();
        fetchCourses();
    }, [page]);
    const fetchTutors = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/admin/tutors?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTutors(response.data.tutors);
            setTotalPages(response.data.pages);
        }
        catch (err) {
            setError('Failed to load tutors');
        }
        setLoading(false);
    };
    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/courses?page=1&limit=100', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourses(response.data.courses);
        }
        catch (err) {
            setError('Failed to load courses');
        }
    };
    const handleAssignCourse = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/tutors/assign-course', assignForm, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAssignForm({ tutorId: '', courseId: '' });
            fetchTutors(); // Refresh tutor list
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to assign course');
        }
    };
    return (<div>
            <h2 className="text-2xl font-bold mb-6">Tutor Management</h2>
            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}
            {loading && <div className="text-gray-500">Loading...</div>}

            {/* Assign Course Form */}
            <form onSubmit={handleAssignCourse} className="mb-8 grid gap-4 sm:grid-cols-2">
                <select value={assignForm.tutorId} onChange={(e) => setAssignForm({ ...assignForm, tutorId: e.target.value })} className="border p-3 rounded-lg">
                    <option value="">Select Tutor</option>
                    {tutors.map((tutor) => (<option key={tutor._id} value={tutor._id}>
                            {tutor.fullName} ({tutor.uniqueID})
                        </option>))}
                </select>
                <select value={assignForm.courseId} onChange={(e) => setAssignForm({ ...assignForm, courseId: e.target.value })} className="border p-3 rounded-lg">
                    <option value="">Select Course</option>
                    {courses.map((course) => (<option key={course._id} value={course._id}>
                            {course.title}
                        </option>))}
                </select>
                <button type="submit" className="bg-[#C9A500] text-black p-3 rounded-lg hover:bg-opacity-80 sm:col-span-2">
                    Assign Course
                </button>
            </form>

            {/* Tutor List */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="bg-[#C9A500]">
                        <th className="p-3 text-left">Unique ID</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Assigned Courses</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tutors.map((tutor) => (<tr key={tutor._id} className="border-b hover:bg-gray-100">
                            <td className="p-3">{tutor.uniqueID}</td>
                            <td className="p-3">{tutor.fullName}</td>
                            <td className="p-3">{tutor.email}</td>
                            <td className="p-3">
                                {tutor.assignedCourses && tutor.assignedCourses.length > 0
                ? tutor.assignedCourses
                    .map((courseId) => {
                    const course = courses.find((c) => c._id === courseId);
                    return course ? course.title : courseId;
                })
                    .join(', ')
                : 'None'}
                            </td>
                        </tr>))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1} className="px-4 py-2 bg-[#C9A500] text-black rounded-lg disabled:opacity-50">
                    Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages} className="px-4 py-2 bg-[#C9A500] text-black rounded-lg disabled:opacity-50">
                    Next
                </button>
            </div>
        </div>);
};
export default TutorManagement;

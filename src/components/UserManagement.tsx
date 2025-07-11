import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    uniqueID: string;
    fullName: string;
    email: string;
    role: string;
    phoneNumber?: string;
    city?: string;
    isActivated: boolean;
    selectedCourse?: string;
}

interface Course {
    _id: string;
    title: string;
}

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editUser, setEditUser] = useState<User | null>(null);
    const [addUserData, setAddUserData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        city: '',
        role: 'admin',
        selectedCourse: '',
        password: '',
    });
    const [addUserError, setAddUserError] = useState('');
    const [addUserSuccess, setAddUserSuccess] = useState('');
    const BASE_URL = 'http://192.168.8.130:5000';

    const fetchData = async (retryCount = 0) => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const [usersRes, coursesRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000,
                }),
                axios.get(`${BASE_URL}/api/admin/courses?page=1&limit=100`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000,
                }),
            ]);
            console.log('Users response:', usersRes.data);
            console.log('Courses response:', coursesRes.data);
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
            setCourses(Array.isArray(coursesRes.data.courses) ? coursesRes.data.courses : []);
            setLoading(false);
        } catch (err: any) {
            console.error('Fetch data error:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });
            let errorMsg = err.response?.data?.error || `Failed to fetch data: ${err.message}`;
            if (err.response?.status === 401) {
                errorMsg = 'Unauthorized: Please log in as an admin';
            } else if (err.response?.status === 403) {
                errorMsg = 'Forbidden: Admin or manager access required';
            }
            setError(errorMsg);
            setLoading(false);
            if (retryCount < 2 && err.response?.status !== 401 && err.response?.status !== 403) {
                console.log(`Retrying fetch data (${retryCount + 1}/2)...`);
                setTimeout(() => fetchData(retryCount + 1), 2000);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (user: User) => {
        setEditUser(user);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${BASE_URL}/api/admin/users/${editUser._id}`,
                editUser,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000,
                }
            );
            setUsers(users.map((user) => (user._id === editUser._id ? response.data : user)));
            setEditUser(null);
            setError('');
        } catch (err: any) {
            console.error('Update user error:', err);
            setError(err.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000,
            });
            setUsers(users.filter((user) => user._id !== id));
        } catch (err: any) {
            console.error('Delete user error:', err);
            setError(err.response?.data?.error || 'Failed to delete user');
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const { fullName, email, role, selectedCourse } = addUserData;

        if (!fullName || !email || !role) {
            setAddUserError('Full Name, Email, and Role are required');
            return;
        }
        if (role === 'student' && !selectedCourse) {
            setAddUserError('Selected Course is required for student role');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${BASE_URL}/api/admin/generate-id`,
                {
                    ...addUserData,
                    password: addUserData.password || undefined,
                    isActivated: role === 'student' ? undefined : false,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000,
                }
            );
            setUsers([...users, response.data.user]);
            setAddUserSuccess(`User added with ID: ${response.data.uniqueID}. Activate account to set password.`);
            setAddUserError('');
            setAddUserData({
                fullName: '',
                email: '',
                phoneNumber: '',
                city: '',
                role: 'admin',
                selectedCourse: '',
                password: '',
            });
        } catch (err: any) {
            console.error('Add user error:', err);
            setAddUserError(err.response?.data?.error || 'Failed to create user. Check email or server.');
            setAddUserSuccess('');
        }
    };

    const handleRoleChange = (role: string) => {
        setAddUserData({
            ...addUserData,
            role,
            selectedCourse: role === 'student' ? addUserData.selectedCourse : '',
        });
    };

    return (
        <div className="min-h-[75vh] xs:min-h-[80vh] sm:min-h-[85vh] bg-[#f6f5f7] flex flex-col items-center font-['Montserrat',sans-serif] py-4 xs:py-4 sm:py-6 px-3 xs:px-3 sm:px-4">
            <div className="w-full max-w-[90vw] xs:max-w-[92vw] sm:max-w-[1000px] md:max-w-[1200px] bg-white rounded-xl shadow-2xl p-4 xs:p-4 sm:p-6 md:p-8">
                <h2 className="text-xl xs:text-xl sm:text-2xl md:text-3xl font-bold mb-4 xs:mb-6 text-center">User Management</h2>

                {loading && <div className="text-gray-500 text-xs xs:text-xs sm:text-sm text-center">Loading...</div>}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 xs:p-4 rounded-lg mb-4 xs:mb-6 text-xs xs:text-xs sm:text-sm text-center max-w-[260px] xs:max-w-[260px] sm:max-w-[400px] mx-auto">
                        {error}
                        <button
                            onClick={() => fetchData()}
                            className="ml-2 xs:ml-3 bg-[#c9a500] text-black px-2 xs:px-3 py-1 xs:py-1.5 rounded-md hover:bg-[#a78a00] text-xs xs:text-xs sm:text-sm mt-2 xs:mt-0"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Add User Form */}
                <div className="mb-6 xs:mb-8">
                    <h3 className="text-lg xs:text-lg sm:text-xl font-semibold mb-4 xs:mb-6">Add User</h3>
                    <form onSubmit={handleAddUser} className="grid gap-3 xs:gap-4 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-[260px] xs:max-w-[260px] sm:max-w-[800px] mx-auto">
                        <div>
                            <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Full Name</label>
                            <input
                                type="text"
                                value={addUserData.fullName}
                                onChange={(e) => setAddUserData({ ...addUserData, fullName: e.target.value })}
                                className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Email</label>
                            <input
                                type="email"
                                value={addUserData.email}
                                onChange={(e) => setAddUserData({ ...addUserData, email: e.target.value })}
                                className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Phone Number</label>
                            <input
                                type="text"
                                value={addUserData.phoneNumber}
                                onChange={(e) => setAddUserData({ ...addUserData, phoneNumber: e.target.value })}
                                className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                            />
                        </div>
                        <div>
                            <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">City</label>
                            <input
                                type="text"
                                value={addUserData.city}
                                onChange={(e) => setAddUserData({ ...addUserData, city: e.target.value })}
                                className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                            />
                        </div>
                        <div>
                            <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Role</label>
                            <select
                                value={addUserData.role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                required
                            >
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="tutor">Tutor</option>
                                <option value="student">Student</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">
                                Selected Course {addUserData.role === 'student' && <span className="text-red-500">*</span>}
                            </label>
                            <select
                                value={addUserData.selectedCourse}
                                onChange={(e) => setAddUserData({ ...addUserData, selectedCourse: e.target.value })}
                                className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                disabled={addUserData.role !== 'student'}
                                required={addUserData.role === 'student'}
                            >
                                <option value="">Select a Course</option>
                                {courses.length > 0 ? (
                                    courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>
                                        No courses available
                                    </option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Temporary Password (Optional)</label>
                            <input
                                type="password"
                                value={addUserData.password}
                                onChange={(e) => setAddUserData({ ...addUserData, password: e.target.value })}
                                className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                placeholder="User will set password during activation"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[#c9a500] text-black p-2 xs:p-2 sm:p-3 rounded-lg hover:bg-[#a78a00] text-xs xs:text-xs sm:text-sm font-bold uppercase col-span-1 xs:col-span-1 sm:col-span-2 md:col-span-3"
                        >
                            Add User
                        </button>
                        {addUserError && (
                            <p className="text-red-500 text-xs xs:text-xs sm:text-sm mt-2 xs:mt-3 col-span-1 xs:col-span-1 sm:col-span-2 md:col-span-3">
                                {addUserError}
                            </p>
                        )}
                        {addUserSuccess && (
                            <p className="text-green-500 text-xs xs:text-xs sm:text-sm mt-2 xs:mt-3 col-span-1 xs:col-span-1 sm:col-span-2 md:col-span-3">
                                {addUserSuccess}
                            </p>
                        )}
                    </form>
                </div>

                {/* User List */}
                <div className="grid gap-3 xs:gap-4 grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {users.length === 0 ? (
                        <p className="text-gray-500 text-xs xs:text-xs sm:text-sm col-span-1 xs:col-span-1 sm:col-span-2 md:col-span-3">
                            No users available
                        </p>
                    ) : (
                        users.map((user) => (
                            <div key={user._id} className="border rounded-lg p-3 xs:p-4 bg-gray-50 flex flex-col">
                                <h3 className="font-bold text-base xs:text-base sm:text-lg">{user.fullName}</h3>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">ID: {user.uniqueID}</p>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">Email: {user.email}</p>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">Role: {user.role}</p>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-1 xs:mb-2">
                                    Course: {user.selectedCourse ? courses.find((c) => c._id === user.selectedCourse)?.title || 'N/A' : 'N/A'}
                                </p>
                                <p className="text-gray-600 text-xs xs:text-xs sm:text-sm mb-2 xs:mb-3 flex-1">
                                    Activated: {user.isActivated ? 'Yes' : 'No'}
                                </p>
                                <div className="flex space-x-2 xs:space-x-3 mt-auto">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-[#c9a500] hover:underline text-xs xs:text-xs sm:text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="text-red-500 hover:underline text-xs xs:text-xs sm:text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Edit User Modal */}
                {editUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-4 xs:p-4 sm:p-6 rounded-xl w-full max-w-[90vw] xs:max-w-[300px] sm:max-w-[500px]">
                            <h3 className="text-lg xs:text-lg sm:text-xl font-semibold mb-4 xs:mb-6">Edit User</h3>
                            <form onSubmit={handleUpdate} className="space-y-3 xs:space-y-4">
                                <div>
                                    <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={editUser.fullName}
                                        onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                                        className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={editUser.email}
                                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                        className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        value={editUser.phoneNumber || ''}
                                        onChange={(e) => setEditUser({ ...editUser, phoneNumber: e.target.value })}
                                        className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">City</label>
                                    <input
                                        type="text"
                                        value={editUser.city || ''}
                                        onChange={(e) => setEditUser({ ...editUser, city: e.target.value })}
                                        className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Role</label>
                                    <select
                                        value={editUser.role}
                                        onChange={(e) =>
                                            setEditUser({
                                                ...editUser,
                                                role: e.target.value,
                                                selectedCourse: e.target.value === 'student' ? editUser.selectedCourse : '',
                                            })
                                        }
                                        className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                        required
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                        <option value="tutor">Tutor</option>
                                        <option value="student">Student</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">
                                        Selected Course {editUser.role === 'student' && <span className="text-red-500">*</span>}
                                    </label>
                                    <select
                                        value={editUser.selectedCourse || ''}
                                        onChange={(e) => setEditUser({ ...editUser, selectedCourse: e.target.value })}
                                        className="w-full p-2 xs:p-2 sm:p-3 rounded-lg border text-xs xs:text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4b2b]"
                                        disabled={editUser.role !== 'student'}
                                        required={editUser.role === 'student'}
                                    >
                                        <option value="">Select a Course</option>
                                        {courses.length > 0 ? (
                                            courses.map((course) => (
                                                <option key={course._id} value={course._id}>
                                                    {course.title}
                                                </option>
                                            ))
                                        ) : (
                                            <option value="" disabled>
                                                No courses available
                                            </option>
                                        )}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-black text-xs xs:text-xs sm:text-sm mb-2">Activated</label>
                                    <input
                                        type="checkbox"
                                        checked={editUser.isActivated}
                                        onChange={(e) => setEditUser({ ...editUser, isActivated: e.target.checked })}
                                        className="h-4 w-4 text-[#c9a500] border-gray-600 rounded focus:ring-[#c9a500]"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 xs:space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditUser(null)}
                                        className="px-3 xs:px-4 py-1.5 xs:py-2 bg-gray-600 rounded-lg hover:bg-gray-500 text-xs xs:text-xs sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 xs:px-4 py-1.5 xs:py-2 bg-[#c9a500] text-black rounded-lg hover:bg-[#a78a00] text-xs xs:text-xs sm:text-sm"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const UserDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [review, setReview] = useState({ text: '', rating: 0 });
    const [photo, setPhoto] = useState(null);
    const [myReviews, setMyReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [error, setError] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const BASE_URL = 'http://192.168.8.130:5000'; // Aligned with Auth.tsx
    useEffect(() => {
        fetchData();
    }, [navigate]);
    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in');
            navigate('/auth'); // Changed to '/auth' to match Auth.tsx route
            setLoading(false);
            return;
        }
        try {
            const profileRes = await axios.get(`${BASE_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            });
            setProfile(profileRes.data);
            try {
                const reviewsRes = await axios.get(`${BASE_URL}/api/reviews/my-reviews`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000,
                });
                setMyReviews(reviewsRes.data || []);
            }
            catch (reviewErr) {
                console.warn('Reviews API not available:', reviewErr.message);
                setMyReviews([]);
            }
        }
        catch (err) {
            console.error('Fetch error:', err);
            setError(err.response?.data?.error || `Failed to load dashboard: ${err.message}`);
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('token');
                navigate('/auth');
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewError('');
        setSuccess('');
        if (!photo) {
            setReviewError('Please upload a photo');
            return;
        }
        if (review.text.length > 100) {
            setReviewError('Review must be less than 100 characters');
            return;
        }
        if (review.rating < 1 || review.rating > 5) {
            setReviewError('Please select a rating between 1 and 5');
            return;
        }
        if (photo.size > 5 * 1024 * 1024) {
            setReviewError('Photo must be less than 5MB');
            return;
        }
        const filetypes = /\.(jpeg|jpg|png)$/i;
        if (!filetypes.test(photo.name)) {
            setReviewError('Photo must be JPEG, JPG, or PNG');
            return;
        }
        const formData = new FormData();
        formData.append('text', review.text);
        formData.append('rating', review.rating.toString());
        formData.append('photo', photo);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}/api/reviews`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 10000,
            });
            setSuccess('Review submitted successfully!');
            setReview({ text: '', rating: 0 });
            setPhoto(null);
            document.getElementById('photoInput').value = '';
            const reviewsRes = await axios.get(`${BASE_URL}/api/reviews/my-reviews`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            });
            setMyReviews(reviewsRes.data || []);
        }
        catch (err) {
            setReviewError(err.response?.data?.error || `Failed to submit review: ${err.message}`);
        }
    };
    const handleEditReview = (review) => {
        setEditingReview(review);
        setReview({ text: review.text, rating: review.rating });
        setPhoto(null);
    };
    const handleUpdateReview = async (e) => {
        e.preventDefault();
        setReviewError('');
        setSuccess('');
        if (editingReview) {
            if (photo && photo.size > 5 * 1024 * 1024) {
                setReviewError('Photo must be less than 5MB');
                return;
            }
            if (photo) {
                const filetypes = /\.(jpeg|jpg|png)$/i;
                if (!filetypes.test(photo.name)) {
                    setReviewError('Photo must be JPEG, JPG, or PNG');
                    return;
                }
            }
            if (review.text.length > 100) {
                setReviewError('Review must be less than 100 characters');
                return;
            }
            if (review.rating < 1 || review.rating > 5) {
                setReviewError('Please select a rating between 1 and 5');
                return;
            }
            const formData = new FormData();
            formData.append('text', review.text);
            formData.append('rating', review.rating.toString());
            if (photo) {
                formData.append('photo', photo);
            }
            try {
                const token = localStorage.getItem('token');
                const response = await axios.put(`${BASE_URL}/api/reviews/${editingReview._id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 10000,
                });
                setSuccess('Review updated successfully!');
                setEditingReview(null);
                setReview({ text: '', rating: 0 });
                setPhoto(null);
                document.getElementById('photoInput').value = '';
                const reviewsRes = await axios.get(`${BASE_URL}/api/reviews/my-reviews`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000,
                });
                setMyReviews(reviewsRes.data || []);
            }
            catch (err) {
                setReviewError(err.response?.data?.error || `Failed to update review: ${err.message}`);
            }
        }
    };
    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?'))
            return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/api/reviews/${reviewId}`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            });
            setSuccess('Review deleted successfully!');
            const reviewsRes = await axios.get(`${BASE_URL}/api/reviews/my-reviews`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            });
            setMyReviews(reviewsRes.data || []);
        }
        catch (err) {
            setReviewError(err.response?.data?.error || `Failed to delete review: ${err.message}`);
        }
    };
    if (error && !loading) {
        return (<div className="min-h-[75vh] xs:min-h-[80vh] sm:min-h-[85vh] bg-[#f6f5f7] flex items-center justify-center font-['Montserrat',sans-serif] py-4 xs:py-4 sm:py-6 px-3 xs:px-3 sm:px-4">
                <div className="bg-red-600 text-white p-3 xs:p-4 rounded-lg max-w-[260px] xs:max-w-[260px] sm:max-w-[400px] text-center text-xs xs:text-xs sm:text-sm">
                    {error}
                    <button onClick={fetchData} className="mt-3 xs:mt-4 bg-[#C9A500] text-black px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 text-xs xs:text-xs sm:text-sm">
                        Retry
                    </button>
                    <button onClick={() => navigate('/auth')} className="mt-2 xs:mt-3 bg-gray-600 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 text-xs xs:text-xs sm:text-sm">
                        Back to Login
                    </button>
                </div>
            </div>);
    }
    return (<div className="min-h-[75vh] xs:min-h-[80vh] sm:min-h-[85vh] bg-gradient-to-br from-[#364CE2] to-[#010D60] text-white font-['Montserrat',sans-serif] p-4 xs:p-4 sm:p-6">
            {loading && <div className="text-center text-base xs:text-lg sm:text-xl">Loading dashboard...</div>}
            {!loading && (<div className="max-w-[90vw] xs:max-w-[92vw] sm:max-w-[1000px] md:max-w-[1200px] mx-auto">
                    <header className="flex justify-between items-center mb-6 xs:mb-8">
                        <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold">User Dashboard</h1>
                        <button onClick={() => {
                localStorage.removeItem('token');
                navigate('/auth');
            }} className="bg-[#C9A500] text-black px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 transition text-xs xs:text-xs sm:text-sm">
                            Logout
                        </button>
                    </header>

                    {profile && (<div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 xs:p-6 mb-6 xs:mb-8 shadow-lg">
                            <div className="flex items-center space-x-3 xs:space-x-4">
                                <img src="https://via.placeholder.com/80" alt="Avatar" className="w-16 xs:w-20 h-16 xs:h-20 rounded-full border-2 border-[#C9A500]"/>
                                <div>
                                    <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold">{profile.fullName}</h2>
                                    <p className="text-gray-300 text-xs xs:text-xs sm:text-sm">{profile.email}</p>
                                </div>
                            </div>
                        </div>)}

                    <section className="mb-6 xs:mb-8">
                        <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4">{editingReview ? 'Edit Review' : 'Submit a Review'}</h2>
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 xs:p-6 shadow-lg">
                            {reviewError && (<div className="bg-red-600 text-white p-3 xs:p-4 rounded-lg mb-3 xs:mb-4 text-xs xs:text-xs sm:text-sm">{reviewError}</div>)}
                            {success && (<div className="bg-green-600 text-white p-3 xs:p-4 rounded-lg mb-3 xs:mb-4 text-xs xs:text-xs sm:text-sm">{success}</div>)}
                            <form onSubmit={editingReview ? handleUpdateReview : handleSubmitReview} encType="multipart/form-data">
                                <div className="mb-3 xs:mb-4">
                                    <label className="block text-xs xs:text-xs sm:text-sm font-medium mb-1">Your Name</label>
                                    <input type="text" value={profile?.fullName || ''} disabled className="w-full p-2 xs:p-3 border rounded-lg bg-gray-700 text-white text-xs xs:text-xs sm:text-sm"/>
                                </div>
                                <div className="mb-3 xs:mb-4">
                                    <label className="block text-xs xs:text-xs sm:text-sm font-medium mb-1">Review (max 100 characters)</label>
                                    <textarea value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })} className="w-full p-2 xs:p-3 border rounded-lg bg-gray-700 text-white text-xs xs:text-xs sm:text-sm" rows={4} maxLength={100} required/>
                                    <p className="text-xs xs:text-xs sm:text-sm text-gray-300">{review.text.length}/100</p>
                                </div>
                                <div className="mb-3 xs:mb-4">
                                    <label className="block text-xs xs:text-xs sm:text-sm font-medium mb-1">Rating (1-5 stars)</label>
                                    <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })} className="w-full p-2 xs:p-3 border rounded-lg bg-gray-700 text-white text-xs xs:text-xs sm:text-sm" required>
                                        <option value={0}>Select rating</option>
                                        {[1, 2, 3, 4, 5].map((star) => (<option key={star} value={star}>
                                                {star} Star{star > 1 ? 's' : ''}
                                            </option>))}
                                    </select>
                                </div>
                                <div className="mb-3 xs:mb-4">
                                    <label className="block text-xs xs:text-xs sm:text-sm font-medium mb-1">Upload Photo</label>
                                    <input id="photoInput" type="file" accept="image/jpeg,image/jpg,image/png" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="w-full p-2 xs:p-3 border rounded-lg bg-gray-700 text-white text-xs xs:text-xs sm:text-sm" required={!editingReview}/>
                                </div>
                                <div className="flex space-x-3 xs:space-x-4">
                                    <button type="submit" className="bg-[#C9A500] text-black px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 font-medium transition text-xs xs:text-xs sm:text-sm">
                                        {editingReview ? 'Update Review' : 'Submit Review'}
                                    </button>
                                    {editingReview && (<button type="button" onClick={() => {
                    setEditingReview(null);
                    setReview({ text: '', rating: 0 });
                    setPhoto(null);
                    document.getElementById('photoInput').value = '';
                }} className="bg-gray-600 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 transition text-xs xs:text-xs sm:text-sm">
                                            Cancel
                                        </button>)}
                                </div>
                            </form>
                        </div>
                    </section>

                    <section className="mb-6 xs:mb-8">
                        <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4">My Reviews</h2>
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 xs:p-6 shadow-lg">
                            {myReviews.length > 0 ? (<ul className="space-y-3 xs:space-y-4">
                                    {myReviews.map((review) => (<li key={review._id} className="flex flex-col space-y-2 xs:space-y-3">
                                            <div className="flex items-center space-x-3 xs:space-x-4">
                                                <img src={`${BASE_URL}${review.photo}`} alt="Review photo" className="w-12 xs:w-16 h-12 xs:h-16 rounded-full object-cover" onError={(e) => {
                        console.warn(`Failed to load review image: ${BASE_URL}${review.photo}`);
                        e.currentTarget.src = 'https://via.placeholder.com/64?text=Image+Not+Found';
                        setReviewError('Failed to load review image');
                    }}/>
                                                <div>
                                                    <p className="font-medium text-xs xs:text-xs sm:text-sm">{review.text}</p>
                                                    <p className="text-gray-300 text-xs xs:text-xs sm:text-sm">Rating: {review.rating}/5</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 xs:space-x-3">
                                                <button onClick={() => handleEditReview(review)} className="bg-[#C9A500] text-black px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg hover:bg-opacity-80 transition text-xs xs:text-xs sm:text-sm w-fit">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteReview(review._id)} className="bg-red-600 text-white px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg hover:bg-opacity-80 transition text-xs xs:text-xs sm:text-sm w-fit">
                                                    Delete
                                                </button>
                                            </div>
                                        </li>))}
                                </ul>) : (<p className="text-gray-300 text-xs xs:text-xs sm:text-sm">You haven't submitted any reviews yet.</p>)}
                        </div>
                    </section>
                </div>)}
        </div>);
};
export default UserDashboard;

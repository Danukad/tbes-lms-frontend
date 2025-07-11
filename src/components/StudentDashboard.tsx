// StudentDashboard.tsx
import { useState, useEffect, Component, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaEnvelope, FaChartBar, FaTools, FaSignOutAlt, FaLink, FaBook, FaTimes } from 'react-icons/fa';
import axios from 'axios';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <h2 className="p-4 text-red-600">Something went wrong: {this.state.error?.message || 'Unknown error'}</h2>;
    }
    return this.props.children;
  }
}

interface Review {
  _id: string;
  text: string;
  rating: number;
  photo: string;
}

interface Profile {
  fullName: string;
  email: string;
}

interface Mark {
  assessment?: string;
  date?: string;
  marks?: number;
}

interface Message {
  sender?: string;
  subject?: string;
  timestamp?: string;
}

interface Calendar {
  month?: string;
  events?: { title?: string; date?: string }[];
}

interface Course {
  _id: string;
  title: string;
  duration?: string;
  progress?: string;
}

interface Module {
  _id: string;
  title: string;
  progress?: string;
}

interface ModuleContent {
  title?: string;
  description?: string;
  video?: string;
  pdf?: string;
  quiz?: string;
  exam?: string;
}

const StudentDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSideTabOpen, setIsSideTabOpen] = useState(false);
  const [moduleContent, setModuleContent] = useState<ModuleContent | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [review, setReview] = useState({ text: '', rating: 0 });
  const [photo, setPhoto] = useState<File | null>(null);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = 'http://192.168.8.130:5000';

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in');
      navigate('/auth');
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
      } catch (reviewErr: any) {
        console.warn('Reviews API not available:', reviewErr.message);
        setMyReviews([]);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error || `Failed to load dashboard: ${err.message}`);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setSuccess(null);

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
      await axios.post(`${BASE_URL}/api/reviews`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });
      setSuccess('Review submitted successfully!');
      setReview({ text: '', rating: 0 });
      setPhoto(null);
      (document.getElementById('photoInput') as HTMLInputElement).value = '';
      const reviewsRes = await axios.get(`${BASE_URL}/api/reviews/my-reviews`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });
      setMyReviews(reviewsRes.data || []);
    } catch (err: any) {
      setReviewError(err.response?.data?.error || `Failed to submit review: ${err.message}`);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReview({ text: review.text, rating: review.rating });
    setPhoto(null);
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setSuccess(null);

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
        await axios.put(`${BASE_URL}/api/reviews/${editingReview._id}`, formData, {
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
        (document.getElementById('photoInput') as HTMLInputElement).value = '';
        const reviewsRes = await axios.get(`${BASE_URL}/api/reviews/my-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        });
        setMyReviews(reviewsRes.data || []);
      } catch (err: any) {
        setReviewError(err.response?.data?.error || `Failed to update review: ${err.message}`);
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

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
    } catch (err: any) {
      setReviewError(err.response?.data?.error || `Failed to delete review: ${err.message}`);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  const StudentProfile = () => {
    if (error && !loading) {
      return (
          <div className="min-h-[75vh] xs:min-h-[80vh] sm:min-h-[85vh] bg-[#f6f5f7] flex items-center justify-center font-['Montserrat',sans-serif] py-4 xs:py-4 sm:py-6 px-3 xs:px-3 sm:px-4">
            <div className="bg-red-600 text-white p-3 xs:p-4 rounded-lg max-w-[260px] xs:max-w-[260px] sm:max-w-[400px] text-center text-xs xs:text-xs sm:text-sm">
              {error}
              <button
                  onClick={fetchData}
                  className="mt-3 xs:mt-4 bg-[#C9A500] text-black px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 text-xs xs:text-xs sm:text-sm"
              >
                Retry
              </button>
              <button
                  onClick={() => navigate('/auth')}
                  className="mt-2 xs:mt-3 bg-gray-600 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 text-xs xs:text-xs sm:text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
      );
    }

    return (
        <div className="p-4">
          <h2 className="text-lg font-semibold text-[#010D60] mb-4">Student Profile</h2>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-md font-medium text-[#010D60] mb-2">Basic Information</h3>
              <p><span className="font-semibold">Name:</span> {profile?.fullName || 'N/A'}</p>
              <p><span className="font-semibold">Student ID:</span> N/A</p>
              <p><span className="font-semibold">Date of Birth:</span> N/A</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-md font-medium text-[#010D60] mb-2">Additional Information</h3>
              <p><span className="font-semibold">Address:</span> N/A</p>
              <p><span className="font-semibold">Emergency Contact:</span> N/A</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-md font-medium text-[#010D60] mb-2">Contact Information</h3>
              <p><span className="font-semibold">Email:</span> {profile?.email || 'N/A'}</p>
              <p><span className="font-semibold">Phone:</span> N/A</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-md font-medium text-[#010D60] mb-2">System Settings</h3>
              <p><span className="font-semibold">Notifications:</span> N/A</p>
              <p><span className="font-semibold">Theme:</span> N/A (Switch to Dark)</p>
              <button className="mt-2 bg-[#C9A500] text-white px-3 py-1 rounded hover:bg-[#A78A00] transition-colors duration-200">
                Save Settings
              </button>
            </div>
          </div>
        </div>
    );
  };

  const Marks = () => {
    const [marks, setMarks] = useState<Mark[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      fetch('http://192.168.8.130:5000/api/student/marks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            setMarks(data);
            setError(null);
          })
          .catch(err => {
            console.error('Error fetching marks:', err.message);
            setError(err.message);
          });
    }, []);

    if (error) return <p className="p-4 text-red-600">Error loading marks: {error.includes('404') ? 'Endpoint not found. Please check the server.' : error}. Try again later.</p>;
    if (marks.length === 0) return <p className="p-4 text-gray-600">Loading marks...</p>;

    return (
        <div className="p-4">
          <h2 className="text-lg font-semibold text-[#010D60] mb-4">Marks</h2>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <table className="w-full text-left">
                <thead>
                <tr className="bg-[#364CE2] text-white">
                  <th className="p-2">Assessment</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Marks</th>
                </tr>
                </thead>
                <tbody>
                {marks.map((mark, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="p-2 text-[#010D60]">{mark.assessment || 'N/A'}</td>
                      <td className="p-2 text-gray-600">{mark.date ? new Date(mark.date).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-2 text-[#C9A500]">{mark.marks || 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    );
  };

  const Tools = () => (
      <div className="p-4">
        <h2 className="text-lg font-semibold text-[#010D60] mb-4">Tools</h2>
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-600">This is a placeholder for the Tools section. More features will be added later!</p>
          </div>
        </div>
      </div>
  );

  const Messages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      fetch('http://192.168.8.130:5000/api/student/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            setMessages(data);
            setError(null);
          })
          .catch(err => {
            console.error('Error fetching messages:', err.message);
            setError(err.message);
          });
    }, []);

    if (error) return <p className="p-4 text-red-600">Error loading messages: {error.includes('404') ? 'Endpoint not found. Please check the server.' : error}. Try again later.</p>;
    if (messages.length === 0) return <p className="p-4 text-gray-600">Loading messages...</p>;

    return (
        <div className="p-4">
          <h2 className="text-lg font-semibold text-[#010D60] mb-4">Messages</h2>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <ul className="space-y-2">
                {messages.map((msg, index) => (
                    <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors duration-200">
                      <div>
                        <p className="text-[#010D60] font-medium">{msg.sender || 'N/A'}</p>
                        <p className="text-gray-600">{msg.subject || 'N/A'}</p>
                      </div>
                      <span className="text-[#364CE2] text-sm">{msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'N/A'}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
    );
  };

  const AcademicCalendar = () => {
    const [calendar, setCalendar] = useState<Calendar | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      fetch('http://192.168.8.130:5000/api/student/calendar', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            setCalendar(data);
            setError(null);
          })
          .catch(err => {
            console.error('Error fetching calendar:', err.message);
            setError(err.message);
          });
    }, []);

    if (error) return <p className="p-4 text-red-600">Error loading calendar: {error.includes('404') ? 'Endpoint not found. Please check the server.' : error}. Try again later.</p>;
    if (!calendar) return <p className="p-4 text-gray-600">Loading calendar...</p>;

    return (
        <div className="p-4">
          <h2 className="text-lg font-semibold text-[#010D60] mb-4">Academic Calendar</h2>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-md font-medium text-[#010D60] mb-2">{calendar.month || 'N/A'}</h3>
              <div className="grid grid-cols-7 gap-1 text-center text-gray-600">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                {Array.from({ length: 31 }, (_, i) => (
                    <div
                        key={i}
                        className={`p-2 hover:bg-[#C9A500] hover:text-white rounded transition-colors duration-200 ${
                            [6, 13, 20, 27].includes(i) ? 'bg-[#364CE2] text-white' : ''
                        }`}
                    >
                      {i + 1}
                    </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-md font-medium text-[#010D60] mb-2">Upcoming Events</h3>
              <ul className="space-y-2">
                {calendar.events && calendar.events.length > 0 ? (
                    calendar.events.map((event, index) => (
                        <li key={index} className="flex justify-between text-gray-700">
                          <span>{event.title || 'N/A'}</span>
                          <span className="text-[#364CE2]">{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</span>
                        </li>
                    ))
                ) : (
                    <li className="p-2 text-gray-600">No events available</li>
                )}
              </ul>
            </div>
          </div>
        </div>
    );
  };

  const ModulesAndCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem('token');
      fetch('http://192.168.8.130:5000/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            setCourses(data.courses || []);
            if (data.courses.length > 0) setSelectedCourse(data.courses[0]);
            setError(null);
          })
          .catch(err => {
            console.error('Error fetching courses:', err.message);
            setError(err.message);
          });
    }, []);

    useEffect(() => {
      if (!selectedCourse?._id) return;
      const token = localStorage.getItem('token');
      fetch(`http://192.168.8.130:5000/api/modules/${selectedCourse._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            setModules(data || []);
            setError(null);
          })
          .catch(err => {
            console.error('Error fetching modules:', err.message);
            if (err.message.includes('401')) {
              setModules([]);
              setError('Access denied. Please log in again or contact support.');
            } else {
              setError(err.message);
            }
          });
    }, [selectedCourse]);

    const fetchModuleContent = (moduleId: string) => {
      const token = localStorage.getItem('token');
      fetch(`http://192.168.8.130:5000/api/modules/${moduleId}/content`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            setModuleContent(data);
            setIsSideTabOpen(true);
          })
          .catch(err => {
            console.error('Error fetching module content:', err.message);
            setModuleContent(null);
            setError(err.message);
          });
    };

    if (error) return <p className="p-4 text-red-600">Error loading modules: {error.includes('404') ? 'Endpoint not found. Please check the server.' : error}. Try again later.</p>;
    if (courses.length === 0) return <p className="p-4 text-gray-600">Loading courses and modules...</p>;

    return (
        <div className="p-4 relative">
          <h2 className="text-lg font-semibold text-[#010D60] mb-4">Modules and Courses</h2>
          <div className="space-y-6">
            <div className="mb-4">
              <select
                  onChange={(e) => {
                    const course = courses.find((c) => c._id === e.target.value);
                    setSelectedCourse(course || null);
                    setModules([]); // Reset modules on course change
                    setModuleContent(null);
                    setIsSideTabOpen(false);
                  }}
                  className="p-2 border rounded w-full mb-2"
                  value={selectedCourse?._id || ''}
              >
                <option value="">-- Select a Course --</option>
                {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCourse && (
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-md font-medium text-[#010D60] mb-2">{selectedCourse.title || 'N/A'}</h3>
                    <p className="text-gray-600">Duration: {selectedCourse.duration || 'N/A'}</p>
                    <p className="text-gray-600">Progress: {selectedCourse.progress || '0%'}</p>
                    <button className="mt-2 bg-[#C9A500] text-white px-3 py-1 rounded hover:bg-[#A78A00] transition-colors duration-200">
                      View Details
                    </button>
                  </div>
              )}
              {modules.length > 0 ? (
                  modules.map((module, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-md font-medium text-[#010D60] mb-2">{module.title || 'N/A'}</h3>
                        <p className="text-gray-600">Progress: {module.progress || '0%'}</p>
                        <button
                            onClick={() => fetchModuleContent(module._id)}
                            className="mt-2 bg-[#C9A500] text-white px-3 py-1 rounded hover:bg-[#A78A00] transition-colors duration-200"
                        >
                          View Module
                        </button>
                      </div>
                  ))
              ) : (
                  <p className="text-gray-600">No modules available for this course.</p>
              )}
            </div>
          </div>
          {isSideTabOpen && (
              <div className="fixed top-0 left-0 h-full w-1/3 bg-white shadow-lg z-50 transition-transform duration-300 transform translate-x-0">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[#010D60]">Module Content</h3>
                  <button
                      onClick={() => {
                        setIsSideTabOpen(false);
                        setModuleContent(null);
                      }}
                      className="text-gray-600 hover:text-red-600"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                  {moduleContent ? (
                      <>
                        <p><strong>Title:</strong> {moduleContent.title || 'N/A'}</p>
                        <p><strong>Description:</strong> {moduleContent.description || 'N/A'}</p>
                        <p><strong>Videos:</strong> {moduleContent.video ? <a href={moduleContent.video} target="_blank" rel="noopener noreferrer" className="text-[#364CE2] underline">Watch</a> : 'N/A'}</p>
                        <p><strong>PDFs:</strong> {moduleContent.pdf ? <a href={moduleContent.pdf} target="_blank" rel="noopener noreferrer" className="text-[#364CE2] underline">Download</a> : 'N/A'}</p>
                        <p><strong>Quizzes:</strong> {moduleContent.quiz ? <a href={moduleContent.quiz} target="_blank" rel="noopener noreferrer" className="text-[#364CE2] underline">Take Quiz</a> : 'N/A'}</p>
                        <p><strong>Exams:</strong> {moduleContent.exam ? <a href={moduleContent.exam} target="_blank" rel="noopener noreferrer" className="text-[#364CE2] underline">Take Exam</a> : 'N/A'}</p>
                      </>
                  ) : (
                      <p className="text-gray-600">Loading content...</p>
                  )}
                  {error && <p className="text-red-600">Error loading content: {error}</p>}
                </div>
              </div>
          )}
          {isSideTabOpen && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => {
                    setIsSideTabOpen(false);
                    setModuleContent(null);
                  }}
              />
          )}
        </div>
    );
  };

  const KeyLinks = () => (
      <div className="p-4">
        <h2 className="text-lg font-semibold text-[#010D60] mb-4">Key Links</h2>
        <div className="space-y-2">
          <a
              href="https://lms-support.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-[#010D60] hover:text-[#364CE2] border border-gray-100"
          >
            <FaLink className="inline mr-2" /> LMS Support
          </a>
          <a
              href="https://digital-capabilities.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-[#010D60] hover:text-[#364CE2] border border-gray-100"
          >
            <FaLink className="inline mr-2" /> Digital Capabilities and Accessibility
          </a>
          <a
              href="https://students-union.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-[#010D60] hover:text-[#364CE2] border border-gray-100"
          >
            <FaLink className="inline mr-2" /> Students' Union
          </a>
          <a
              href="https://strategies-policies.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-[#010D60] hover:text-[#364CE2] border border-gray-100"
          >
            <FaLink className="inline mr-2" /> Strategies and Policies
          </a>
          <a
              href="https://data-protection.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 text-[#010D60] hover:text-[#364CE2] border border-gray-100"
          >
            <FaLink className="inline mr-2" /> Data Protection and Privacy
          </a>
        </div>
      </div>
  );

  const renderContent = () => {
    switch (location.pathname) {
      case '/key-links':
        return <KeyLinks />;
      case '/student-profile':
        return (
            <ErrorBoundary>
              <StudentProfile />
            </ErrorBoundary>
        );
      case '/activity':
        return <p className="p-4 text-gray-600">Activity section is temporarily unavailable. Check back later!</p>;
      case '/modules-courses':
        return <ModulesAndCourses />;
      case '/academic-calendar':
        return <AcademicCalendar />;
      case '/messages':
        return <Messages />;
      case '/marks':
        return <Marks />;
      case '/tools':
        return <Tools />;
      default:
        return <p className="p-4 text-gray-600">Select a tab from the sidebar to view details!</p>;
    }
  };

  return (
      <div className="flex h-screen bg-white font-inter">
        <div
            className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-[#010D60] to-[#364CE2] text-white transition-all duration-300 ease-in-out fixed h-full z-10`}
        >
          <div className="p-4">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-white focus:outline-none"
            >
              <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>
          <nav className="mt-4">
            <ul>
              <li className="mb-2">
                <Link
                    to="/key-links"
                    className="flex items-center p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaLink className="mr-2" />
                  {isSidebarOpen && <span>Key Links</span>}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                    to="/student-profile"
                    className="flex items-center p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaUser className="mr-2" />
                  {isSidebarOpen && <span>Student Profile</span>}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                    to="/activity"
                    className="flex items-center p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaCalendarAlt className="mr-2" />
                  {isSidebarOpen && <span>Activity</span>}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                    to="/modules-courses"
                    className="flex items-center p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaBook className="mr-2" />
                  {isSidebarOpen && <span>Modules and Courses</span>}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                    to="/academic-calendar"
                    className="flex items-center p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaCalendarAlt className="mr-2" />
                  {isSidebarOpen && <span>Academic Calendar</span>}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                    to="/messages"
                    className="flex items-center p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaEnvelope className="mr-2" />
                  {isSidebarOpen && <span>Messages</span>}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                    to="/marks"
                    className="flex items-center p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaChartBar className="mr-2" />
                  {isSidebarOpen && <span>Marks</span>}
                </Link>
              </li>
              <li className="mb-2">
                <Link
                    to="/tools"
                    className="flex items-center p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaTools className="mr-2" />
                  {isSidebarOpen && <span>Tools</span>}
                </Link>
              </li>
              <li className="mb-2">
                <button
                    onClick={handleSignOut}
                    className="flex items-center w-full p-2 hover:bg-[#C9A500] rounded text-white hover:text-[#010D60]"
                >
                  <FaSignOutAlt className="mr-2" />
                  {isSidebarOpen && <span>Sign Out</span>}
                </button>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-4 w-full px-4 text-xs text-gray-300">
            {isSidebarOpen && (
                <p>
                  Privacy | Terms | Accessibility
                </p>
            )}
          </div>
        </div>
        <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
          <div className="p-6">
            <h1 className="text-3xl font-bold text-[#010D60]">Student Dashboard</h1>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-[#010D60]">Reviews</h2>
                {loading && <div className="text-center text-base">Loading reviews...</div>}
                {!loading && (
                    <div className="max-w-[90vw] xs:max-w-[92vw] sm:max-w-[1000px] mx-auto">
                      <section className="mb-6 xs:mb-8">
                        <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4">{editingReview ? 'Edit Review' : 'Submit a Review'}</h2>
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 xs:p-6 shadow-lg">
                          {reviewError && (
                              <div className="bg-red-600 text-white p-3 xs:p-4 rounded-lg mb-3 xs:mb-4 text-xs xs:text-xs sm:text-sm">{reviewError}</div>
                          )}
                          {success && (
                              <div className="bg-green-600 text-white p-3 xs:p-4 rounded-lg mb-3 xs:mb-4 text-xs xs:text-xs sm:text-sm">{success}</div>
                          )}
                          <form onSubmit={editingReview ? handleUpdateReview : handleSubmitReview} encType="multipart/form-data">
                            <div className="mb-3 xs:mb-4">
                              <label className="block text-xs xs:text-xs sm:text-sm font-medium mb-1">Your Name</label>
                              <input
                                  type="text"
                                  value={profile?.fullName || ''}
                                  disabled
                                  className="w-full p-2 xs:p-3 border rounded-lg bg-gray-700 text-white text-xs xs:text-xs sm:text-sm"
                              />
                            </div>
                            <div className="mb-3 xs:mb-4">
                              <label className="block text-xs xs:text-xs sm:text-sm font-medium mb-1">Review (max 100 characters)</label>
                              <textarea
                                  value={review.text}
                                  onChange={(e) => setReview({ ...review, text: e.target.value })}
                                  className="w-full p-2 xs:p-3 border rounded-lg bg-gray-700 text-white text-xs xs:text-xs sm:text-sm"
                                  rows={4}
                                  maxLength={100}
                                  required
                              />
                              <p className="text-xs xs:text-xs sm:text-sm text-gray-300">{review.text.length}/100</p>
                            </div>
                            <div className="mb-3 xs:mb-4">
                              <label className="block text-xs xs:text-xs sm:text-sm font-medium mb-1">Rating (1-5 stars)</label>
                              <select
                                  value={review.rating}
                                  onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                                  className="w-full p-2 xs:p-3 border rounded-lg bg-gray-700 text-white text-xs xs:text-xs sm:text-sm"
                                  required
                              >
                                <option value={0}>Select rating</option>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <option key={star} value={star}>
                                      {star} Star{star > 1 ? 's' : ''}
                                    </option>
                                ))}
                              </select>
                            </div>
                            <div className="mb-3 xs:mb-4">
                              <label className="block text-xs xs:text-xs sm:text-sm font-medium mb-1">Upload Photo</label>
                              <input
                                  id="photoInput"
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png"
                                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                  className="w-full p-2 xs:p-3 border rounded-lg bg-gray-700 text-white text-xs xs:text-xs sm:text-sm"
                                  required={!editingReview}
                              />
                            </div>
                            <div className="flex space-x-3 xs:space-x-4">
                              <button
                                  type="submit"
                                  className="bg-[#C9A500] text-black px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 font-medium transition text-xs xs:text-xs sm:text-sm"
                              >
                                {editingReview ? 'Update Review' : 'Submit Review'}
                              </button>
                              {editingReview && (
                                  <button
                                      type="button"
                                      onClick={() => {
                                        setEditingReview(null);
                                        setReview({ text: '', rating: 0 });
                                        setPhoto(null);
                                        (document.getElementById('photoInput') as HTMLInputElement).value = '';
                                      }}
                                      className="bg-gray-600 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg hover:bg-opacity-80 transition text-xs xs:text-xs sm:text-sm"
                                  >
                                    Cancel
                                  </button>
                              )}
                            </div>
                          </form>
                        </div>
                      </section>

                      <section className="mb-6 xs:mb-8">
                        <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4">My Reviews</h2>
                        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 xs:p-6 shadow-lg">
                          {myReviews.length > 0 ? (
                              <ul className="space-y-3 xs:space-y-4">
                                {myReviews.map((review) => (
                                    <li key={review._id} className="flex flex-col space-y-2 xs:space-y-3">
                                      <div className="flex items-center space-x-3 xs:space-x-4">
                                        <img
                                            src={`${BASE_URL}${review.photo}`}
                                            alt="Review photo"
                                            className="w-12 xs:w-16 h-12 xs:h-16 rounded-full object-cover"
                                            onError={(e) => {
                                              console.warn(`Failed to load review image: ${BASE_URL}${review.photo}`);
                                              e.currentTarget.src = 'https://via.placeholder.com/64?text=Image+Not+Found';
                                              setReviewError('Failed to load review image');
                                            }}
                                        />
                                        <div>
                                          <p className="font-medium text-xs xs:text-xs sm:text-sm">{review.text}</p>
                                          <p className="text-gray-300 text-xs xs:text-xs sm:text-sm">Rating: {review.rating}/5</p>
                                        </div>
                                      </div>
                                      <div className="flex space-x-2 xs:space-x-3">
                                        <button
                                            onClick={() => handleEditReview(review)}
                                            className="bg-[#C9A500] text-black px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg hover:bg-opacity-80 transition text-xs xs:text-xs sm:text-sm w-fit"
                                        >
                                          Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="bg-red-600 text-white px-2 xs:px-3 py-1 xs:py-1.5 rounded-lg hover:bg-opacity-80 transition text-xs xs:text-xs sm:text-sm w-fit"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </li>
                                ))}
                              </ul>
                          ) : (
                              <p className="text-gray-300 text-xs xs:text-xs sm:text-sm">You haven't submitted any reviews yet.</p>
                          )}
                        </div>
                      </section>
                    </div>
                )}
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-[#010D60]">Performance Overview</h2>
                <p>Show performance stats here.</p>
              </div>
            </div>
            <div className="mt-6">{renderContent()}</div>
          </div>
        </div>
      </div>
  );
};

export default StudentDashboard;
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { css } from 'styled-jsx/css'; // Import styled-jsx

interface User {
  role: string;
  fullName: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://192.168.8.130:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000,
          });
          setUser(response.data);
        }
      } catch (err: any) {
        console.error('Fetch user error:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          code: err.code,
        });
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
          'http://192.168.8.130:5000/api/auth/logout',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000,
          }
      );
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  const getRoleSpecificLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case 'superadmin':
        return [
          { name: 'Dashboard', path: '/superadmin' },
          { name: 'User Management', path: '/user-management' },
          { name: 'Courses', path: '/courses' },
          { name: 'Tutors', path: '/tutors' },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admindashboard' },
          { name: 'User Management', path: '/user-management' },
          { name: 'Courses', path: '/courses' },
          { name: 'Tutors', path: '/tutors' },
        ];
      case 'manager':
        return [
          { name: 'Dashboard', path: '/manager' },
          { name: 'Courses', path: '/courses' },
          { name: 'Tutors', path: '/tutors' },
        ];
      case 'tutor':
        return [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'My Courses', path: '/my-courses' },
        ];
      case 'student':
        return [
          { name: 'Dashboard', path: '/student' },
          { name: 'My Courses', path: '/courses' },
          { name: 'Profile', path: '/profile' },
        ];
      default:
        return [];
    }
  };

  const publicLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About', path: '/aboutus' },
    { name: 'Contact Us', path: '/contactus' },
  ];

  return (
      <nav className="absolute top-4 left-0 right-0 mx-auto w-[90vw] max-w-[1256px] rounded-[12px] bg-[#010D60] text-white font-inter shadow-lg z-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-2xl font-bold">
                TBES
              </Link>
            </div>
            <div className="hidden sm:flex items-center justify-center space-x-6">
              {publicLinks.map((link) => (
                  <Link
                      key={link.name}
                      to={link.path}
                      className="text-[16px] font-medium hover:text-[#FCFC08] transition duration-300 ease-in focus:outline-none focus:ring-2 focus:ring-[#C9A500] rounded"
                      aria-label={link.name}
                  >
                    {link.name}
                  </Link>
              ))}
              {user &&
                  getRoleSpecificLinks().map((link) => (
                      <Link
                          key={link.name}
                          to={link.path}
                          className="text-sm font-medium hover:text-[#C9A500] transition duration-300 ease-in focus:outline-none focus:ring-2 focus:ring-[#C9A500] rounded"
                          aria-label={link.name}
                      >
                        {link.name}
                      </Link>
                  ))}
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-sm truncate max-w-[150px]">{user.fullName}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-[#C9A500] text-black px-4 py-2 rounded-md hover:bg-opacity-80 transition focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                        aria-label="Logout"
                    >
                      Logout
                    </button>
                  </div>
              ) : (
                  <div className="flex items-center space-x-4">
                    <div className="p-[2px] rounded-md bg-gradient-to-br from-[#364CE2] to-[rgba(255,255,255,0.17)]">
                      <Link
                          to="/login"
                          className="block bg-[#0016b997] text-white px-4 py-2 rounded-md text-sm font-semibold text-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                          aria-label="Sign Up"
                      >
                        Sign Up
                      </Link>
                    </div>
                    <div className="p-[2px] rounded-md bg-gradient-to-br from-[#364CE2] to-[rgba(255,255,255,0.17)]">
                      <Link
                          to="/enroll-student"
                          className="block bg-[#0016b997] text-white px-4 py-2 rounded-md text-sm font-semibold text-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                          aria-label="Enroll Student"
                      >
                        Enroll Student
                      </Link>
                    </div>
                    <div className="p-[2px] rounded-md bg-gradient-to-br from-[#364CE2] to-[rgba(255,255,255,0.17)]">
                      <Link
                          to="/activate-account"
                          className="block bg-[#FFFFFF] text-[#010D60] px-4 py-2 rounded-md text-sm font-semibold text-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                          aria-label="Student Portal"
                      >
                        Student Portal
                      </Link>
                    </div>
                  </div>
              )}
            </div>
            <div className="sm:hidden flex items-center">
              <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-[#C9A500] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                  aria-label="Toggle menu"
              >
                {isOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div
            className={`sm:hidden bg-[#010D60] rounded-b-[12px] overflow-hidden transition-all duration-500 ease-in-out ${
                isOpen ? 'max-h-[1000px] opacity-100 unfold-paper' : 'max-h-0 opacity-0'
            }`}
            id="mobile-menu"
        >
          <div className="pt-2 pb-3 space-y-1 text-center">
            {publicLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.path}
                    className="block px-4 py-2 text-base font-medium hover:bg-gray-800 hover:text-[#C9A500] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                    onClick={() => setIsOpen(false)}
                    aria-label={link.name}
                >
                  {link.name}
                </Link>
            ))}
            {user &&
                getRoleSpecificLinks().map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className="block px-4 py-2 text-base font-medium hover:bg-gray-800 hover:text-[#C9A500] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                        onClick={() => setIsOpen(false)}
                        aria-label={link.name}
                    >
                      {link.name}
                    </Link>
                ))}
            {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-sm truncate max-w-[60%]">{user.fullName}</span>
                  <div className="p-[2px] rounded-md bg-gradient-to-br from-[#364CE2] to-[rgba(255,255,255,0.17)]">
                    <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="bg-[#0016b997] text-white px-4 py-2 rounded-md text-sm font-semibold text-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                        aria-label="Logout"
                    >
                      Logout
                    </button>
                  </div>

                </div>
            ) : (
                <div className="space-y-2 px-4 ">
                  <div className="p-[2px] rounded-md bg-gradient-to-br from-[#364CE2] to-[rgba(255,255,255,0.17)]">
                    <Link
                        to="/login"
                        className="block bg-[#0016b997] text-white px-4 py-2 rounded-md text-sm font-semibold text-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                        onClick={() => setIsOpen(false)}
                        aria-label="Sign Up"
                    >
                      Sign Up
                    </Link>
                  </div>
                  <div className="p-[2px] rounded-md bg-gradient-to-br from-[#364CE2] to-[rgba(255,255,255,0.17)]">
                    <Link
                        to="/activate-account"
                        className="block bg-[#FFFFFF] text-[#010D60] px-4 py-2 rounded-md text-sm font-semibold text-center hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-[#C9A500]"
                        onClick={() => setIsOpen(false)}
                        aria-label="Student Portal"
                    >
                      Student Portal
                    </Link>
                  </div>

                </div>
            )}
          </div>
        </div>

        <style jsx>{`
          @keyframes unfoldPaper {
            0% {
              transform: perspective(1000px) rotateX(-90deg) scale(0.8);
              opacity: 0;
              box-shadow: 0 0 0 rgba(0, 0, 0, 0);
            }
            50% {
              transform: perspective(1000px) rotateX(-20deg) scale(0.95);
              opacity: 0.7;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            100% {
              transform: perspective(1000px) rotateX(0deg) scale(1);
              opacity: 1;
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
            }
          }

          .unfold-paper {
            animation: unfoldPaper 0.5s ease-in-out forwards;
          }
        `}</style>
      </nav>
  );
};

export default Navbar;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  uniqueID?: string;
  email?: string;
  role: string;
  fullName?: string;
  phoneNumber?: string;
  city?: string;
  isActivated: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface ApiError {
  error: string;
}

const Auth: React.FC = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginUniqueID, setLoginUniqueID] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const BASE_URL = 'http://192.168.8.130:5000';

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateUniqueID = (id: string) => /^[a-zA-Z0-9]{6,}$/.test(id.trim());
  const validatePassword = (pwd: string) => pwd.length >= 6;
  const validatePhone = (phone: string) => !phone || /^\+?\d{10,15}$/.test(phone);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isAdminLogin) {
      if (!validateUniqueID(loginUniqueID)) {
        setError('Unique ID must be at least 6 alphanumeric characters');
        setLoading(false);
        return;
      }
    } else {
      if (!validateEmail(loginEmail)) {
        setError('Please enter a valid email');
        setLoading(false);
        return;
      }
    }
    if (!validatePassword(loginPassword)) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const payload = isAdminLogin
          ? { uniqueID: loginUniqueID.trim(), password: loginPassword.trim() }
          : { email: loginEmail, password: loginPassword.trim() };

      const response = await axios.post<LoginResponse>(`${BASE_URL}/api/auth/login`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);

      switch (user.role) {
        case 'superadmin':
          navigate('/superadmin-dashboard');
          break;
        case 'admin':
          navigate('/admindashboard');
          break;
        case 'manager':
          navigate('/manager');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'tutor':
          navigate('/tutor');
          break;
        default:
          navigate('/userdashboard');
      }
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      setError(apiError?.error || 'Failed to login. Please check your credentials or network.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName.trim()) {
      setError('Full name is required');
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (!validatePhone(phoneNumber)) {
      setError('Invalid phone number (10-15 digits)');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post<LoginResponse>(
          `${BASE_URL}/api/auth/register`,
          { fullName, email, password: password.trim(), phoneNumber },
          { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
      );

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      navigate('/userdashboard');
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      setError(apiError?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = (isSignUp: boolean) => {
    setIsRightPanelActive(isSignUp);
    setError('');
    setLoginEmail('');
    setLoginUniqueID('');
    setLoginPassword('');
    setFullName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
  };

  const toggleLoginType = () => {
    setIsAdminLogin(!isAdminLogin);
    setLoginEmail('');
    setLoginUniqueID('');
    setLoginPassword('');
    setError('');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      axios
          .get<User>(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setUser(response.data))
          .catch(() => {
            localStorage.removeItem('token');
            setUser(null);
          });
    }
  }, []);

  return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[url('./assets/Log_Background.jpeg')] bg-no-repeat bg-cover bg-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white/30 shadow-xl rounded-[20px] p-6 sm:p-8 backdrop-blur-2xl border border-white/40">
          {isRightPanelActive ? (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center">Create Account</h2>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <input type="text" placeholder="Full Name" className="p-3 rounded-md border" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <input type="email" placeholder="Email" className="p-3 rounded-md border" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="p-3 rounded-md border" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="Phone Number (optional)" className="p-3 rounded-md border" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <button type="submit" disabled={loading} className="bg-[#010D60] text-white py-2 rounded-md font-bold hover:bg-black transition-all">
                  {loading ? 'Registering...' : 'Sign Up'}
                </button>
                <button type="button" onClick={() => togglePanel(false)} className="text-sm text-center text-[#010D60] hover:underline mt-2">
                  Already have an account? Sign In
                </button>
              </form>
          ) : (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-center">Sign In</h2>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {isAdminLogin ? (
                    <input type="text" placeholder="Unique ID" className="p-3 rounded-md border" value={loginUniqueID} onChange={(e) => setLoginUniqueID(e.target.value)} required />
                ) : (
                    <input type="email" placeholder="Email" className="p-3 rounded-md border" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                )}
                <input type="password" placeholder="Password" className="p-3 rounded-md border" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <button type="button" onClick={toggleLoginType} className="bg-[#364CE2] text-white py-2 px-4 rounded-md font-medium hover:bg-[#010D60] transition">
                    {isAdminLogin ? 'Switch to Email Login' : 'Switch to Unique ID'}
                  </button>
                  <button type="button" onClick={() => togglePanel(true)} className="bg-[#364CE2] text-white py-2 px-4 rounded-md font-medium hover:bg-[#010D60] transition">
                    Switch to Registration
                  </button>
                </div>
                <button type="submit" disabled={loading} className="bg-[#010D60] text-white py-2 rounded-md font-bold hover:bg-black transition-all mt-2">
                  {loading ? 'Logging in...' : 'Sign In'}
                </button>
              </form>
          )}
        </div>
      </div>
  );
};

export default Auth;

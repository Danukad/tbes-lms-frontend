import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const ActivateAccount = () => {
    const [activateData, setActivateData] = useState({
        uniqueID: '',
        password: '',
        confirmPassword: '',
    });
    const [activateError, setActivateError] = useState('');
    const [activateSuccess, setActivateSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = 'http://192.168.8.130:5000';
    const validateInputs = () => {
        if (!activateData.uniqueID.trim() || !activateData.password.trim() || !activateData.confirmPassword.trim()) {
            return 'Unique ID, Password, and Confirm Password are required';
        }
        if (activateData.password.trim() !== activateData.confirmPassword.trim()) {
            return 'Passwords do not match';
        }
        if (activateData.password.trim().length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (!/^[a-zA-Z0-9]{6,}$/.test(activateData.uniqueID.trim())) {
            return 'Unique ID must be at least 6 alphanumeric characters';
        }
        return '';
    };
    const handleActivate = async (e) => {
        e.preventDefault();
        setActivateError('');
        setActivateSuccess('');
        setIsLoading(true);
        const payload = {
            uniqueID: activateData.uniqueID.trim(),
            password: activateData.password.trim(),
            confirmPassword: activateData.confirmPassword.trim(),
        };
        console.log('Activating account:', { uniqueID: payload.uniqueID, password: '***', confirmPassword: '***' });
        const validationError = validateInputs();
        if (validationError) {
            console.error(validationError);
            setActivateError(validationError);
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/activate`, payload, {
                timeout: 30000,
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('Activation response:', response.data);
            setActivateSuccess(`Account ${payload.uniqueID} activated successfully. Redirecting to login...`);
            setTimeout(() => navigate('/login'), 2000); // Redirect after 2s
        }
        catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Failed to activate account';
            console.error('Activation error:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                stack: err.stack,
                code: err.code,
            });
            setActivateError(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen w-full flex items-center justify-center bg-[url('./assets/Log_Background.jpeg')] bg-no-repeat bg-cover bg-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white/30 shadow-xl rounded-[20px] p-6 sm:p-8 backdrop-blur-2xl border border-white/40">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-[#010D60]">Activate Your Account</h2>

                <form onSubmit={handleActivate} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Unique ID</label>
                        <input type="text" value={activateData.uniqueID} onChange={(e) => setActivateData({ ...activateData, uniqueID: e.target.value })} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isLoading}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Password</label>
                        <input type="password" value={activateData.password} onChange={(e) => setActivateData({ ...activateData, password: e.target.value })} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isLoading}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
                        <input type="password" value={activateData.confirmPassword} onChange={(e) => setActivateData({ ...activateData, confirmPassword: e.target.value })} className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={isLoading}/>
                    </div>

                    <button type="submit" disabled={isLoading} className={`w-full py-3 rounded-md font-bold text-white transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#010D60] hover:bg-black'}`}>
                        {isLoading ? 'Activating...' : 'Activate Account'}
                    </button>

                    {activateError && <p className="text-red-500 text-sm mt-1">{activateError}</p>}
                    {activateSuccess && <p className="text-green-600 text-sm mt-1">{activateSuccess}</p>}
                </form>
            </div>
        </div>);
};
export default ActivateAccount;

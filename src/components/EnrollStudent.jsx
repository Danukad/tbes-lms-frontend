import { useState } from 'react';
import axios from 'axios';
const EnrollStudent = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        whatsappNumber: '',
        guardianNumber: '',
        nicNumber: '',
        city: '',
        selectedBatch: '',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    // Mock upcoming batches (replace with API call if dynamic)
    const upcomingBatches = [
        {
            id: 'batch1',
            name: 'Summer Coding Bootcamp 2025',
            description: 'A 12-week intensive program starting June 2025, focusing on full-stack development.',
        },
        {
            id: 'batch2',
            name: 'AI & Machine Learning Fall 2025',
            description: '8-week course on AI fundamentals, starting September 2025.',
        },
        {
            id: 'batch3',
            name: 'Web Development Crash Course 2025',
            description: '6-week course for beginners, starting July 2025.',
        },
    ];
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        const { firstName, lastName, email, whatsappNumber, guardianNumber, nicNumber, city, selectedBatch } = formData;
        // Basic validation
        if (!firstName || !lastName || !email || !whatsappNumber || !guardianNumber || !city || !selectedBatch) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }
        if (!/^\+?\d{10,12}$/.test(whatsappNumber) || !/^\+?\d{10,12}$/.test(guardianNumber)) {
            setError('Please enter valid phone numbers (10-12 digits)');
            setLoading(false);
            return;
        }
        try {
            // Send data to backend (which will handle Google Sheets)
            const response = await axios.post('http://192.168.8.130:5000/api/enroll', {
                firstName,
                lastName,
                email,
                whatsappNumber,
                guardianNumber,
                nicNumber: nicNumber || 'N/A',
                city,
                selectedBatch: upcomingBatches.find((b) => b.id === selectedBatch)?.name || selectedBatch,
            }, { timeout: 30000 });
            setSuccess(response.data.message || 'Enrollment submitted successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                whatsappNumber: '',
                guardianNumber: '',
                nicNumber: '',
                city: '',
                selectedBatch: '',
            });
        }
        catch (err) {
            console.error('Enrollment error:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            });
            setError(err.response?.data?.error || 'Failed to submit enrollment. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    const selectedBatch = upcomingBatches.find((b) => b.id === formData.selectedBatch);
    return (<div className="min-h-screen bg-gradient-to-br from-[#364CE2] to-[#010D60] text-white font-inter p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">Student Enrollment</h1>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white bg-opacity-10 p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-2">First Name <span className="text-red-500">*</span></label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A500]" required/>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Last Name <span className="text-red-500">*</span></label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A500]" required/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Email <span className="text-red-500">*</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A500]" required/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-2">WhatsApp Number <span className="text-red-500">*</span></label>
                            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A500]" required placeholder="+94XXXXXXXXX"/>
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-2">Guardian Number <span className="text-red-500">*</span></label>
                            <input type="text" name="guardianNumber" value={formData.guardianNumber} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A500]" required placeholder="+94XXXXXXXXX"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">NIC Number (Optional)</label>
                        <input type="text" name="nicNumber" value={formData.nicNumber} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A500]" placeholder="Enter NIC if applicable"/>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">City <span className="text-red-500">*</span></label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A500]" required/>
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Upcoming Batches <span className="text-red-500">*</span></label>
                        <select name="selectedBatch" value={formData.selectedBatch} onChange={handleChange} className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#C9A500]" required>
                            <option value="">Select a Batch</option>
                            {upcomingBatches.map((batch) => (<option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>))}
                        </select>
                        {selectedBatch && (<p className="mt-2 text-sm text-gray-300">{selectedBatch.description}</p>)}
                    </div>
                    <button type="submit" disabled={loading} className={`w-full bg-[#C9A500] text-black p-3 rounded-md hover:bg-opacity-80 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </form>
            </div>
        </div>);
};
export default EnrollStudent;

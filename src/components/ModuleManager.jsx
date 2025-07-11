import { useState, useEffect } from 'react';
import axios from 'axios';
const ModuleManager = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState('');
    const [modules, setModules] = useState([]);
    const [selectedModuleId, setSelectedModuleId] = useState('');
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newContent, setNewContent] = useState({ title: '', type: '', description: '', tutorName: '', file: null });
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(() => {
        axios
            .get('http://192.168.8.130:5000/api/courses', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => setCourses(res.data.courses || []))
            .catch((err) => {
            console.error('Failed to load courses', err.message);
            setCourses([]);
        });
    }, []);
    const fetchModules = async () => {
        if (!selectedCourseId)
            return;
        setLoading(true);
        try {
            const res = await axios.get(`http://192.168.8.130:5000/api/modules/${selectedCourseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setModules(res.data || []);
        }
        catch (err) {
            console.error('Failed to load modules', err.response?.data || err.message);
            setModules([]);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchModules();
    }, [selectedCourseId]);
    useEffect(() => {
        if (!selectedModuleId)
            return;
        axios
            .get(`http://192.168.8.130:5000/api/modules/content/${selectedModuleId}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
            setContents(res.data || []);
        })
            .catch((err) => {
            console.error('Failed to load contents', err.response?.data || err.message);
            setContents([]);
        });
    }, [selectedModuleId]);
    const handleAddModule = async () => {
        if (!newModuleTitle || !selectedCourseId) {
            setError('Title and course are required');
            return;
        }
        try {
            await axios.post('http://192.168.8.130:5000/api/modules', { title: newModuleTitle, courseId: selectedCourseId }, { headers: { Authorization: `Bearer ${token}` } });
            setNewModuleTitle('');
            setModalOpen(false);
            await fetchModules();
        }
        catch (err) {
            console.error('Failed to add module:', err.response?.data || err.message);
            setError('Failed to add module');
        }
    };
    const handleEditModule = async () => {
        if (!currentModule?._id || !newModuleTitle) {
            setError('Module ID and title are required');
            return;
        }
        try {
            await axios.put(`http://192.168.8.130:5000/api/modules/${currentModule._id}`, { title: newModuleTitle }, { headers: { Authorization: `Bearer ${token}` } });
            setNewModuleTitle('');
            setModalOpen(false);
            await fetchModules();
        }
        catch (err) {
            console.error('Failed to edit module', err.response?.data || err.message);
            setError('Failed to edit module');
        }
    };
    const handleDeleteModule = async () => {
        if (!currentModule?._id) {
            setError('Module ID is required');
            return;
        }
        try {
            await axios.delete(`http://192.168.8.130:5000/api/modules/${currentModule._id}`, { headers: { Authorization: `Bearer ${token}` } });
            setModalOpen(false);
            await fetchModules();
        }
        catch (err) {
            console.error('Failed to delete module', err.response?.data || err.message);
            setError('Failed to delete module');
        }
    };
    const handleAddContent = async (e) => {
        e.preventDefault();
        if (!newContent.title || !newContent.type || !selectedModuleId || !newContent.file) {
            setError('Title, type, and file are required');
            return;
        }
        const formData = new FormData();
        formData.append('title', newContent.title);
        formData.append('type', newContent.type);
        formData.append('description', newContent.description);
        formData.append('tutorName', newContent.tutorName);
        formData.append('file', newContent.file);
        try {
            await axios.post(`http://192.168.8.130:5000/api/modules/content/${selectedModuleId}`, formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
            setNewContent({ title: '', type: '', description: '', tutorName: '', file: null });
            setModalOpen(false);
            const res = await axios.get(`http://192.168.8.130:5000/api/modules/content/${selectedModuleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContents(res.data || []);
        }
        catch (err) {
            console.error('Failed to add content:', err.response?.data || err.message);
            setError('Failed to add content');
        }
    };
    const handleDeleteContent = async (contentId) => {
        if (!contentId) {
            setError('Content ID is required');
            return;
        }
        try {
            await axios.delete(`http://192.168.8.130:5000/api/modules/content/${contentId}`, { headers: { Authorization: `Bearer ${token}` } });
            setContents(contents.filter((c) => c._id !== contentId));
        }
        catch (err) {
            console.error('Failed to delete content', err.response?.data || err.message);
            setError('Failed to delete content');
        }
    };
    const handleRefreshModules = () => {
        fetchModules();
    };
    return (<div className="p-6">
            <h2 className="text-2xl font-bold text-[#010D60] mb-4">Module & Content Manager</h2>

            <label className="block mb-2 font-semibold text-gray-700">Select Course</label>
            <select onChange={(e) => setSelectedCourseId(e.target.value)} className="p-2 border rounded w-full mb-4" value={selectedCourseId}>
                <option value="">-- Select a Course --</option>
                {courses.map((course) => (<option key={course._id} value={course._id}>
                        {course.title}
                    </option>))}
            </select>

            {selectedCourseId && (<>
                    <div className="flex items-center justify-between">
                        <label className="block mb-2 font-semibold text-gray-700">Select Module</label>
                        <button onClick={() => { setModalType('add'); setModalOpen(true); }} className="bg-[#C9A500] text-white px-3 py-1 rounded hover:bg-[#A78A00] mr-2">
                            + Add Module
                        </button>
                        <button onClick={handleRefreshModules} className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600" disabled={loading}>
                            {loading ? 'Refreshing...' : 'Refresh Modules'}
                        </button>
                    </div>
                    <select onChange={(e) => setSelectedModuleId(e.target.value)} className="p-2 border rounded w-full mb-4" value={selectedModuleId}>
                        <option value="">-- Select a Module --</option>
                        {modules.map((mod) => (<option key={mod._id} value={mod._id}>
                                {mod.title}
                            </option>))}
                    </select>

                    <ul className="mb-4">
                        {modules.map((mod) => (<li key={mod._id} className="flex justify-between items-center border p-2 rounded">
                                <span>{mod.title}</span>
                                <div>
                                    <button onClick={() => { setCurrentModule(mod); setNewModuleTitle(mod.title); setModalType('edit'); setModalOpen(true); }} className="text-sm text-blue-600 hover:underline mr-2">
                                        Edit
                                    </button>
                                    <button onClick={() => { setCurrentModule(mod); setModalType('delete'); setModalOpen(true); }} className="text-sm text-red-600 hover:underline">
                                        Delete
                                    </button>
                                </div>
                            </li>))}
                    </ul>
                </>)}

            {Array.isArray(contents) && contents.length > 0 && selectedModuleId && (<div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-[#364CE2]">Module Contents</h3>
                        <button onClick={() => { setModalType('add'); setModalOpen(true); }} className="bg-[#364CE2] text-white px-3 py-1 rounded hover:bg-[#283BBE]">
                            + Add Content
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {contents.map((item) => (<li key={item._id} className="p-3 border rounded shadow-sm flex justify-between">
                <span>
                  <strong>{item.type?.toUpperCase() || 'UNKNOWN'}</strong>: {item.title || 'Untitled'}
                    {item.description && <p className="text-sm text-gray-500">Desc: {item.description}</p>}
                    {item.tutorName && <p className="text-sm text-gray-500">Tutor: {item.tutorName}</p>}
                    {item.content && <p className="text-sm text-gray-500">File: {item.content}</p>}
                </span>
                                <button onClick={() => handleDeleteContent(item._id)} className="text-sm text-red-600 hover:underline">
                                    Delete
                                </button>
                            </li>))}
                    </ul>
                </div>)}

            {modalOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-[#010D60] mb-4">
                            {modalType === 'add' ? 'Add New' : modalType === 'edit' ? 'Edit' : 'Delete'} {modalType === 'add' ? 'Module/Content' : 'Module'}
                        </h3>
                        {error && <p className="text-red-600 mb-4">{error}</p>}
                        {modalType === 'add' && (modalType === 'add' && selectedModuleId ? (<form onSubmit={handleAddContent}>
                                    <input type="text" value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} placeholder="Title" className="w-full p-2 mb-2 border rounded"/>
                                    <select value={newContent.type} onChange={(e) => setNewContent({ ...newContent, type: e.target.value })} className="w-full p-2 mb-2 border rounded">
                                        <option value="">Select Type</option>
                                        <option value="video">Video</option>
                                        <option value="document">Document</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                    <textarea value={newContent.description} onChange={(e) => setNewContent({ ...newContent, description: e.target.value })} placeholder="Description" className="w-full p-2 mb-2 border rounded"/>
                                    <input type="text" value={newContent.tutorName} onChange={(e) => setNewContent({ ...newContent, tutorName: e.target.value })} placeholder="Tutor's Name" className="w-full p-2 mb-2 border rounded"/>
                                    <input type="file" accept="video/*,application/pdf" onChange={(e) => setNewContent({ ...newContent, file: e.target.files?.[0] || null })} className="w-full p-2 mb-2 border rounded"/>
                                    <div className="flex justify-end">
                                        <button type="button" onClick={() => { setModalOpen(false); setError(null); setNewContent({ title: '', type: '', description: '', tutorName: '', file: null }); }} className="mr-2 text-gray-600 hover:text-gray-800">
                                            Cancel
                                        </button>
                                        <button type="submit" className="bg-[#364CE2] text-white px-3 py-1 rounded hover:bg-[#283BBE]">
                                            Add
                                        </button>
                                    </div>
                                </form>) : (<div>
                                    <input type="text" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} placeholder="Module Title" className="w-full p-2 mb-2 border rounded"/>
                                    <div className="flex justify-end">
                                        <button type="button" onClick={() => { setModalOpen(false); setError(null); setNewModuleTitle(''); }} className="mr-2 text-gray-600 hover:text-gray-800">
                                            Cancel
                                        </button>
                                        <button onClick={handleAddModule} className="bg-[#C9A500] text-white px-3 py-1 rounded hover:bg-[#A78A00]">
                                            Add
                                        </button>
                                    </div>
                                </div>))}
                        {modalType === 'edit' && (<div>
                                <input type="text" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} placeholder="Module Title" className="w-full p-2 mb-2 border rounded"/>
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => { setModalOpen(false); setError(null); setNewModuleTitle(''); }} className="mr-2 text-gray-600 hover:text-gray-800">
                                        Cancel
                                    </button>
                                    <button onClick={handleEditModule} className="bg-[#C9A500] text-white px-3 py-1 rounded hover:bg-[#A78A00]">
                                        Save
                                    </button>
                                </div>
                            </div>)}
                        {modalType === 'delete' && (<div>
                                <p>Are you sure you want to delete "{currentModule?.title}"?</p>
                                <div className="flex justify-end mt-4">
                                    <button type="button" onClick={() => { setModalOpen(false); setError(null); }} className="mr-2 text-gray-600 hover:text-gray-800">
                                        Cancel
                                    </button>
                                    <button onClick={handleDeleteModule} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                        Delete
                                    </button>
                                </div>
                            </div>)}
                    </div>
                </div>)}
        </div>);
};
export default ModuleManager;

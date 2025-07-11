import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
const CourseContentEdit = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState({
        courseId: courseId || '',
        objectives: [''],
        stack: [''],
        overview: [''],
        freeVideos: [{ title: '', url: '' }],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchContent = async () => {
            if (!courseId) {
                setError('No course ID provided');
                return;
            }
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BASE_URL}/api/courses/${courseId}/content`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 15000,
                });
                setContent((prev) => ({ ...prev, ...response.data, courseId }));
            }
            catch (err) {
                setError('Failed to load content');
            }
            finally {
                setLoading(false);
            }
        };
        if (courseId)
            fetchContent();
    }, [courseId]);
    const handleChange = (field, index, value) => {
        setContent((prev) => {
            const updated = Array.isArray(prev[field]) ? [...prev[field]] : [];
            updated[index] = value;
            return { ...prev, [field]: updated };
        });
    };
    const handleVideoChange = (index, field, value) => {
        setContent((prev) => {
            const updatedVideos = [...prev.freeVideos];
            updatedVideos[index] = { ...updatedVideos[index], [field]: value };
            return { ...prev, freeVideos: updatedVideos };
        });
    };
    const addField = (field) => {
        setContent((prev) => {
            const updated = Array.isArray(prev[field]) ? [...prev[field], ''] : [''];
            return { ...prev, [field]: updated };
        });
    };
    const addVideo = () => {
        setContent((prev) => ({ ...prev, freeVideos: [...prev.freeVideos, { title: '', url: '' }] }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!courseId) {
            setError('No course ID provided');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}/api/courses/${courseId}/content`, content, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 15000,
            });
            window.dispatchEvent(new Event('courseContentUpdated'));
            navigate(`/coursecontent/${courseId}`);
        }
        catch (err) {
            setError(err.response?.data?.error || 'Failed to save content');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Course Content for {courseId || 'New Course'}</h2>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            {loading && <div className="text-gray-600 mb-4">Saving...</div>}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Objectives</h3>
                    {content.objectives.map((obj, index) => (<input key={index} type="text" value={obj} onChange={(e) => handleChange('objectives', index, e.target.value)} className="border p-2 mb-2 w-full rounded" placeholder={`Objective ${index + 1}`}/>))}
                    <button type="button" onClick={() => addField('objectives')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Objective
                    </button>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Stack</h3>
                    {content.stack.map((tech, index) => (<input key={index} type="text" value={tech} onChange={(e) => handleChange('stack', index, e.target.value)} className="border p-2 mb-2 w-full rounded" placeholder={`Tech ${index + 1}`}/>))}
                    <button type="button" onClick={() => addField('stack')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Tech
                    </button>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Overview</h3>
                    {content.overview.map((item, index) => (<input key={index} type="text" value={item} onChange={(e) => handleChange('overview', index, e.target.value)} className="border p-2 mb-2 w-full rounded" placeholder={`Overview Point ${index + 1}`}/>))}
                    <button type="button" onClick={() => addField('overview')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Overview
                    </button>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Free Videos</h3>
                    {content.freeVideos.map((video, index) => (<div key={index} className="mb-4">
                            <input type="text" value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value)} className="border p-2 mb-2 w-full rounded" placeholder={`Video ${index + 1} Title`}/>
                            <input type="text" value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value)} className="border p-2 mb-2 w-full rounded" placeholder={`Video ${index + 1} URL`}/>
                        </div>))}
                    <button type="button" onClick={addVideo} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Add Video
                    </button>
                </div>
                <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Save Content
                </button>
            </form>
        </div>);
};
export default CourseContentEdit;

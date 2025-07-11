import { useState } from 'react';
const Settings = () => {
    const [settings, setSettings] = useState({
        primaryColor: '#2563eb',
        fontFamily: 'Inter',
    });
    const handleSave = (e) => {
        e.preventDefault();
        alert('Settings saved! (Placeholder: Implement backend API)');
    };
    return (<div>
            <h2 className="text-2xl font-semibold mb-4">Website Settings</h2>
            <form onSubmit={handleSave}>
                <div className="mb-4">
                    <label className="block text-gray-700">Primary Color</label>
                    <input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-20 h-10 border rounded-md"/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Font Family</label>
                    <select value={settings.fontFamily} onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })} className="w-full px-4 py-2 border rounded-md">
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                    Save Settings
                </button>
            </form>
            <p className="mt-4 text-gray-600">
                Note: Saving settings is a placeholder. Implement a backend API to persist changes.
            </p>
        </div>);
};
export default Settings;

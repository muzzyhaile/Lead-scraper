
import React, { useState } from 'react';
import { User } from '../types';
import { SaveIcon, ArrowLeftIcon } from './icons';

interface ProfileSettingsProps {
    user: User;
    onUpdate: (user: User) => void;
    onBack: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate, onBack }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState(user.avatar);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({ name, email, avatar });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-gray-900 placeholder-gray-400 shadow-sm transition-all";

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-up">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeftIcon />
                Back
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-4 mb-8">
                    <img src={avatar} alt={name} className="w-20 h-20 rounded-full bg-gray-100 object-cover border-2 border-brand-100" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="text-gray-500">Manage your account information</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Avatar URL</label>
                        <input
                            type="url"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            className={inputClass}
                            placeholder="https://..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Paste a link to your profile image.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className={`text-sm font-medium text-green-600 transition-opacity ${isSaved ? 'opacity-100' : 'opacity-0'}`}>
                            Changes saved successfully!
                        </span>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                        >
                            <SaveIcon />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;

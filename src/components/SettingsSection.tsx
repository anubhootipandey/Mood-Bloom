import React, { useEffect, useState } from 'react';
import { Bell, Moon, Volume2, Shield, User } from 'lucide-react';
import { useStore } from '../lib/store';

interface Setting {
  id: string;
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  type: 'toggle' | 'select' | 'input';
  options?: string[];
}

const settings: Setting[] = [
  { id: 'notifications', icon: Bell, title: 'Notifications', description: 'Receive daily reminders and updates', type: 'toggle' },
  { id: 'darkMode', icon: Moon, title: 'Dark Mode', description: 'Switch between light and dark theme', type: 'toggle' },
  { id: 'sound', icon: Volume2, title: 'Sound Effects', description: 'Play sounds for interactions', type: 'toggle' },
  { id: 'privacy', icon: Shield, title: 'Privacy', description: 'Manage your privacy settings', type: 'select', options: ['public', 'friends', 'private'] },
  { id: 'name', icon: User, title: 'Profile Information', description: 'Update your personal information', type: 'input' },
];

const SettingsSection = () => {
  const { settings: userSettings, updateSettings } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggle = (id: keyof typeof userSettings) => {
    updateSettings({ [id]: !userSettings[id] });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePrivacyChange = (value: string) => {
    updateSettings({ privacy: value as 'public' | 'friends' | 'private' });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleNameChange = (value: string) => {
    updateSettings({ name: value });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', userSettings.darkMode);
  }, [userSettings.darkMode]);

  return (
    <div className="bg-gradient-to-t from-rose-100 via-purple-100 to-green-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="font-handwriting text-2xl sm:text-3xl text-gray-700 mb-6 sm:mb-8 text-center">Settings</h2>

        <div className="space-y-6">
          {settings.map(({ id, icon: Icon, title, description, type, options }) => (
            <div key={id} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="p-3 rounded-full bg-gray-50 text-pink-300">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-handwriting text-lg sm:text-xl text-gray-700">{title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{description}</p>
              </div>
              <div className="w-full sm:w-auto">
                {type === 'toggle' && (
                  <button
                    onClick={() => handleToggle(id as keyof typeof userSettings)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center ${
                      userSettings[id as keyof typeof userSettings] ? 'bg-pink-300' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        userSettings[id as keyof typeof userSettings] ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                )}
                {type === 'select' && (
                  <select
                    value={userSettings.privacy}
                    onChange={(e) => handlePrivacyChange(e.target.value)}
                    className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  >
                    {options?.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
                {type === 'input' && (
                  <input
                    type="text"
                    value={userSettings.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {showSuccess && (
          <div className="mt-4 p-4 bg-green-200/20 text-green-300 rounded-lg text-center animate-fade-in">
            Settings updated successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;

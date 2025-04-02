import React, { useEffect } from 'react';
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
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    description: 'Receive daily reminders and updates',
    type: 'toggle',
  },
  {
    id: 'darkMode',
    icon: Moon,
    title: 'Dark Mode',
    description: 'Switch between light and dark theme',
    type: 'toggle',
  },
  {
    id: 'sound',
    icon: Volume2,
    title: 'Sound Effects',
    description: 'Play sounds for interactions',
    type: 'toggle',
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy',
    description: 'Manage your privacy settings',
    type: 'select',
    options: ['public', 'friends', 'private'],
  },
  {
    id: 'name',
    icon: User,
    title: 'Profile Information',
    description: 'Update your personal information',
    type: 'input',
  },
];

const SettingsSection = () => {
  const { settings: userSettings, updateSettings } = useStore();
  const [showSuccess, setShowSuccess] = React.useState(false);

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
    if (userSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSettings.darkMode]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <h2 className="font-handwriting text-3xl text-gray-700 mb-8">Settings</h2>

        <div className="space-y-6">
          {settings.map((setting) => (
            <div key={setting.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gray-50 text-pink-300">
                  <setting.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-handwriting text-xl text-gray-700">{setting.title}</h3>
                  <p className="text-gray-600">{setting.description}</p>
                </div>
                <div>
                  {setting.type === 'toggle' && (
                    <button
                      onClick={() => handleToggle(setting.id as keyof typeof userSettings)}
                      className={`w-14 h-8 rounded-full p-1 transition-colors ${
                        userSettings[setting.id as keyof typeof userSettings]
                          ? 'bg-pink-200'
                          : 'bg-gray-200'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                          userSettings[setting.id as keyof typeof userSettings]
                            ? 'translate-x-6'
                            : ''
                        }`}
                      />
                    </button>
                  )}
                  {setting.type === 'select' && (
                    <select
                      value={userSettings.privacy}
                      onChange={(e) => handlePrivacyChange(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    >
                      {setting.options?.map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  )}
                  {setting.type === 'input' && (
                    <input
                      type="text"
                      value={userSettings.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                    />
                  )}
                </div>
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
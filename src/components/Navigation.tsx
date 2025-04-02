import React from 'react';
import { Home, Book, Smile, Trophy, Settings } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: Book, label: 'Journal', id: 'journal' },
    { icon: Smile, label: 'Mood', id: 'mood' },
    { icon: Trophy, label: 'Challenges', id: 'challenges' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => onSectionChange('home')}
            className="flex-shrink-0 font-handwriting text-2xl text-pink-300 hover:scale-105 transition-transform"
          >
            MoodBloom
          </button>
          <div className="flex space-x-8">
            {navItems.map(({ icon: Icon, label, id }) => (
              <button
                key={id}
                onClick={() => onSectionChange(id)}
                className={`flex flex-col items-center p-2 transition-all transform hover:scale-105
                  ${activeSection === id 
                    ? 'text-pink-300 scale-105' 
                    : 'text-gray-600 hover:text-pink-300'}`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
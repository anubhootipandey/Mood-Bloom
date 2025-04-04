import React, { useState } from "react";
import { Home, Book, Smile, Trophy, Settings, GraduationCap, Menu, X } from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", id: "home" },
    { icon: Book, label: "Journal", id: "journal" },
    { icon: Smile, label: "Mood", id: "mood" },
    { icon: Trophy, label: "Challenges", id: "challenges" },
    { icon: GraduationCap, label: "Study", id: "study" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onSectionChange("home")}
            className="flex-shrink-0 font-serif text-2xl text-pink-300 hover:scale-105 transition-transform"
          >
            MoodBloom
          </button>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 hover:text-pink-300 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map(({ icon: Icon, label, id }) => (
              <button
                key={id}
                onClick={() => onSectionChange(id)}
                className={`flex flex-col items-center p-2 transition-all transform hover:scale-105
                  ${activeSection === id ? "text-pink-300 scale-105" : "text-gray-500 hover:text-pink-300"}`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute left-0 right-0 bg-white shadow-md py-2">
          {navItems.map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => {
                onSectionChange(id);
                setIsOpen(false); // Close menu after selection
              }}
              className={`flex items-center space-x-3 px-6 py-3 w-full text-left
                ${activeSection === id ? "text-pink-300 bg-gray-100" : "text-gray-600 hover:text-pink-300 hover:bg-gray-50"}`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;

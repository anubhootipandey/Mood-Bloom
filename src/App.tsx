import  { useState } from 'react';
import MoodSection from './components/MoodSection';
import JournalSection from './components/JournalSection';
import ChallengesSection from './components/ChallengesSection';
import SettingsSection from './components/SettingsSection';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import StudySection from './components/StudySelection';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'mood':
        return <MoodSection />;
      case 'journal':
        return <JournalSection />;
      case 'challenges':
        return <ChallengesSection />;
        case 'study':
        return <StudySection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return (
          <>
            <Hero />
            <section className="bg-gradient-to-t from-pink-200 via-rose-200 to-green-200 py-16 px-4">
              <MoodSection />
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="pt-16">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;
import  { useState } from 'react';
import { Smile, Frown, Meh, Heart, Star, Sun, Cloud, CloudRain, CloudLightning, Moon } from 'lucide-react';
import { useStore } from '../lib/store';
import { format, subDays } from 'date-fns';

const moods = [
  { icon: Smile, label: 'Happy', color: 'text-rose-300', bg: 'bg-rose-100' },
  { icon: Heart, label: 'Loved', color: 'text-pink-300', bg: 'bg-pink-100' },
  { icon: Star, label: 'Excited', color: 'text-green-300', bg: 'bg-green-100' },
  { icon: Sun, label: 'Energetic', color: 'text-yellow-400', bg: 'bg-yellow-100' },
  { icon: Meh, label: 'Neutral', color: 'text-sky-300', bg: 'bg-sky-100' },
  { icon: Cloud, label: 'Calm', color: 'text-blue-400', bg: 'bg-blue-100' },
  { icon: CloudRain, label: 'Sad', color: 'text-purple-300', bg: 'bg-purple-100' },
  { icon: CloudLightning, label: 'Angry', color: 'text-red-400', bg: 'bg-red-100' },
  { icon: Moon, label: 'Tired', color: 'text-purple-400', bg: 'bg-purple-100' },
  { icon: Frown, label: 'Stressed', color: 'text-gray-400', bg: 'bg-gray-100' },
];

const MoodSection = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { addMood, getMoodHistory } = useStore();
  const moodHistory = getMoodHistory();

  const handleSaveMood = () => {
    if (selectedMood) {
      addMood(selectedMood, note);
      setSelectedMood(null);
      setNote('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const getMoodIcon = (moodLabel: string) => {
    const mood = moods.find(m => m.label === moodLabel);
    return mood ? mood.icon : Meh;
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const mood = moodHistory.find(m => m.date === date);
    return { date, mood };
  }).reverse();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <h2 className="font-handwriting text-3xl text-gray-700 mb-8 text-center">
          How are you feeling today?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          {moods.map(({ icon: Icon, label, color, bg }) => (
            <button
              key={label}
              onClick={() => setSelectedMood(label)}
              className={`group flex flex-col items-center p-4 rounded-xl transition-all transform hover:scale-105
                ${selectedMood === label ? `${bg} shadow-lg scale-105` : 'bg-white shadow'}`}
            >
              <div className={`p-4 rounded-full transition-all ${color}`}>
                <Icon className="h-8 w-8" />
              </div>
              <span className="mt-2 font-handwriting text-gray-600">{label}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="animate-fade-in">
            <h3 className="font-handwriting text-xl text-gray-700 mb-4">
              Would you like to add a note about feeling {selectedMood.toLowerCase()}?
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write your thoughts here..."
              className="w-full p-4 rounded-xl bg-white/50 border border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all"
              rows={4}
            />
            <button 
              onClick={handleSaveMood}
              className="mt-4 bg-pink-200 hover:bg-purple-200 text-gray-700 font-semibold py-2 px-6 rounded-full shadow-md transform transition hover:scale-105"
            >
              Save Entry
            </button>
          </div>
        )}

        {showSuccess && (
          <div className="mt-4 p-4 bg-green-200/20 text-green-300 rounded-lg text-center animate-fade-in">
            Mood saved successfully!
          </div>
        )}
      </div>

      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <h3 className="font-handwriting text-2xl text-gray-700 mb-6">Your Mood History</h3>
        <div className="grid grid-cols-7 gap-4">
          {last7Days.map(({ date, mood }) => {
            const Icon = mood ? getMoodIcon(mood.mood) : Meh;
            const moodData = moods.find(m => m.label === mood?.mood);
            
            return (
              <div key={date} className="flex flex-col items-center">
                <div className={`aspect-square w-full rounded-lg ${mood ? moodData?.bg : 'bg-gray-100'} 
                  flex items-center justify-center transition-all hover:scale-105 cursor-pointer group`}
                >
                  <Icon className={`h-6 w-6 ${mood ? moodData?.color : 'text-gray-300'}`} />
                  {mood?.note && (
                    <div className="absolute invisible group-hover:visible bg-white p-2 rounded shadow-lg text-sm z-10">
                      {mood.note}
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {format(new Date(date), 'MMM d')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodSection;
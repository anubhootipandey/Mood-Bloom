import { Smile, Frown, Meh, Heart, Star } from 'lucide-react';

const moods = [
  { icon: Smile, label: 'Happy', color: 'text-rose-300' },
  { icon: Heart, label: 'Loved', color: 'text-pink-300' },
  { icon: Star, label: 'Excited', color: 'text-green-300' },
  { icon: Meh, label: 'Neutral', color: 'text-sky-300' },
  { icon: Frown, label: 'Sad', color: 'text-purple-300' },
];

const MoodSelector = () => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
      <h2 className="font-handwriting text-3xl text-gray-700 mb-8 text-center">
        How are you feeling today?
      </h2>
      <div className="flex justify-center space-x-8">
        {moods.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            className="group flex flex-col items-center transition-transform hover:scale-110"
          >
            <div className={`p-6 rounded-full bg-white shadow-md group-hover:shadow-xl transition-all ${color}`}>
              <Icon className="h-12 w-12" />
            </div>
            <span className="mt-2 font-handwriting text-gray-600">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
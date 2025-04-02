import { Cloud, Heart } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pink-200 via-rose-200 to-green-200 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Cloud className="absolute text-white/30 h-24 w-24 animate-float" style={{ top: '10%', left: '10%' }} />
        <Cloud className="absolute text-white/30 h-16 w-16 animate-float" style={{ top: '30%', right: '15%', animationDelay: '1s' }} />
        <Heart className="absolute text-purple-300/30 h-12 w-12 animate-float" style={{ bottom: '20%', left: '20%', animationDelay: '2s' }} />
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="font-serif text-6xl mb-6 text-gray-800">
          Welcome to MoodBloom
        </h1>
        <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
          Your daily companion for mindfulness and self-care. Track your moods, journal your thoughts, and grow your well-being.
        </p>
        <button className="bg-pink-200 hover:bg-purple-200 text-gray-700 font-semibold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105 hover:shadow-xl">
          Start Tracking Your Mood Today!
        </button>
      </div>
    </div>
  );
};

export default Hero;
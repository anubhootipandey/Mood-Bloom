import React, { useState } from 'react';
import { Trophy, Droplet, Heart, Brain, Sun, Moon } from 'lucide-react';
import { useStore } from '../lib/store';

interface Challenge {
  id: number;
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  maxProgress: number;
  color: string;
}

const challenges: Challenge[] = [
  {
    id: 1,
    icon: Droplet,
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water today',
    maxProgress: 8,
    color: 'text-sky-300',
  },
  {
    id: 2,
    icon: Heart,
    title: 'Self-Care Champion',
    description: 'Complete 3 self-care activities',
    maxProgress: 3,
    color: 'text-pink-300',
  },
  {
    id: 3,
    icon: Brain,
    title: 'Mindfulness Master',
    description: 'Meditate for 10 minutes',
    maxProgress: 1,
    color: 'text-purple-300',
  },
  {
    id: 4,
    icon: Sun,
    title: 'Morning Routine',
    description: 'Complete your morning routine',
    maxProgress: 1,
    color: 'text-rose-300',
  },
  {
    id: 5,
    icon: Moon,
    title: 'Better Sleep',
    description: 'Maintain a consistent sleep schedule',
    maxProgress: 1,
    color: 'text-green-300',
  },
];

const ChallengesSection = () => {
  const { challenges: challengeProgress, updateChallenge, getPoints } = useStore();
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const points = getPoints();

  const handleProgress = (challengeId: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const currentProgress = challengeProgress[challengeId].progress;
    const newProgress = currentProgress < challenge.maxProgress ? currentProgress + 1 : 0;
    
    updateChallenge(challengeId, newProgress);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isCompleted = (challengeId: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    return challenge && challengeProgress[challengeId].progress >= challenge.maxProgress;
  };

  const getProgressPercentage = (challengeId: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (!challenge) return 0;
    return (challengeProgress[challengeId].progress / challenge.maxProgress) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-handwriting text-3xl text-gray-700">Daily Challenges</h2>
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <span className="font-handwriting text-xl text-gray-600">{points} Points</span>
          </div>
        </div>

        <div className="grid gap-6">
          {challenges.map((challenge) => {
            const progress = challengeProgress[challenge.id].progress;
            const completed = isCompleted(challenge.id);
            
            return (
              <div
                key={challenge.id}
                className={`bg-white rounded-xl p-6 shadow-md transition-all transform hover:scale-101 cursor-pointer
                  ${activeChallenge === challenge.id ? 'ring-2 ring-soft-pink' : ''}
                  ${completed ? 'bg-green-200/10' : ''}`}
                onClick={() => setActiveChallenge(challenge.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-gray-50 ${challenge.color}`}>
                    <challenge.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-handwriting text-xl text-gray-700">{challenge.title}</h3>
                    <p className="text-gray-600">{challenge.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-handwriting text-2xl text-gray-700">
                      {progress}/{challenge.maxProgress}
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ease-out
                      ${completed ? 'bg-green-200' : 'bg-gradient-to-r from-pink-200 to-purple-200'}`}
                    style={{ width: `${getProgressPercentage(challenge.id)}%` }}
                  />
                </div>

                {activeChallenge === challenge.id && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProgress(challenge.id);
                      }}
                      className="bg-pink-200 hover:bg-purple-200 text-gray-700 font-semibold py-2 px-6 rounded-full shadow-md transform transition hover:scale-105"
                    >
                      {completed ? 'Reset Progress' : 'Update Progress'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showSuccess && (
          <div className="mt-4 p-4 bg-green-200/20 text-green-300 rounded-lg text-center animate-fade-in">
            Challenge progress updated successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesSection;
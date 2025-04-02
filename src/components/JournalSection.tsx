import { useState } from 'react';
import { Calendar, Star, Heart, Cloud, Sun, Moon, Save } from 'lucide-react';
import { useStore } from '../lib/store';
import { format } from 'date-fns';

const stickers = [
  { icon: Star, color: 'text-yellow-400' },
  { icon: Heart, color: 'text-pink-400' },
  { icon: Cloud, color: 'text-sky-400' },
  { icon: Sun, color: 'text-rose-400' },
  { icon: Moon, color: 'text-purple-400' },
];

const JournalSection = () => {
  const { entries, addEntry, updateEntry, getEntries } = useStore();
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const allEntries = getEntries();

  const addSticker = (stickerName: string) => {
    setSelectedStickers([...selectedStickers, stickerName]);
  };

  const handleSave = (isDraft: boolean) => {
    if (editingId) {
      updateEntry(editingId, currentEntry, selectedStickers, isDraft);
    } else {
      addEntry(currentEntry, selectedStickers, isDraft);
    }
    setCurrentEntry('');
    setSelectedStickers([]);
    setEditingId(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const loadEntry = (entry: typeof entries[0]) => {
    setCurrentEntry(entry.content);
    setSelectedStickers(entry.stickers);
    setEditingId(entry.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-handwriting text-3xl text-gray-700">Daily Journal</h2>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
        </div>

        <div className="mb-6 flex space-x-4">
          {stickers.map(({ icon: Icon, color }, index) => (
            <button
              key={index}
              onClick={() => addSticker(color)}
              className={`p-2 rounded-full hover:bg-gray-100 transition-all transform hover:scale-110 ${color}`}
            >
              <Icon className="h-6 w-6" />
            </button>
          ))}
        </div>

        <div className="relative bg-white rounded-xl p-6 shadow-inner min-h-[400px]">
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="Dear Diary..."
            className="w-full h-full min-h-[360px] bg-transparent font-handwriting text-lg focus:outline-none resize-none"
          />
          <div className="absolute top-2 right-2 flex flex-wrap gap-2">
            {selectedStickers.map((color, index) => (
              <span key={index} className={`inline-block ${color}`}>
                <Star className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button 
            onClick={() => handleSave(true)}
            className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave(false)}
            className="px-6 py-2 rounded-full bg-pink-200 text-gray-700 hover:bg-purple-200 transition-colors shadow-md"
          >
            Publish Entry
          </button>
        </div>

        {showSuccess && (
          <div className="mt-4 p-4 bg-green-200/20 text-green-400 rounded-lg text-center animate-fade-in">
            Journal entry saved successfully!
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {allEntries.map((entry) => (
          <div
            key={entry.id}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md cursor-pointer
              ${entry.isDraft ? 'border-l-4 border-gray-300' : 'border-l-4 border-pink-300'}`}
            onClick={() => loadEntry(entry)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                {format(new Date(entry.date), 'MMMM d, yyyy')}
              </span>
              <div className="flex space-x-2">
                {entry.stickers.map((color, index) => (
                  <span key={index} className={`${color}`}>
                    <Star className="h-4 w-4" />
                  </span>
                ))}
              </div>
            </div>
            <p className="font-handwriting text-gray-700 line-clamp-3">{entry.content}</p>
            {entry.isDraft && (
              <div className="flex items-center mt-2 text-gray-500 text-sm">
                <Save className="h-4 w-4 mr-1" />
                Draft
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalSection;
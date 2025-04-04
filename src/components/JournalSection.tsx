import { useState } from 'react';
import { Calendar, Star, Heart, Cloud, Sun, Moon, Save, Trash2, Edit3 } from 'lucide-react';
import { useStore } from '../lib/store';
import { format } from 'date-fns';

const stickers = [
  { icon: Star, color: 'text-yellow-400' },
  { icon: Heart, color: 'text-pink-300' },
  { icon: Cloud, color: 'text-sky-300' },
  { icon: Sun, color: 'text-rose-300' },
  { icon: Moon, color: 'text-purple-300' },
];

const JournalSection = () => {
  const { entries, addEntry, updateEntry, deleteEntry, getEntries } = useStore();
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const allEntries = getEntries();

  const addSticker = (stickerName: string) => {
    if (selectedStickers.includes(stickerName)) {
      setSelectedStickers(selectedStickers.filter(s => s !== stickerName));
    } else {
      setSelectedStickers([...selectedStickers, stickerName]);
    }
  };

  const handleSave = (isDraft: boolean) => {
    if (editingId) {
      updateEntry(editingId, currentEntry, selectedStickers, isDraft);
      setSuccessMessage('Journal entry updated successfully!');
    } else {
      addEntry(currentEntry, selectedStickers, isDraft);
      setSuccessMessage('Journal entry saved successfully!');
    }
    setCurrentEntry('');
    setSelectedStickers([]);
    setEditingId(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setShowDeleteConfirm(null);
    setSuccessMessage('Journal entry deleted successfully!');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const loadEntry = (entry: typeof entries[0]) => {
    setCurrentEntry(entry.content);
    setSelectedStickers(entry.stickers);
    setEditingId(entry.id);
  };

  const clearForm = () => {
    setCurrentEntry('');
    setSelectedStickers([]);
    setEditingId(null);
  };

  return (
    <div className='bg-gradient-to-t from-pink-100 via-rose-100 to-green-100'>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row gap-1 justify-between mb-6">
          <h2 className="font-handwriting text-3xl text-gray-700">
            {editingId ? 'Edit Journal Entry' : 'New Journal Entry'}
          </h2>
          <div className="flex items-center text-sm md:text-[16px] text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          {stickers.map(({ icon: Icon, color }, index) => (
            <button
              key={index}
              onClick={() => addSticker(color)}
              className={`p-3 rounded-full transition-all transform hover:scale-110
                ${selectedStickers.includes(color) ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'}`}
            >
              <Icon className={`h-6 w-6 ${color}`} />
            </button>
          ))}
        </div>

        <div className="relative bg-white rounded-xl p-6 shadow-inner border border-pink-200 min-h-[400px]">
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

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end items-center sm:space-x-4 gap-2">
          {editingId && (
            <button 
              onClick={clearForm}
              className="w-full sm:w-auto px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={() => handleSave(true)}
            className="w-full sm:w-auto px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave(false)}
            className="w-full sm:w-auto px-6 py-2 rounded-full bg-pink-200 text-gray-700 hover:bg-purple-200 transition-colors shadow-md"
          >
            {editingId ? 'Update Entry' : 'Publish Entry'}
          </button>
        </div>


        {showSuccess && (
          <div className="mt-4 p-4 bg-green-200/20 text-green-400 rounded-lg text-center animate-fade-in">
            {successMessage}
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        {allEntries.map((entry) => (
          <div
            key={entry.id}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md relative group
              ${entry.isDraft ? 'border-l-4 border-gray-300' : 'border-l-4 border-pink-400'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">
                {format(new Date(entry.date), 'MMMM d, yyyy')}
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {entry.stickers.map((color, index) => (
                    <span key={index} className={`${color}`}>
                      <Star className="h-4 w-4" />
                    </span>
                  ))}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button
                    onClick={() => loadEntry(entry)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <Edit3 className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(entry.id)}
                    className="p-1 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 animate-fade-in">
            <h4 className="text-xl font-semibold mb-4">Delete Journal Entry?</h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default JournalSection;
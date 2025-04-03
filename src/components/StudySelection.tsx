import { useState } from 'react';
import {  Clock, Plus, Trash2, Edit3, 
  CheckCircle2, XCircle
} from 'lucide-react';
import { useStore } from '../lib/store';
import { format } from 'date-fns';

const priorityColors = {
  low: 'bg-sky text-blue-700',
  medium: 'bg-peach text-orange-700',
  high: 'bg-soft-pink text-pink-700'
};

const StudySection = () => {
  const { 
    studySessions, subjects,
    addStudySession, updateStudySession, deleteStudySession,
    addSubject, updateSubject, deleteSubject
  } = useStore();

  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'session' | 'subject'; id: string } | null>(null);

  const [sessionForm, setSessionForm] = useState({
    subject: '',
    topic: '',
    duration: 30,
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    color: '#FCE4EC',
    targetHours: 10
  });

  const handleAddSession = () => {
    if (editingSession) {
      updateStudySession(editingSession, {
        ...sessionForm,
        completed: false
      });
    } else {
      addStudySession({
        ...sessionForm,
        completed: false
      });
    }
    setShowAddSession(false);
    setEditingSession(null);
    setSessionForm({
      subject: '',
      topic: '',
      duration: 30,
      date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      priority: 'medium'
    });
  };

  const handleAddSubject = () => {
    if (editingSubject) {
      updateSubject(editingSubject, {
        ...subjectForm,
        totalHours: 0
      });
    } else {
      addSubject({
        ...subjectForm,
        totalHours: 0
      });
    }
    setShowAddSubject(false);
    setEditingSubject(null);
    setSubjectForm({
      name: '',
      color: '#FCE4EC',
      targetHours: 10
    });
  };

  const handleDelete = () => {
    if (!showDeleteConfirm) return;

    if (showDeleteConfirm.type === 'session') {
      deleteStudySession(showDeleteConfirm.id);
    } else {
      deleteSubject(showDeleteConfirm.id);
    }
    setShowDeleteConfirm(null);
  };

  const toggleSessionComplete = (id: string, completed: boolean) => {
    updateStudySession(id, { completed });
  };

  return (
    <div className='bg-gradient-to-t min-h-screen from-pink-50 via-rose-50 to-green-50'>
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-handwriting text-2xl text-gray-700">Subjects</h2>
            <button
              onClick={() => setShowAddSubject(true)}
              className="p-2 rounded-full bg-pink-200 text-gray-700 hover:bg-purple-200 transition-all"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {subjects.map(subject => (
              <div
                key={subject.id}
                className="bg-white rounded-xl p-4 shadow-sm group relative"
                style={{ borderLeft: `4px solid ${subject.color}` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-handwriting text-lg text-gray-700">{subject.name}</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingSubject(subject.id);
                        setSubjectForm({
                          name: subject.name,
                          color: subject.color,
                          targetHours: subject.targetHours
                        });
                        setShowAddSubject(true);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Edit3 className="h-4 w-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm({ type: 'subject', id: subject.id })}
                      className="p-1 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    Progress: {subject.totalHours}/{subject.targetHours} hours
                  </div>
                  <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-200 to-purple-200 transition-all"
                      style={{ width: `${(subject.totalHours / subject.targetHours) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-handwriting text-2xl text-gray-700">Study Sessions</h2>
            <button
              onClick={() => setShowAddSession(true)}
              className="p-2 rounded-full bg-pink-200 text-gray-700 hover:bg-purple-200 transition-all"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {studySessions.map(session => {
              const subject = subjects.find(s => s.id === session.subject);
              return (
                <div
                  key={session.id}
                  className={`bg-white rounded-xl p-4 shadow-sm group relative
                    ${session.completed ? 'opacity-75' : ''}`}
                  style={{ borderLeft: `4px solid ${subject?.color || '#gray-300'}` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-handwriting text-lg text-gray-700">{session.topic}</h3>
                      <p className="text-sm text-gray-500">{subject?.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${priorityColors[session.priority]}`}>
                        {session.priority}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{session.duration}min</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button
                          onClick={() => toggleSessionComplete(session.id, !session.completed)}
                          className={`p-1 rounded-full ${
                            session.completed ? 'hover:bg-red-50' : 'hover:bg-green-50'
                          }`}
                        >
                          {session.completed ? (
                            <XCircle className="h-5 w-5 text-red-400" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingSession(session.id);
                            setSessionForm({
                              subject: session.subject,
                              topic: session.topic,
                              duration: session.duration,
                              date: session.date,
                              notes: session.notes,
                              priority: session.priority
                            });
                            setShowAddSession(true);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Edit3 className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm({ type: 'session', id: session.id })}
                          className="p-1 rounded-full hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {session.notes && (
                    <p className="mt-2 text-sm text-gray-600">{session.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAddSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">
              {editingSession ? 'Edit Study Session' : 'Add Study Session'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={sessionForm.subject}
                  onChange={(e) => setSessionForm({ ...sessionForm, subject: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={sessionForm.topic}
                  onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400"
                  placeholder="What are you studying?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) })}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400"
                    min="5"
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={sessionForm.priority}
                    onChange={(e) => setSessionForm({ ...sessionForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400"
                  rows={3}
                  placeholder="Any additional notes..."
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowAddSession(false);
                  setEditingSession(null);
                }}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSession}
                className="px-4 py-2 rounded-full bg-pink-200 text-gray-700 hover:bg-purple-200"
              >
                {editingSession ? 'Update Session' : 'Add Session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4">
              {editingSubject ? 'Edit Subject' : 'Add Subject'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={subjectForm.color}
                  onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Hours
                </label>
                <input
                  type="number"
                  value={subjectForm.targetHours}
                  onChange={(e) => setSubjectForm({ ...subjectForm, targetHours: parseInt(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-400"
                  min="1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowAddSubject(false);
                  setEditingSubject(null);
                }}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="px-4 py-2 rounded-full bg-pink-200 text-gray-700 hover:bg-purple-200"
              >
                {editingSubject ? 'Update Subject' : 'Add Subject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 animate-fade-in">
            <h4 className="text-xl font-semibold mb-4">
              Delete {showDeleteConfirm.type === 'session' ? 'Study Session' : 'Subject'}?
            </h4>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone.
              {showDeleteConfirm.type === 'subject' && (
                <span className="block mt-2 text-red-400">
                  Note: Deleting a subject will also delete all associated study sessions.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-400"
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

export default StudySection;
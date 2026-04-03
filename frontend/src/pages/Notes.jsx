import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import {
  FiPlus,
  FiSearch,
  FiTrash2,
  FiStar,
  FiTag,
  FiEdit2,
} from 'react-icons/fi';
import api from '../utils/api';
import { format } from 'date-fns';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [searchTerm, filterFavorite]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterFavorite) params.favorite = 'true';

      const response = await api.get('/notes', { params });
      setNotes(response.data.notes);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNote = async (note) => {
    try {
      const response = await api.get(`/notes/${note._id}`);
      setSelectedNote(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
      setTags(response.data.tags || []);
    } catch (error) {
      toast.error('Failed to load note');
    }
  };

  const handleCreateNote = async () => {
    try {
      const response = await api.post('/notes', {
        title: 'Untitled',
        content: '',
        tags: [],
      });
      setSelectedNote(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
      setTags(response.data.tags || []);
      fetchNotes();
      toast.success('New note created');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleSaveNote = async () => {
    if (!selectedNote) return;

    setSaving(true);
    try {
      await api.put(`/notes/${selectedNote._id}`, {
        title,
        content,
        tags,
      });
      toast.success('Note saved successfully');
      fetchNotes();
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success('Note deleted successfully');

      if (selectedNote && selectedNote._id === id) {
        setSelectedNote(null);
        setTitle('');
        setContent('');
        setTags([]);
      }

      fetchNotes();
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleToggleFavorite = async (note) => {
    try {
      await api.patch(`/notes/${note._id}/favorite`);
      fetchNotes();

      if (selectedNote && selectedNote._id === note._id) {
        setSelectedNote({ ...selectedNote, favorite: !selectedNote.favorite });
      }
    } catch (error) {
      toast.error('Failed to toggle favorite');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and organize your notes
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              onClick={() => setFilterFavorite(!filterFavorite)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors w-full ${
                filterFavorite
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FiStar className="w-4 h-4" />
              <span className="text-sm">Favorites Only</span>
            </button>
          </div>

          {/* Notes List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              </div>
            ) : notes.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">No notes found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedNote && selectedNote._id === note._id
                        ? 'bg-primary-50 dark:bg-primary-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                        {note.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(note);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <FiStar
                            className={`w-4 h-4 ${
                              note.favorite
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-400'
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note._id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {note.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 2 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            +{note.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {format(new Date(note.updatedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white mb-4"
                  placeholder="Note title..."
                />

                {/* Tags */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                      >
                        <FiTag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  theme="snow"
                  className="h-96"
                  placeholder="Start writing..."
                />
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 mt-16">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleFavorite(selectedNote)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedNote.favorite
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <FiStar
                        className={`w-4 h-4 ${
                          selectedNote.favorite ? 'fill-current' : ''
                        }`}
                      />
                      {selectedNote.favorite ? 'Unfavorite' : 'Favorite'}
                    </button>
                  </div>

                  <button
                    onClick={handleSaveNote}
                    disabled={saving}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Note'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-12 text-center">
              <FiEdit2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No note selected
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Select a note from the list or create a new one
              </p>
              <button
                onClick={handleCreateNote}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                New Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;

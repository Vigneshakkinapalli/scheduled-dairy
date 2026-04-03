const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// @route   GET /api/notes
// @desc    Get all notes with filtering and pagination
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, favorite, tag } = req.query;
    
    let query = { user: req.user._id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (favorite === 'true') {
      query.favorite = true;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('title tags favorite createdAt updatedAt');
    
    const count = await Note.countDocuments(query);
    
    res.json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/notes/tags
// @desc    Get all unique tags
// @access  Private
router.get('/tags', protect, async (req, res) => {
  try {
    const tags = await Note.distinct('tags', { user: req.user._id });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a single note
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    const note = await Note.create({
      user: req.user._id,
      title: title || 'Untitled',
      content: content || '',
      tags: tags || [],
    });
    
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { title, content, tags, favorite } = req.body;
    
    note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        tags,
        favorite,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/notes/:id/favorite
// @desc    Toggle favorite status
// @access  Private
router.patch('/:id/favorite', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    note.favorite = !note.favorite;
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Note.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

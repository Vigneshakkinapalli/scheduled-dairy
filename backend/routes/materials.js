const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// @route   GET /api/materials
// @desc    Get all materials with filtering and pagination
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, subject, category, semester, search } = req.query;
    
    let query = { user: req.user._id };
    
    if (subject) {
      query.subject = subject;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (semester) {
      query.semester = semester;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const materials = await Material.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const count = await Material.countDocuments(query);
    
    res.json({
      materials,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/materials/subjects
// @desc    Get all unique subjects
// @access  Private
router.get('/subjects', protect, async (req, res) => {
  try {
    const subjects = await Material.distinct('subject', { user: req.user._id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/materials/:id
// @desc    Get a single material
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if material belongs to user
    if (material.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/materials
// @desc    Upload a new material
// @access  Private
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }
    
    const { title, subject, description, semester, category } = req.body;
    
    if (!title || !subject) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Please provide title and subject' });
    }
    
    const material = await Material.create({
      user: req.user._id,
      title,
      subject,
      description,
      semester,
      category: category || 'other',
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
    });
    
    res.status(201).json(material);
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/materials/:id
// @desc    Update material metadata
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if material belongs to user
    if (material.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { title, subject, description, semester, category } = req.body;
    
    material = await Material.findByIdAndUpdate(
      req.params.id,
      { title, subject, description, semester, category },
      { new: true, runValidators: true }
    );
    
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/materials/:id
// @desc    Delete a material
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if material belongs to user
    if (material.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Delete the file
    if (fs.existsSync(material.filePath)) {
      fs.unlinkSync(material.filePath);
    }
    
    await Material.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/materials/:id/download
// @desc    Download a material file
// @access  Private
router.get('/:id/download', protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    
    // Check if material belongs to user
    if (material.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    if (!fs.existsSync(material.filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    res.download(material.filePath, material.fileName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

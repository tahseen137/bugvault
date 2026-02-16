const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Bug = require('../models/Bug');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Initialize DOMPurify for server-side sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Sanitization helper
const sanitize = (value) => {
  if (typeof value !== 'string') return value;
  return DOMPurify.sanitize(value, { 
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [] 
  });
};

// Validation rules with XSS protection
const bugValidation = [
  body('title')
    .notEmpty()
    .trim()
    .customSanitizer(sanitize)
    .withMessage('Title is required'),
  body('error')
    .optional()
    .trim()
    .customSanitizer(sanitize),
  body('context')
    .optional()
    .trim()
    .customSanitizer(sanitize),
  body('solution')
    .optional()
    .trim()
    .customSanitizer(sanitize),
  body('project')
    .optional()
    .trim()
    .customSanitizer(sanitize),
  body('tags')
    .optional()
    .isArray()
    .customSanitizer(tags => 
      Array.isArray(tags) ? tags.map(t => sanitize(t)) : tags
    ),
  body('pinned').optional().isBoolean()
];

// GET /api/bugs - List all bugs with filtering, search, pagination, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      search,
      project,
      tags,
      dateFrom,
      dateTo,
      limit = 100,
      offset = 0,
      sort = 'newest'
    } = req.query;

    // Build query
    let query = {};

    // Search across title, error, and solution
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by project
    if (project) {
      query.project = project;
    }

    // Filter by tags (supports multiple tags)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'oldest':
        sortOptions = { pinned: -1, createdAt: 1 };
        break;
      case 'title':
        sortOptions = { pinned: -1, title: 1 };
        break;
      case 'newest':
      default:
        sortOptions = { pinned: -1, createdAt: -1 };
    }

    const bugs = await Bug.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Bug.countDocuments(query);

    res.json({
      bugs,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching bugs:', error);
    res.status(500).json({ error: 'Failed to fetch bugs' });
  }
});

// GET /api/bugs/:id - Get single bug
router.get('/:id', async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    res.json(bug);
  } catch (error) {
    console.error('Error fetching bug:', error);
    res.status(500).json({ error: 'Failed to fetch bug' });
  }
});

// POST /api/bugs - Create new bug
router.post('/', bugValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bug = new Bug(req.body);
    await bug.save();
    res.status(201).json(bug);
  } catch (error) {
    console.error('Error creating bug:', error);
    res.status(500).json({ error: 'Failed to create bug' });
  }
});

// PUT /api/bugs/:id - Update bug
router.put('/:id', bugValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bug = await Bug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }

    res.json(bug);
  } catch (error) {
    console.error('Error updating bug:', error);
    res.status(500).json({ error: 'Failed to update bug' });
  }
});

// DELETE /api/bugs/:id - Delete bug
router.delete('/:id', async (req, res) => {
  try {
    const bug = await Bug.findByIdAndDelete(req.params.id);
    if (!bug) {
      return res.status(404).json({ error: 'Bug not found' });
    }
    res.json({ message: 'Bug deleted successfully', bug });
  } catch (error) {
    console.error('Error deleting bug:', error);
    res.status(500).json({ error: 'Failed to delete bug' });
  }
});

// POST /api/bugs/bulk-delete - Bulk delete bugs
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty ids array' });
    }

    const result = await Bug.deleteMany({ _id: { $in: ids } });
    res.json({
      message: `${result.deletedCount} bugs deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting bugs:', error);
    res.status(500).json({ error: 'Failed to delete bugs' });
  }
});

// GET /api/projects - Get list of unique projects
router.get('/meta/projects', async (req, res) => {
  try {
    const projects = await Bug.distinct('project');
    res.json(projects.filter(p => p)); // Filter out empty strings
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/tags - Get list of unique tags
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await Bug.distinct('tags');
    res.json(tags.filter(t => t)); // Filter out empty strings
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// POST /api/bugs/import - Import bugs from JSON
router.post('/import', async (req, res) => {
  try {
    const { bugs } = req.body;
    
    if (!Array.isArray(bugs)) {
      return res.status(400).json({ error: 'Invalid format: expected bugs array' });
    }

    // Insert bugs (skip duplicates if they exist)
    const results = await Bug.insertMany(bugs, { ordered: false, rawResult: true });
    
    res.json({
      message: 'Import successful',
      imported: results.insertedCount || bugs.length
    });
  } catch (error) {
    // Handle duplicate key errors gracefully
    if (error.code === 11000) {
      const inserted = error.result?.nInserted || 0;
      return res.json({
        message: 'Import completed with some duplicates skipped',
        imported: inserted
      });
    }
    console.error('Error importing bugs:', error);
    res.status(500).json({ error: 'Failed to import bugs' });
  }
});

// GET /api/bugs/export - Export all bugs as JSON
router.get('/export/all', async (req, res) => {
  try {
    const bugs = await Bug.find().sort({ createdAt: -1 });
    res.json({
      bugs,
      exportedAt: new Date().toISOString(),
      version: '2.0',
      total: bugs.length
    });
  } catch (error) {
    console.error('Error exporting bugs:', error);
    res.status(500).json({ error: 'Failed to export bugs' });
  }
});

module.exports = router;

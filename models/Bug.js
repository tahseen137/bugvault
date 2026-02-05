const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  error: {
    type: String,
    default: ''
  },
  context: {
    type: String,
    default: ''
  },
  solution: {
    type: String,
    default: ''
  },
  project: {
    type: String,
    default: '',
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  pinned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for better query performance
bugSchema.index({ title: 'text', error: 'text', solution: 'text' });
bugSchema.index({ project: 1 });
bugSchema.index({ tags: 1 });
bugSchema.index({ pinned: -1, createdAt: -1 });

module.exports = mongoose.model('Bug', bugSchema);

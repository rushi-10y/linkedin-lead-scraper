const mongoose = require('mongoose');

const ScrapingConfigSchema = new mongoose.Schema({
  keywords: [{
    type: String,
    required: true
  }],
  locations: [{
    type: String,
    required: true
  }],
  maxResults: {
    type: Number,
    default: 100,
    min: 10,
    max: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastRun: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScrapingConfig', ScrapingConfigSchema);

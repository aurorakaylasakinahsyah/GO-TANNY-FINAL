const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  percentage: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed'], 
    default: 'Not Started' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);

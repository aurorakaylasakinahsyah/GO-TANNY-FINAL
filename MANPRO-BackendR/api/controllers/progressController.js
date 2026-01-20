const Progress = require('../models/progress');

// Get all progress items
exports.getAllProgress = async (req, res) => {
  try {
    const progressList = await Progress.find().sort({ createdAt: -1 });
    res.json(progressList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new progress item
exports.createProgress = async (req, res) => {
  const { title, description, percentage, status } = req.body;
  
  const progress = new Progress({
    title,
    description,
    percentage,
    status
  });

  try {
    const newProgress = await progress.save();
    res.status(201).json(newProgress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update progress item
exports.updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    if (req.body.title != null) progress.title = req.body.title;
    if (req.body.description != null) progress.description = req.body.description;
    if (req.body.percentage != null) progress.percentage = req.body.percentage;
    if (req.body.status != null) progress.status = req.body.status;

    const updatedProgress = await progress.save();
    res.json(updatedProgress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete progress item
exports.deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    await progress.deleteOne();
    res.json({ message: 'Progress deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

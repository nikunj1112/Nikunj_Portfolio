const Stats = require('../models/Stats');


// @desc    Get all stats
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const stats = await Stats.find().sort({ order: 1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stat
// @route   GET /api/stats/:id
// @access  Private/Admin
const getStat = async (req, res) => {
  try {
    const stat = await Stats.findById(req.params.id);
    
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    
    res.json(stat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new stat
// @route   POST /api/stats
// @access  Private/Admin
const createStat = async (req, res) => {
  try {
    const { label, value, order } = req.body;

    if (!label || !value) {
      return res.status(400).json({ message: 'Label and value are required' });
    }

    const stat = await Stats.create({
      label,
      value,
      order: order || 0
    });

    res.status(201).json(stat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update stat
// @route   PUT /api/stats/:id
// @access  Private/Admin
const updateStat = async (req, res) => {
  try {
    const stat = await Stats.findById(req.params.id);
    
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }

    const { label, value, order } = req.body;
    
    stat.label = label || stat.label;
    stat.value = value || stat.value;
    stat.order = order !== undefined ? order : stat.order;

    const updatedStat = await stat.save();
    res.json(updatedStat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete stat
// @route   DELETE /api/stats/:id
// @access  Private/Admin
const deleteStat = async (req, res) => {
  try {
    const stat = await Stats.findByIdAndDelete(req.params.id);
    
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }

    res.json({ message: 'Stat deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
  getStat,
  createStat,
  updateStat,
  deleteStat
};


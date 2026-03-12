const express = require('express');
const router = express.Router();
const { getStats, getStat, createStat, updateStat, deleteStat } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getStats);
router.get('/:id', protect, getStat);
router.post('/', protect, createStat);
router.put('/:id', protect, updateStat);
router.delete('/:id', protect, deleteStat);

module.exports = router;

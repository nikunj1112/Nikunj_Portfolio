const express = require('express');
const router = express.Router();
const { getMessages, createMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMessages);
router.post('/', createMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;


const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfileImage, uploadResume } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');

router.get('/', getProfile);
router.put('/', protect, updateProfile);
router.post('/image', protect, upload.single('profileImage'), uploadProfileImage);
router.post('/resume', protect, upload.single('resume'), uploadResume);

module.exports = router;


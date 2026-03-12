const express = require('express');
const router = express.Router();
const { getGitHubStats, getGitHubRepos } = require('../controllers/githubController');

router.get('/stats', getGitHubStats);
router.get('/repos', getGitHubRepos);

module.exports = router;


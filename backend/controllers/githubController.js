const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const GITHUB_USERNAME = 'nikunj1112';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;

const getCommonHeaders = () => ({
  'User-Agent': 'Nikunj-Portfolio-App/1.0',
  ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
});

const getGitHubStats = async (req, res) => {
  try {
    const fallbackStats = {
      public_repos: 0,
      followers: 0,
      following: 0,
      topLanguages: []
    };

    const response = await axios.get(GITHUB_API_URL, {
      headers: getCommonHeaders()
    });

    const userData = response.data || fallbackStats;

    const reposResponse = await axios.get(`${GITHUB_API_URL}/repos?sort=updated&per_page=100`, {
      headers: getCommonHeaders()
    });

    const repos = reposResponse.data || [];

    const languageCounts = {};
    repos.forEach(repo => {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languageCounts)
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      public_repos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      topLanguages,
    });
  } catch (error) {
    console.error('GitHub API Error:', error.response?.status, error.response?.data?.message || error.message);
    res.status(200).json({
      public_repos: 0,
      followers: 0,
      following: 0,
      topLanguages: [],
      error: 'GitHub API temporarily unavailable'
    });
  }
};

const getGitHubRepos = async (req, res) => {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/repos?sort=updated&per_page=20`, {
      headers: getCommonHeaders()
    });

    const repos = (response.data || []).map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description',
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      updated_at: repo.updated_at,
    }));

    res.json(repos);
  } catch (error) {
    console.error('GitHub Repos Error:', error.response?.status, error.response?.data?.message || error.message);
    res.status(200).json([]);
  }
};

module.exports = { getGitHubStats, getGitHubRepos };

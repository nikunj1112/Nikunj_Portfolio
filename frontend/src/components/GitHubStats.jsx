import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { githubAPI } from '../services/api';

const GitHubStats = () => {
  const [stats, setStats] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGitHubData();
  }, []);

  const loadGitHubData = async () => {
    try {
      const [statsRes, reposRes] = await Promise.all([
        githubAPI.getStats(),
        githubAPI.getRepos(),
      ]);
      setStats(statsRes.data);
      setRepos(reposRes.data.slice(0, 8)); // Show top 8 repos
    } catch (err) {
      console.error('Failed to load GitHub data:', err);
    } finally {
      setLoading(false);
    }
  };

  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    React: '#61dafb',
    Node: '#68a063',
    MongoDB: '#47A248',
    default: '#858585',
  };

  return (
    <section id="github" className="section-padding relative bg-secondary-dark/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            GitHub <span className="gradient-text">Stats</span>
          </h2>
          <p className="text-light-gray/70 max-w-2xl mx-auto">
            My open source contributions and activity on GitHub
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="loader" />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="glass p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-accent mb-2">
                  {stats?.public_repos || 0}
                </div>
                <div className="text-light-gray/70">Repositories</div>
              </div>
              <div className="glass p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-accent mb-2">
                  {stats?.followers || 0}
                </div>
                <div className="text-light-gray/70">Followers</div>
              </div>
              <div className="glass p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-accent mb-2">
                  {stats?.following || 0}
                </div>
                <div className="text-light-gray/70">Following</div>
              </div>
              <div className="glass p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-accent mb-2">
                  ⭐
                </div>
                <div className="text-light-gray/70">GitHub Stars</div>
              </div>
            </motion.div>

            {/* Top Languages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-6">Top Languages</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats?.topLanguages?.map((lang, index) => (
                  <motion.div
                    key={lang.language}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-4 rounded-xl flex items-center gap-3"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        backgroundColor: languageColors[lang.language] || languageColors.default,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{lang.language}</div>
                      <div className="text-xs text-light-gray/70">{lang.count} repos</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Repositories */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-6">Recent Repositories</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {repos.map((repo, index) => (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="glass p-6 rounded-xl card-hover group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-lg group-hover:text-accent transition-colors">
                        {repo.name}
                      </h4>
                      <div className="flex items-center gap-1 text-light-gray/70">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {repo.stargazers_count}
                      </div>
                    </div>
                    <p className="text-light-gray/70 text-sm mb-4 line-clamp-2">
                      {repo.description || 'No description available'}
                    </p>
                    <div className="flex items-center gap-4">
                      {repo.language && (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: languageColors[repo.language] || languageColors.default,
                            }}
                          />
                          <span className="text-xs text-light-gray/70">{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-light-gray/70">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.013-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        {repo.forks_count}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div> */}

            {/* GitHub Profile Link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <a
                href="https://github.com/nikunj1112"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View GitHub Profile
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GitHubStats;


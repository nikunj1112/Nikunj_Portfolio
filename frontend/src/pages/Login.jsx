import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState('email'); // email, otp, reset
  const [forgotData, setForgotData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.identifier, formData.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handlers
  const handleForgotChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
    setForgotError('');
    setForgotSuccess('');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    try {
      await authAPI.forgotPassword(forgotData.email);
      setForgotStep('otp');
      setForgotSuccess('OTP sent to your email. Please check and enter the 6-digit code.');
    } catch (err) {
      const errorMessage = err.response?.data?.message;
      // Show user-friendly message for invalid email
      if (errorMessage === 'User not valid') {
        setForgotError('Email not registered. Please enter a valid email.');
      } else {
        setForgotError(errorMessage || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);

    try {
      await authAPI.verifyOTP(forgotData.email, forgotData.otp);
      setForgotStep('reset');
      setForgotSuccess('OTP verified successfully. Please enter your new password.');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    if (forgotData.newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters.');
      return;
    }

    setForgotLoading(true);

    try {
      await authAPI.resetPassword(forgotData.email, forgotData.otp, forgotData.newPassword);
      setForgotSuccess('Password reset successfully! Please login with your new password.');
      setTimeout(() => {
        setShowForgotModal(false);
        setForgotStep('email');
        setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
        setForgotSuccess('');
      }, 2000);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeModal = () => {
    setShowForgotModal(false);
    setForgotStep('email');
    setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    setForgotError('');
    setForgotSuccess('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-soft-blue/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="glass rounded-2xl p-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Admin Login
            </h1>
            <p className="text-light-gray/70">
              Manage your portfolio content
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium mb-2">
                Username or Email
              </label>
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter username or email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>

          {/* Forgot Password Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center"
          >
            <button
              onClick={() => setShowForgotModal(true)}
              className="text-light-gray/70 hover:text-accent transition-colors text-sm"
            >
              Forgot Password?
            </button>
          </motion.div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <a
              href="/"
              className="text-light-gray/70 hover:text-accent transition-colors text-sm"
            >
              ← Back to Portfolio
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold gradient-text">
                    {forgotStep === 'email' && 'Forgot Password'}
                    {forgotStep === 'otp' && 'Verify OTP'}
                    {forgotStep === 'reset' && 'Reset Password'}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-light-gray/70 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Success Message */}
                {forgotSuccess && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                    {forgotSuccess}
                  </div>
                )}

                {/* Error Message */}
                {forgotError && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {forgotError}
                  </div>
                )}

                {/* Email Step */}
                {forgotStep === 'email' && (
                  <form onSubmit={handleSendOTP} className="space-y-6">
                    <div>
                      <label htmlFor="forgotEmail" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="forgotEmail"
                        name="email"
                        value={forgotData.email}
                        onChange={handleForgotChange}
                        required
                        className="input-field"
                        placeholder="Enter your registered email"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={forgotLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? 'Sending OTP...' : 'Send OTP'}
                    </motion.button>
                  </form>
                )}

                {/* OTP Step */}
                {forgotStep === 'otp' && (
                  <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium mb-2">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        id="otp"
                        name="otp"
                        value={forgotData.otp}
                        onChange={handleForgotChange}
                        maxLength={6}
                        required
                        className="input-field text-center text-2xl tracking-[0.5em]"
                        placeholder="000000"
                      />
                      <p className="text-light-gray/60 text-sm mt-2">
                        OTP sent to {forgotData.email}
                      </p>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={forgotLoading || forgotData.otp.length !== 6}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? 'Verifying...' : 'Verify OTP'}
                    </motion.button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotStep('email');
                          setForgotError('');
                        }}
                        className="text-light-gray/70 hover:text-accent transition-colors text-sm"
                      >
                        ← Back to email
                      </button>
                    </div>
                  </form>
                )}

                {/* Reset Password Step */}
                {forgotStep === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={forgotData.newPassword}
                        onChange={handleForgotChange}
                        required
                        minLength={6}
                        className="input-field"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={forgotData.confirmPassword}
                        onChange={handleForgotChange}
                        required
                        minLength={6}
                        className="input-field"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <motion.button
                      type="submit"
                      disabled={forgotLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {forgotLoading ? 'Resetting...' : 'Reset Password'}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;


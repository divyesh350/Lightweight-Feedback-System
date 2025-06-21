import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Box, Modal, Typography, TextField, Button, IconButton, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function AuthModal({ open, onClose, initialRole = 'employee', initialMode = 'register' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [form, setForm] = useState({ name: '', email: '', password: '', remember: false });
  
  const { login, register, loading, error, clearError } = useAuthStore();
  const role = useAuthStore((s) => s.role);
  const navigate = useNavigate();

  // Update state when props change
  useEffect(() => {
    setIsLogin(initialMode === 'login');
    setSelectedRole(initialRole);
  }, [initialMode, initialRole]);

  // Clear error when modal opens/closes or switches modes
  useEffect(() => {
    if (open) {
      clearError();
    }
  }, [open, isLogin, clearError]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return false;
    }
    
    if (!isLogin && !form.name) {
      toast.error('Please enter your full name');
      return false;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isLogin) {
      const result = await login({ 
        username: form.email, 
        password: form.password 
      });
      
      if (result.success) {
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate(result.role === 'manager' ? '/dashboard/manager' : '/dashboard/employee');
          onClose();
        }, 1200);
      } else {
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } else {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: selectedRole
      });
      
      if (result.success) {
        toast.success(`Registration successful! You can now log in as ${selectedRole}.`);
        setIsLogin(true);
        setForm({ name: '', email: '', password: '', remember: false });
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    clearError();
    setForm({ name: '', email: '', password: '', remember: false });
  };

  const renderLoginForm = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-center mb-4">
        <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-2">
          Welcome Back
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Please log in to your account
        </Typography>
      </div>
      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        size="small"
        className="rounded-button"
        disabled={loading}
      />
      <Box className="relative">
        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          fullWidth
          size="small"
          className="rounded-button"
          disabled={loading}
        />
        <IconButton
          onClick={() => setShowPassword((v) => !v)}
          className="!absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          tabIndex={-1}
          disabled={loading}
        >
          <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
        </IconButton>
      </Box>
      <FormControlLabel
        control={<Checkbox name="remember" checked={form.remember} onChange={handleChange} color="primary" disabled={loading} />}
        label={<span className="text-sm text-gray-600">Remember me</span>}
        className="!mb-2"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className="rounded-button py-2 font-medium !whitespace-nowrap"
        sx={{ mt: 1 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {loading ? 'Logging in...' : 'Log in'}
      </Button>
      <div className="text-center text-sm text-gray-600">
        New to GrowWise?
        <button
          type="button"
          className="text-primary font-medium ml-1 hover:underline"
          onClick={handleModeSwitch}
          disabled={loading}
        >
          Register now
        </button>
      </div>
    </form>
  );

  const renderRegisterForm = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="text-center mb-4">
        <Typography variant="h6" className="text-xl font-semibold text-gray-800 mb-2">
          Join GrowWise
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          Create your account as a {selectedRole}
        </Typography>
      </div>
      <TextField
        label="Full Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        size="small"
        className="rounded-button"
        disabled={loading}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        size="small"
        className="rounded-button"
        disabled={loading}
      />
      <Box className="relative">
        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          fullWidth
          size="small"
          className="rounded-button"
          disabled={loading}
        />
        <IconButton
          onClick={() => setShowPassword((v) => !v)}
          className="!absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
          tabIndex={-1}
          disabled={loading}
        >
          <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
        </IconButton>
      </Box>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className="rounded-button py-2 font-medium !whitespace-nowrap"
        sx={{ mt: 1 }}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {loading ? 'Registering...' : `Register as ${selectedRole}`}
      </Button>
      <div className="text-center text-sm text-gray-600">
        Already have an account?
        <button
          type="button"
          className="text-primary font-medium ml-1 hover:underline"
          onClick={handleModeSwitch}
          disabled={loading}
        >
          Login now
        </button>
      </div>
    </form>
  );

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose} aria-labelledby="auth-modal-title" className="flex items-center justify-center">
          <Box component={motion.div}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md p-6 relative outline-none"
          >
            <IconButton onClick={onClose} className="!absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <i className="ri-close-line ri-lg"></i>
            </IconButton>
            
            {isLogin ? renderLoginForm() : renderRegisterForm()}
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
} 
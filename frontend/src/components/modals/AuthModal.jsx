import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Box, Modal, Typography, TextField, Button, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function AuthModal({ open, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', remember: false });
  const login = useAuthStore((s) => s.login);
  const role = useAuthStore((s) => s.role);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (isLogin) {
      const ok = await login({ email: form.email, password: form.password });
      if (ok) {
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate(role === 'Manager' ? '/dashboard/manager' : '/dashboard/employee');
        }, 1200);
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } else {
      toast.success('Registration successful! You can now log in.');
      setIsLogin(true);
    }
  };

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
            <div className="text-center mb-6">
              <Typography variant="h6" id="auth-modal-title" className="text-xl font-semibold text-gray-800">
                {isLogin ? 'Log in' : 'Register'} as <span className="text-primary">{role}</span>
              </Typography>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLogin && (
                <TextField
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  className="rounded-button"
                />
              )}
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                size="small"
                className="rounded-button"
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
                />
                <IconButton
                  onClick={() => setShowPassword((v) => !v)}
                  className="!absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  tabIndex={-1}
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </IconButton>
              </Box>
              {isLogin && (
                <FormControlLabel
                  control={<Checkbox name="remember" checked={form.remember} onChange={handleChange} color="primary" />}
                  label={<span className="text-sm text-gray-600">Remember me</span>}
                  className="!mb-2"
                />
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="rounded-button py-2 font-medium !whitespace-nowrap"
                sx={{ mt: 1 }}
              >
                {isLogin ? 'Log in' : 'Register'}
              </Button>
              <div className="text-center text-sm text-gray-600">
                {isLogin ? 'New to GrowWise?' : 'Already have an account?'}
                <button
                  type="button"
                  className="text-primary font-medium ml-1 hover:underline"
                  onClick={() => setIsLogin((v) => !v)}
                >
                  {isLogin ? 'Register now' : 'Log in'}
                </button>
              </div>
            </form>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
  );
} 
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Card, CardActionArea, Typography, Box } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';
import AuthModal from '../components/modals/AuthModal';

const bgGradient = 'bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100';

const roles = [
  {
    key: 'Manager',
    icon: 'ri-user-star-line',
    title: "I'm a Manager",
    desc: 'Access team insights and provide feedback',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    key: 'Employee',
    icon: 'ri-user-line',
    title: "I'm an Employee",
    desc: 'Receive feedback and track your progress',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
];

export default function AuthLandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const setRole = useAuthStore((s) => s.setRole);
  const role = useAuthStore((s) => s.role);

  const handleCardClick = (role) => {
    setRole(role);
    setModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${bgGradient} relative`}>
      <Toaster position="top-right" />
      {/* Logo & Brand */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center mb-8 mt-4"
      >
        <span className="text-4xl font-['Pacifico'] text-primary mr-2">GrowWise</span>
      </motion.div>
      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center mb-10"
      >
        <Typography variant="h4" className="font-semibold text-slate-800 mb-2">Welcome to GrowWise</Typography>
        <Typography variant="subtitle1" className="text-slate-600">Nurture Growth Through Feedback</Typography>
      </motion.div>
      {/* Role Cards */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 justify-center w-full max-w-2xl">
        {roles.map((r, i) => (
          <motion.div
            key={r.key}
            initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
            whileHover={{ scale: 1.05, rotate: i === 0 ? -2 : 2 }}
            className="w-full md:w-1/2"
          >
            <CardActionArea onClick={() => handleCardClick(r.key)}>
              <Card className={`rounded-2xl shadow-xl bg-white/70 p-8 flex flex-col items-center transition-all duration-200 cursor-pointer hover:shadow-2xl ${r.bg}`}
                elevation={0}
              >
                <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${r.bg}`}>
                  <i className={`${r.icon} ${r.color} text-4xl`}></i>
                </div>
                <Typography variant="h6" className="font-semibold text-slate-800 mb-1">{r.title}</Typography>
                <Typography variant="body2" className="text-slate-600 text-center">{r.desc}</Typography>
              </Card>
            </CardActionArea>
          </motion.div>
        ))}
      </div>
      {/* Auth Modal */}
      <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="text-center mt-4"
      >
        <Typography variant="body2" className="text-slate-600">
          {role === null || role === undefined ? (
            <>
              Already have an account?{' '}
              <button className="text-primary font-medium ml-1 hover:underline" onClick={() => { setRole('Manager'); setModalOpen(true); }}>Log in</button>
            </>
          ) : (
            <>
              New here?{' '}
              <button className="text-primary font-medium ml-1 hover:underline" onClick={() => setModalOpen(true)}>Register now</button>
            </>
          )}
        </Typography>
      </motion.div>
    </div>
  );
} 
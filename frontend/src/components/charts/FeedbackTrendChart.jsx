import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = {
  Positive: '#57b5e7',
  Neutral: '#8dd3c7',
  Negative: '#fc8d62',
};

export default function FeedbackTrendChart({ data }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#e5e7eb" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis stroke="#e5e7eb" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Positive" stroke={COLORS.Positive} strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="Neutral" stroke={COLORS.Neutral} strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="Negative" stroke={COLORS.Negative} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
} 
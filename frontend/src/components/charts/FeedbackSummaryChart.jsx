import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = {
  Design: '#57b5e7',
  Communication: '#8dd3c7',
  Collaboration: '#fbbf72',
};

export default function FeedbackSummaryChart({ data }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" stroke="#e5e7eb" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis stroke="#e5e7eb" tick={{ fill: '#6b7280', fontSize: 11 }} domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="Design" stroke={COLORS.Design} fillOpacity={0.2} fill={COLORS.Design} />
            <Area type="monotone" dataKey="Communication" stroke={COLORS.Communication} fillOpacity={0.2} fill={COLORS.Communication} />
            <Area type="monotone" dataKey="Collaboration" stroke={COLORS.Collaboration} fillOpacity={0.2} fill={COLORS.Collaboration} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
} 
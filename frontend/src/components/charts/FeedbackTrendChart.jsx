import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = {
  Positive: '#57b5e7',
  Neutral: '#8dd3c7',
  Negative: '#fbbf24', // yellow-400 for a soft yellow
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg px-4 py-3 text-sm text-gray-900 border border-gray-100">
        <div className="font-semibold mb-1">{label}</div>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-0.5">
            <span style={{ background: entry.color, borderRadius: '50%', width: 10, height: 10, display: 'inline-block' }}></span>
            <span className="text-gray-700">{entry.name}</span>
            <span className="font-bold ml-1">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div className="flex gap-4 text-sm font-medium mt-2">
    {payload.map((entry, i) => (
      <div key={i} className="flex items-center gap-2">
        <span style={{ background: entry.color, borderRadius: '50%', width: 10, height: 10, display: 'inline-block' }}></span>
        <span className="text-gray-700">{entry.value}</span>
      </div>
    ))}
  </div>
);

export default function FeedbackTrendChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Feedback Trends</h2>
          <select className="text-sm border-none bg-gray-100 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 pr-8 cursor-pointer">
            <option>Last 30 days</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              onMouseMove={state => setActiveIndex(state && state.activeTooltipIndex)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#e5e7eb" tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#e5e7eb" tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} axisLine={false} tickLine={false} />
              {/* Vertical dashed line on hover */}
              {activeIndex !== null && (
                <ReferenceLine x={data[activeIndex]?.name} stroke="#a3a3a3" strokeDasharray="4 4" />
              )}
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend content={<CustomLegend />} verticalAlign="top" align="left" iconType="circle" />
              <Line
                type="monotone"
                dataKey="Positive"
                stroke={COLORS.Positive}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                fillOpacity={0.1}
              />
              <Line
                type="monotone"
                dataKey="Neutral"
                stroke={COLORS.Neutral}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                fillOpacity={0.1}
              />
              <Line
                type="monotone"
                dataKey="Negative"
                stroke={COLORS.Negative}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                fillOpacity={0.1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
} 
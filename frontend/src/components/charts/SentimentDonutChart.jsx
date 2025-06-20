import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { motion } from 'framer-motion';

const COLORS = [
  'rgba(87, 181, 231, 1)',    // Positive
  'rgba(141, 211, 199, 1)',  // Neutral
  'rgba(252, 141, 98, 1)',   // Negative
];

const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill,
  } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8} // pop out effect
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={8}
        stroke="#fff"
        strokeWidth={2}
      />
    </g>
  );
};

const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex flex-col space-y-2 text-sm font-semibold text-gray-800 ml-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span style={{ background: entry.color, borderRadius: 4, width: 12, height: 12, display: 'inline-block' }}></span>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-gray-900 text-xs">
        <span className="font-semibold">{payload[0].name}:</span> {payload[0].value}
      </div>
    );
  }
  return null;
};

export default function SentimentDonutChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="h-64 w-full flex items-center justify-center bg-white rounded-lg shadow-sm p-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={105}
              paddingAngle={2}
              label={false}
              isAnimationActive={true}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Legend content={<CustomLegend />} layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

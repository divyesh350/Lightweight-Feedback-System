import React from 'react';
import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, change, color = 'primary', trend = 'up' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="shadow-sm border border-gray-100 rounded-lg">
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="text-gray-500 text-sm">{label}</div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${color}-100 text-${color}-500`}>
              <i className={`${icon}`}></i>
            </div>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <div className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                <i className={`ri-arrow-${trend}-line`}></i>
                {change}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 
import React from 'react';
import { Button } from '@mui/material';

export default function DashboardHeader({
  title = '',
  date = '',
  onExport = () => {},
  onNewFeedback = () => {},
  onRefresh = () => {},
  onTeamManagement = () => {},
  loading = false,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{date}</p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        {onTeamManagement && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={onTeamManagement}
            startIcon={<i className="ri-team-line"></i>}
          >
            Manage Team
          </Button>
        )}
        {onRefresh && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={onRefresh}
            disabled={loading}
            startIcon={loading ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-refresh-line"></i>}
          >
            Refresh
          </Button>
        )}
        {onExport && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={onExport}
            startIcon={<i className="ri-download-line"></i>}
          >
            Export
          </Button>
        )}
        {onNewFeedback && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={onNewFeedback}
            startIcon={<i className="ri-add-line"></i>}
          >
            New Feedback
          </Button>
        )}
      </div>
    </div>
  );
} 
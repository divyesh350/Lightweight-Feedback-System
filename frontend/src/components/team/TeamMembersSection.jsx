import React from 'react';
import TeamMemberCard from './TeamMemberCard';

const TeamMembersSection = ({ teamMembers, loading, onViewAll }) => {
  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!teamMembers || !Array.isArray(teamMembers) || teamMembers.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Team Members</h2>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <i className="ri-team-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No team members found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Team Members</h2>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <span>View All</span>
            <i className="ri-arrow-right-line"></i>
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.slice(0, 6).map((member, i) => (
          <TeamMemberCard 
            key={member.id || i} 
            {...member}
            name={member.name}
            role={member.role || 'Employee'}
            sentiment={member.sentiment || 'neutral'}
            sentimentLabel={member.sentiment_label || 'Neutral'}
            sentimentValue={member.sentiment_value || '75%'}
            reviews={member.feedback_count || 0}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamMembersSection; 
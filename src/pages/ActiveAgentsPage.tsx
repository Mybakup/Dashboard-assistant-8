import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActiveAgents } from '../components/ActiveAgents';
import { AgentStatistics } from '../components/AgentStatistics';

export function ActiveAgentsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Agents Actifs</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ActiveAgents />
        </div>
        <div className="lg:col-span-2">
          <AgentStatistics />
        </div>
      </div>
    </div>
  );
}
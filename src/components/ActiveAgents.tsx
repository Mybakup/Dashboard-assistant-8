import React, { useState } from 'react';
import { User, Phone, MapPin, Activity, CheckCircle, Calendar } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  photo: string;
  status: 'available' | 'busy' | 'offline';
  role: string;
  location: string;
  phone: string;
  activeRequests: number;
  completedToday: number;
  lastActive: string;
  history: {
    date: string;
    activeRequests: number;
    completedRequests: number;
    status: 'available' | 'busy' | 'offline';
  }[];
}

const generateAgentHistory = (days: number) => {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return {
      date: date.toISOString(),
      activeRequests: Math.floor(Math.random() * 5) + 1,
      completedRequests: Math.floor(Math.random() * 8) + 2,
      status: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'offline'
    };
  }).reverse();
};

const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Sophie Martin',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300',
    status: 'available',
    role: 'Assistant médical',
    location: 'Paris, 75001',
    phone: '+33 6 12 34 56 78',
    activeRequests: 2,
    completedToday: 5,
    lastActive: new Date().toISOString(),
    history: generateAgentHistory(30)
  },
  {
    id: '2',
    name: 'Jean Dupont',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300',
    status: 'busy',
    role: 'Assistant médical senior',
    location: 'Lyon, 69001',
    phone: '+33 6 23 45 67 89',
    activeRequests: 4,
    completedToday: 7,
    lastActive: new Date().toISOString(),
    history: generateAgentHistory(30)
  },
  {
    id: '3',
    name: 'Marie Bernard',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300&h=300',
    status: 'offline',
    role: 'Assistant médical',
    location: 'Marseille, 13001',
    phone: '+33 6 34 56 78 90',
    activeRequests: 0,
    completedToday: 3,
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    history: generateAgentHistory(30)
  }
];

export function ActiveAgents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'Occupé';
      case 'offline':
        return 'Hors ligne';
    }
  };

  const formatLastActive = (date: string) => {
    const now = new Date();
    const lastActive = new Date(date);
    const diff = now.getTime() - lastActive.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    
    return lastActive.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAgentDataForDate = (agent: Agent, date: string) => {
    if (!date) {
      return {
        activeRequests: agent.activeRequests,
        completedRequests: agent.completedToday,
        status: agent.status
      };
    }

    const historyEntry = agent.history.find(
      h => new Date(h.date).toISOString().split('T')[0] === date
    );

    return historyEntry || {
      activeRequests: 0,
      completedRequests: 0,
      status: 'offline' as const
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Agents actifs</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {MOCK_AGENTS.map(agent => {
          const dateData = getAgentDataForDate(agent, selectedDate);
          
          return (
            <div
              key={agent.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedAgent === agent.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedAgent(agent.id === selectedAgent ? null : agent.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(dateData.status)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{agent.name}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        dateData.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : dateData.status === 'busy'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getStatusText(dateData.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{agent.role}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Activity className="h-4 w-4 mr-1" />
                      <span>{dateData.activeRequests} demandes actives</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>{dateData.completedRequests} complétées</span>
                    </div>
                  </div>
                  {selectedAgent === agent.id && (
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{agent.location}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{agent.phone}</span>
                      </div>
                      {!selectedDate && (
                        <div className="flex items-center text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          <span>Dernière activité: {formatLastActive(agent.lastActive)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
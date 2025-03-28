import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Users, 
  Search, 
  Filter,
  Phone,
  MapPin,
  Calendar,
  User,
  PlusCircle,
  FileText,
  CalendarDays
} from 'lucide-react';
import { ActiveAgents } from '../components/ActiveAgents';
import type { MedicalRequest, RequestStatus, UrgencyLevel } from '../types';

const MOCK_REQUESTS: MedicalRequest[] = [
  {
    id: 'MED-2024-001',
    patientName: 'Marie Dubois',
    patientPhone: '+33612345678',
    status: 'new',
    urgencyLevel: 'critical',
    symptoms: 'Severe chest pain and difficulty breathing',
    location: 'Paris, 75001',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    workflowStage: 'appointment_request',
    assignedTo: '1',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-002',
    patientName: 'Jean Martin',
    patientPhone: '+33623456789',
    status: 'in_progress',
    urgencyLevel: 'medium',
    symptoms: 'Persistent fever and cough',
    location: 'Lyon, 69001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    workflowStage: 'appointment_request',
    assignedTo: '1',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-003',
    patientName: 'Sophie Bernard',
    patientPhone: '+33634567890',
    status: 'completed',
    urgencyLevel: 'low',
    symptoms: 'Regular check-up and prescription renewal',
    location: 'Marseille, 13001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    workflowStage: 'closed',
    assignedTo: '2',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-004',
    patientName: 'Lucas Petit',
    patientPhone: '+33645678901',
    status: 'in_progress',
    urgencyLevel: 'high',
    symptoms: 'Severe allergic reaction, facial swelling',
    location: 'Bordeaux, 33000',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    workflowStage: 'initial_contact',
    assignedTo: '3',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-005',
    patientName: 'Emma Leroy',
    patientPhone: '+33656789012',
    status: 'cancelled',
    urgencyLevel: 'medium',
    symptoms: 'Migraine and nausea',
    location: 'Toulouse, 31000',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    workflowStage: 'closed',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-006',
    patientName: 'Thomas Roux',
    patientPhone: '+33667890123',
    status: 'new',
    urgencyLevel: 'high',
    symptoms: 'Sudden loss of vision in right eye',
    location: 'Nice, 06000',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    workflowStage: 'initial_contact',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-007',
    patientName: 'Clara Moreau',
    patientPhone: '+33678901234',
    status: 'in_progress',
    urgencyLevel: 'medium',
    symptoms: 'Lower back pain and difficulty walking',
    location: 'Lille, 59000',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    workflowStage: 'appointment_scheduled',
    assignedTo: '4',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-008',
    patientName: 'Hugo Simon',
    patientPhone: '+33689012345',
    status: 'completed',
    urgencyLevel: 'low',
    symptoms: 'Follow-up consultation for diabetes',
    location: 'Nantes, 44000',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    workflowStage: 'closed',
    assignedTo: '1',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-009',
    patientName: 'Léa Girard',
    patientPhone: '+33690123456',
    status: 'in_progress',
    urgencyLevel: 'critical',
    symptoms: 'Suspected stroke, facial drooping and speech difficulty',
    location: 'Strasbourg, 67000',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    workflowStage: 'initial_contact',
    assignedTo: '2',
    notes: [],
    actions: []
  },
  {
    id: 'MED-2024-010',
    patientName: 'Antoine Dupont',
    patientPhone: '+33701234567',
    status: 'new',
    urgencyLevel: 'medium',
    symptoms: 'Persistent cough and fever for 3 days',
    location: 'Rennes, 35000',
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    workflowStage: 'initial_contact',
    notes: [],
    actions: []
  }
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showActiveAgents, setShowActiveAgents] = useState(false);

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const stats = {
    newRequests: MOCK_REQUESTS.filter(r => r.status === 'new').length,
    inProgress: MOCK_REQUESTS.filter(r => r.status === 'in_progress').length,
    completed: MOCK_REQUESTS.filter(r => r.status === 'completed').length,
    totalAgents: user?.role === 'manager' ? 15 : undefined,
  };

  const filteredRequests = MOCK_REQUESTS.filter(request => {
    if (statusFilter !== 'all' && request.status !== statusFilter) return false;
    if (urgencyFilter !== 'all' && request.urgencyLevel !== urgencyFilter) return false;
    if (searchTerm && !request.patientName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (dateFilter) {
      const requestDate = new Date(request.createdAt).toISOString().split('T')[0];
      if (requestDate !== dateFilter) return false;
    }
    return true;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  const getUrgencyColor = (level: UrgencyLevel) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[level];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center text-gray-600">
            <CalendarDays className="h-5 w-5 mr-2" />
            <span className="capitalize">{currentDate}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Welcome back, {user?.firstName}
          </div>
          <button
            onClick={() => navigate('/new-request')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nouveau Dossier
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">New Requests</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.newRequests}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.inProgress}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Completed</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.completed}</span>
          </div>
        </div>

        {user?.role === 'manager' && (
          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/active-agents')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Active Agents</h3>
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalAgents}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${user?.role === 'manager' && showActiveAgents ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Medical Requests</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search requests..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2"
                    value={urgencyFilter}
                    onChange={(e) => setUrgencyFilter(e.target.value as UrgencyLevel | 'all')}
                  >
                    <option value="all">All Urgency</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No medical requests match your filters.</p>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <FileText className="h-4 w-4" />
                            <span className="font-mono">{request.id}</span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <h3 className="text-lg font-medium text-gray-900">{request.patientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgencyLevel)}`}>
                            {request.urgencyLevel.charAt(0).toUpperCase() + request.urgencyLevel.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-600">{request.symptoms}</p>
                        <div className="flex space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {request.patientPhone}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {request.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatTime(request.createdAt)}
                          </span>
                          {request.assignedTo && (
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              Assigned to {request.assignedTo}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/request/${request.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {user?.role === 'manager' && showActiveAgents && (
          <div className="lg:col-span-1">
            <ActiveAgents />
          </div>
        )}
      </div>
    </div>
  );
}
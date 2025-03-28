import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar,
  Search,
  Filter,
  FileText,
  Clock,
  MapPin,
  Phone,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Download,
  Video
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Appointment {
  id: string;
  requestId: string;
  patientName: string;
  doctorName: string;
  location: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'in_person' | 'teleconsultation';
  reportStatus: 'pending' | 'available' | 'not_required';
  patientPhone: string;
  symptoms: string;
}

// Generate mock data for the last 7 days
const generateDailyData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      inPerson: {
        scheduled: Math.floor(Math.random() * 5) + 2,
        completed: Math.floor(Math.random() * 4) + 1,
        cancelled: Math.floor(Math.random() * 2)
      },
      teleconsultation: {
        scheduled: Math.floor(Math.random() * 4) + 1,
        completed: Math.floor(Math.random() * 3) + 1,
        cancelled: Math.floor(Math.random() * 2)
      }
    });
  }
  return data;
};

const DAILY_DATA = generateDailyData();

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-001',
    requestId: 'MED-2024-001',
    patientName: 'Marie Dubois',
    doctorName: 'Dr. Sarah Chen',
    location: 'Centre Médical Saint-Michel, Paris',
    date: '2024-02-25T10:30:00Z',
    status: 'scheduled',
    type: 'in_person',
    reportStatus: 'pending',
    patientPhone: '+33612345678',
    symptoms: 'Douleurs thoraciques'
  },
  {
    id: 'APT-002',
    requestId: 'MED-2024-002',
    patientName: 'Jean Martin',
    doctorName: 'Dr. Thomas Martin',
    location: 'Téléconsultation',
    date: '2024-02-24T14:15:00Z',
    status: 'completed',
    type: 'teleconsultation',
    reportStatus: 'available',
    patientPhone: '+33623456789',
    symptoms: 'Suivi diabète'
  },
  {
    id: 'APT-003',
    requestId: 'MED-2024-003',
    patientName: 'Sophie Bernard',
    doctorName: 'Dr. Marie Laurent',
    location: 'Hôpital Américain, Neuilly',
    date: '2024-02-23T09:00:00Z',
    status: 'cancelled',
    type: 'in_person',
    reportStatus: 'not_required',
    patientPhone: '+33634567890',
    symptoms: 'Consultation pré-opératoire'
  },
  {
    id: 'APT-004',
    requestId: 'MED-2024-004',
    patientName: 'Lucas Petit',
    doctorName: 'Dr. Emma Bernard',
    location: 'Cabinet Médical Montmartre',
    date: '2024-02-26T11:45:00Z',
    status: 'scheduled',
    type: 'in_person',
    reportStatus: 'pending',
    patientPhone: '+33645678901',
    symptoms: 'Allergie cutanée'
  },
  {
    id: 'APT-005',
    requestId: 'MED-2024-005',
    patientName: 'Emma Leroy',
    doctorName: 'Dr. Lucas Silva',
    location: 'Téléconsultation',
    date: '2024-02-25T16:30:00Z',
    status: 'scheduled',
    type: 'teleconsultation',
    reportStatus: 'pending',
    patientPhone: '+33656789012',
    symptoms: 'Renouvellement ordonnance'
  }
];

export function AppointmentsDetails() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [sortField, setSortField] = useState<keyof Appointment>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const chartData = {
    labels: DAILY_DATA.map(d => new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'En cabinet - Programmés',
        data: DAILY_DATA.map(d => d.inPerson.scheduled),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'En cabinet - Terminés',
        data: DAILY_DATA.map(d => d.inPerson.completed),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Téléconsultation - Programmés',
        data: DAILY_DATA.map(d => d.teleconsultation.scheduled),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Téléconsultation - Terminés',
        data: DAILY_DATA.map(d => d.teleconsultation.completed),
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des rendez-vous sur les 7 derniers jours'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre de rendez-vous'
        }
      }
    }
  };

  const filteredAppointments = MOCK_APPOINTMENTS
    .filter(appointment => {
      const matchesSearch = 
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.requestId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate = !dateFilter || 
        new Date(appointment.date).toISOString().split('T')[0] === dateFilter;

      const matchesStatus = statusFilter === 'all' || 
        appointment.status === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const handleSort = (field: keyof Appointment) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportCSV = () => {
    // Define CSV headers
    const headers = [
      'ID Rendez-vous',
      'ID Dossier',
      'Patient',
      'Téléphone',
      'Médecin',
      'Type',
      'Lieu',
      'Date',
      'Statut',
      'Rapport',
      'Symptômes'
    ];

    // Prepare data rows
    const rows = filteredAppointments.map(appointment => [
      appointment.id,
      appointment.requestId,
      appointment.patientName,
      appointment.patientPhone,
      appointment.doctorName,
      appointment.type === 'in_person' ? 'En cabinet' : 'Téléconsultation',
      appointment.location,
      new Date(appointment.date).toLocaleString('fr-FR'),
      appointment.status === 'scheduled' ? 'Programmé' :
        appointment.status === 'completed' ? 'Terminé' : 'Annulé',
      appointment.reportStatus === 'pending' ? 'En attente' :
        appointment.reportStatus === 'available' ? 'Disponible' : 'Non requis',
      appointment.symptoms
    ]);

    // Add summary row
    const totalScheduled = filteredAppointments.filter(a => a.status === 'scheduled').length;
    const totalCompleted = filteredAppointments.filter(a => a.status === 'completed').length;
    const totalCancelled = filteredAppointments.filter(a => a.status === 'cancelled').length;

    rows.push([
      'TOTAL',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      `Programmés: ${totalScheduled}, Terminés: ${totalCompleted}, Annulés: ${totalCancelled}`,
      '',
      ''
    ]);

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `rendez-vous_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getReportStatusColor = (status: Appointment['reportStatus']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      available: 'bg-green-100 text-green-800',
      not_required: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Rendez-vous</h1>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Download className="h-5 w-5 mr-2" />
          Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredAppointments.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En cabinet</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredAppointments.filter(a => a.type === 'in_person').length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Téléconsultations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredAppointments.filter(a => a.type === 'teleconsultation').length}
              </p>
            </div>
            <Video className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-[400px]">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Programmés</option>
              <option value="completed">Terminés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('requestId')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Dossier</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('patientName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Patient</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('doctorName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Médecin</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rapport
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{appointment.requestId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{appointment.patientName}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{appointment.patientPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{appointment.doctorName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDateTime(appointment.date)}</div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {appointment.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.type === 'teleconsultation' 
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.type === 'teleconsultation' ? 'Téléconsultation' : 'En cabinet'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status === 'scheduled' ? 'Programmé' : 
                       appointment.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getReportStatusColor(appointment.reportStatus)}`}>
                      {appointment.reportStatus === 'pending' ? 'En attente' :
                       appointment.reportStatus === 'available' ? 'Disponible' : 'Non requis'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/request/${appointment.requestId}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
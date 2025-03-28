import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Map,
  Search,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Filter,
  Eye,
  ArrowUpDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
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

interface MapUsageEntry {
  id: string;
  requestId: string;
  patientName: string;
  agentName: string;
  timestamp: string;
  duration: number;
  viewCount: number;
  hasReport: boolean;
  reportDate?: string;
  billing: {
    mapUsage: number;
    reportFee: number;
    total: number;
    status: 'pending' | 'billed' | 'paid';
  };
}

// Generate mock data for the last 7 days
const generateDailyData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      searches: Math.floor(Math.random() * 30) + 10,
      duration: Math.floor(Math.random() * 180) + 60,
      revenue: Math.floor(Math.random() * 200) + 50
    });
  }
  return data;
};

const DAILY_USAGE_DATA = generateDailyData();

const MOCK_USAGE_DATA: MapUsageEntry[] = [
  {
    id: '1',
    requestId: 'MED-2024-001',
    patientName: 'Marie Dubois',
    agentName: 'Sophie Martin',
    timestamp: '2024-02-20T10:30:00Z',
    duration: 180,
    viewCount: 2,
    hasReport: true,
    reportDate: '2024-02-21T15:45:00Z',
    billing: {
      mapUsage: 10,
      reportFee: 15,
      total: 25,
      status: 'paid'
    }
  },
  {
    id: '2',
    requestId: 'MED-2024-002',
    patientName: 'Jean Martin',
    agentName: 'Jean Dupont',
    timestamp: '2024-02-20T11:15:00Z',
    duration: 240,
    viewCount: 3,
    hasReport: true,
    reportDate: '2024-02-22T09:30:00Z',
    billing: {
      mapUsage: 15,
      reportFee: 15,
      total: 30,
      status: 'billed'
    }
  },
  {
    id: '3',
    requestId: 'MED-2024-003',
    patientName: 'Sophie Bernard',
    agentName: 'Marie Bernard',
    timestamp: '2024-02-20T14:20:00Z',
    duration: 120,
    viewCount: 1,
    hasReport: false,
    billing: {
      mapUsage: 5,
      reportFee: 0,
      total: 5,
      status: 'pending'
    }
  },
  {
    id: '4',
    requestId: 'MED-2024-004',
    patientName: 'Lucas Petit',
    agentName: 'Sophie Martin',
    timestamp: '2024-02-21T09:45:00Z',
    duration: 300,
    viewCount: 4,
    hasReport: true,
    reportDate: '2024-02-23T11:20:00Z',
    billing: {
      mapUsage: 20,
      reportFee: 15,
      total: 35,
      status: 'pending'
    }
  },
  {
    id: '5',
    requestId: 'MED-2024-005',
    patientName: 'Emma Leroy',
    agentName: 'Jean Dupont',
    timestamp: '2024-02-21T13:10:00Z',
    duration: 150,
    viewCount: 2,
    hasReport: false,
    billing: {
      mapUsage: 10,
      reportFee: 0,
      total: 10,
      status: 'billed'
    }
  }
];

export function MapUsageDetails() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'billed' | 'paid'>('all');
  const [sortField, setSortField] = useState<keyof MapUsageEntry>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const chartData = {
    labels: DAILY_USAGE_DATA.map(d => new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Recherches',
        data: DAILY_USAGE_DATA.map(d => d.searches),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Durée moyenne (min)',
        data: DAILY_USAGE_DATA.map(d => Math.round(d.duration / 60)),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Revenu (€)',
        data: DAILY_USAGE_DATA.map(d => d.revenue),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
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
        text: 'Utilisation de la carte sur les 7 derniers jours'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valeur'
        }
      }
    }
  };

  const filteredData = MOCK_USAGE_DATA.filter(entry => {
    const matchesSearch = 
      entry.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.requestId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || 
      new Date(entry.timestamp).toISOString().split('T')[0] === dateFilter;

    const matchesStatus = statusFilter === 'all' || 
      entry.billing.status === statusFilter;

    return matchesSearch && matchesDate && matchesStatus;
  }).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (field: keyof MapUsageEntry) => {
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
      'ID Requête',
      'Patient',
      'Agent',
      'Date',
      'Durée (min)',
      'Nombre de vues',
      'Rapport disponible',
      'Date du rapport',
      'Frais carte',
      'Frais rapport',
      'Total',
      'Statut'
    ];

    // Prepare data rows
    const rows = filteredData.map(entry => [
      entry.requestId,
      entry.patientName,
      entry.agentName,
      new Date(entry.timestamp).toLocaleString('fr-FR'),
      Math.round(entry.duration / 60),
      entry.viewCount,
      entry.hasReport ? 'Oui' : 'Non',
      entry.reportDate ? new Date(entry.reportDate).toLocaleString('fr-FR') : '-',
      entry.billing.mapUsage + '€',
      entry.billing.reportFee + '€',
      entry.billing.total + '€',
      entry.billing.status
    ]);

    // Add summary row
    const totalMapUsage = filteredData.reduce((sum, entry) => sum + entry.billing.mapUsage, 0);
    const totalReportFees = filteredData.reduce((sum, entry) => sum + entry.billing.reportFee, 0);
    const totalAmount = filteredData.reduce((sum, entry) => sum + entry.billing.total, 0);

    rows.push([
      'TOTAL',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      totalMapUsage + '€',
      totalReportFees + '€',
      totalAmount + '€',
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
    link.setAttribute('download', `utilisation-carte_${new Date().toISOString().split('T')[0]}.csv`);
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getBillingStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      billed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const totalMapUsage = filteredData.reduce((sum, entry) => sum + entry.billing.mapUsage, 0);
  const totalReportFees = filteredData.reduce((sum, entry) => sum + entry.billing.reportFee, 0);
  const totalRevenue = totalMapUsage + totalReportFees;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Utilisation de la carte</h1>
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
              <p className="text-sm text-gray-600">Utilisation de la carte</p>
              <p className="text-2xl font-semibold text-gray-900">{totalMapUsage}€</p>
            </div>
            <Map className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rapports médicaux</p>
              <p className="text-2xl font-semibold text-gray-900">{totalReportFees}€</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenu total</p>
              <p className="text-2xl font-semibold text-gray-900">{totalRevenue}€</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <Line data={chartData} options={chartOptions} />
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
              <option value="pending">En attente</option>
              <option value="billed">Facturé</option>
              <option value="paid">Payé</option>
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
                  onClick={() => handleSort('agentName')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Agent</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('duration')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Durée</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('viewCount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Vues</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rapport
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facturation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{entry.requestId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{entry.patientName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{entry.agentName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{formatDateTime(entry.timestamp)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{formatDuration(entry.duration)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Eye className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{entry.viewCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {entry.hasReport ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBillingStatusColor(entry.billing.status)}`}>
                        {entry.billing.status.charAt(0).toUpperCase() + entry.billing.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-900">{entry.billing.total}€</span>
                    </div>
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
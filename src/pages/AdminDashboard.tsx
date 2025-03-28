import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map,
  FileText,
  DollarSign,
  Users,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  User
} from 'lucide-react';

// Mock data for admin dashboard
const MOCK_METRICS = {
  mapUsage: {
    totalSearches: 248,
    averageSearchesPerRequest: 2.4,
    totalRevenue: 1240,
    topAgents: [
      { name: 'Sophie Martin (MED-2024-001)', searches: 3 },
      { name: 'Jean Dupont (MED-2024-002)', searches: 2 },
      { name: 'Marie Bernard (MED-2024-003)', searches: 1 }
    ]
  },
  appointments: {
    total: 856,
    completed: 634,
    pendingReports: 45,
    completedReports: 589,
    reportRevenue: 8835,
    averageReportTime: '2.3 days',
    recentAppointments: [
      { id: 'APT-001', requestId: 'MED-2024-001', patientName: 'Marie Dubois', doctorName: 'Dr. Sarah Chen', date: '2024-02-25T10:30:00Z' },
      { id: 'APT-002', requestId: 'MED-2024-002', patientName: 'Jean Martin', doctorName: 'Dr. Thomas Martin', date: '2024-02-24T14:15:00Z' },
      { id: 'APT-003', requestId: 'MED-2024-003', patientName: 'Sophie Bernard', doctorName: 'Dr. Marie Laurent', date: '2024-02-23T09:00:00Z' }
    ]
  },
  payments: {
    totalPending: 15600,
    doctorsAwaitingPayment: 23,
    recentPayments: [
      { id: 'PAY-001', doctor: 'Dr. Sarah Chen', amount: 1200, date: '2024-02-15', reports: 8 },
      { id: 'PAY-002', doctor: 'Dr. Thomas Martin', amount: 800, date: '2024-02-14', reports: 5 },
      { id: 'PAY-003', doctor: 'Dr. Marie Laurent', amount: 1600, date: '2024-02-13', reports: 10 }
    ]
  }
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().toISOString().slice(0, 7));

  const handleGenerateReport = () => {
    // Prepare CSV headers
    const headers = [
      'Date',
      'Médecin',
      'Nombre de rapports',
      'Montant facturé',
      'Utilisation de la carte',
      'Frais de rapports',
      'Total'
    ];

    // Prepare CSV rows
    const rows = MOCK_METRICS.payments.recentPayments.map(payment => [
      payment.date,
      payment.doctor,
      payment.reports,
      payment.amount,
      (payment.amount * 0.4).toFixed(2), // 40% for map usage
      (payment.amount * 0.6).toFixed(2), // 60% for reports
      payment.amount
    ]);

    // Add summary row
    const totalReports = rows.reduce((sum, row) => sum + Number(row[2]), 0);
    const totalAmount = rows.reduce((sum, row) => sum + Number(row[3]), 0);
    const totalMapUsage = rows.reduce((sum, row) => sum + Number(row[4]), 0);
    const totalReportFees = rows.reduce((sum, row) => sum + Number(row[5]), 0);

    rows.push([
      'TOTAL',
      '',
      totalReports.toString(),
      totalAmount.toString(),
      totalMapUsage.toString(),
      totalReportFees.toString(),
      totalAmount.toString()
    ]);

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport-facturation-${selectedMonth}.csv`);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={handleGenerateReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Générer rapport CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisation de la carte</p>
              <p className="text-2xl font-semibold text-gray-900">{MOCK_METRICS.mapUsage.totalRevenue}€</p>
              <p className="text-sm text-gray-500">{MOCK_METRICS.mapUsage.totalSearches} recherches</p>
            </div>
            <Map className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rapports médicaux</p>
              <p className="text-2xl font-semibold text-gray-900">{MOCK_METRICS.appointments.reportRevenue}€</p>
              <p className="text-sm text-gray-500">{MOCK_METRICS.appointments.completedReports} rapports</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paiements en attente</p>
              <p className="text-2xl font-semibold text-gray-900">{MOCK_METRICS.payments.totalPending}€</p>
              <p className="text-sm text-gray-500">{MOCK_METRICS.payments.doctorsAwaitingPayment} médecins</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Usage Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Utilisation de la carte</h2>
            <button
              onClick={() => navigate('/admin/map-usage')}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              Voir détails
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            {MOCK_METRICS.mapUsage.topAgents.map((agent, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{agent.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{agent.searches} recherches</span>
                  <ArrowUpRight className={`h-4 w-4 ml-2 ${
                    agent.searches > 2 ? 'text-green-500' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Rendez-vous</h2>
            <button
              onClick={() => navigate('/admin/appointments')}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              Voir détails
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-600">Total</span>
                </div>
                <span className="text-lg font-medium text-gray-900">{MOCK_METRICS.appointments.total}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">Complétés</span>
                </div>
                <span className="text-lg font-medium text-gray-900">{MOCK_METRICS.appointments.completed}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_METRICS.appointments.recentAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                   onClick={() => navigate(`/request/${appointment.requestId}`)}>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-400 mr-1" />
                    
                    <span className="text-sm font-medium text-gray-900">{appointment.requestId}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{appointment.patientName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{formatDateTime(appointment.date)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{appointment.doctorName}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Paiements récents</h2>
            <button
              onClick={() => navigate('/admin/payments')}
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              Voir tous les paiements
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Médecin
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rapports
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_METRICS.payments.recentPayments.map((payment, index) => (
                  <tr key={payment.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate('/admin/payments')}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{payment.doctor}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{payment.reports} rapports</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{payment.amount}€</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{payment.date}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/admin/payments');
                        }}
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
    </div>
  );
}
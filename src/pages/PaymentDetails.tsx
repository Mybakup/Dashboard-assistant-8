import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Download,
  DollarSign,
  FileText,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface Payment {
  id: string;
  doctorId: string;
  doctorName: string;
  reports: number;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  reportIds: string[];
}

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'PAY-001',
    doctorId: 'DOC-001',
    doctorName: 'Dr. Sarah Chen',
    reports: 8,
    amount: 1200,
    date: '2024-02-15',
    status: 'pending',
    reportIds: ['REP-001', 'REP-002', 'REP-003', 'REP-004', 'REP-005', 'REP-006', 'REP-007', 'REP-008']
  },
  {
    id: 'PAY-002',
    doctorId: 'DOC-002',
    doctorName: 'Dr. Thomas Martin',
    reports: 5,
    amount: 800,
    date: '2024-02-14',
    status: 'paid',
    reportIds: ['REP-009', 'REP-010', 'REP-011', 'REP-012', 'REP-013']
  },
  {
    id: 'PAY-003',
    doctorId: 'DOC-003',
    doctorName: 'Dr. Marie Laurent',
    reports: 10,
    amount: 1600,
    date: '2024-02-13',
    status: 'processing',
    reportIds: ['REP-014', 'REP-015', 'REP-016', 'REP-017', 'REP-018', 'REP-019', 'REP-020', 'REP-021', 'REP-022', 'REP-023']
  }
];

export function PaymentDetails() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'paid' | 'failed'>('all');
  const [sortField, setSortField] = useState<keyof Payment>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const filteredPayments = MOCK_PAYMENTS.filter(payment => {
    const matchesSearch = 
      payment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !dateFilter || payment.date === dateFilter;
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;

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

  const handleSort = (field: keyof Payment) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInitiatePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPayment) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update payment status
      const updatedPayments = MOCK_PAYMENTS.map(p => 
        p.id === selectedPayment.id ? { ...p, status: 'processing' as const } : p
      );
      
      // In a real app, you would update the state through a proper state management solution
      console.log('Payment initiated:', selectedPayment);
      console.log('Updated payments:', updatedPayments);
      
      setShowPaymentModal(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Failed to initiate payment:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Médecin',
      'Rapports',
      'Montant',
      'Date',
      'Statut'
    ];

    const rows = filteredPayments.map(payment => [
      payment.id,
      payment.doctorName,
      payment.reports,
      payment.amount,
      payment.date,
      payment.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `paiements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: Payment['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <AlertTriangle className="h-4 w-4" />;
      case 'paid':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer le paiement
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Médecin</p>
                <p className="font-medium">{selectedPayment.doctorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nombre de rapports</p>
                <p className="font-medium">{selectedPayment.reports}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Montant total</p>
                <p className="font-medium">{selectedPayment.amount}€</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  En confirmant, vous autorisez le paiement de {selectedPayment.amount}€ à {selectedPayment.doctorName} pour {selectedPayment.reports} rapports médicaux.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Confirmer le paiement
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Download className="h-5 w-5 mr-2" />
          Exporter CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total à payer</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredPayments
                  .filter(p => p.status === 'pending')
                  .reduce((sum, p) => sum + p.amount, 0)}
                €
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rapports en attente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredPayments
                  .filter(p => p.status === 'pending')
                  .reduce((sum, p) => sum + p.reports, 0)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paiements en cours</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredPayments.filter(p => p.status === 'processing').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par médecin ou numéro..."
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
              <option value="processing">En cours</option>
              <option value="paid">Payé</option>
              <option value="failed">Échoué</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  onClick={() => handleSort('reports')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Rapports</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Montant</span>
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Statut</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.doctorName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{payment.reports} rapports</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.amount}€
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      <span className="mr-1">{getStatusIcon(payment.status)}</span>
                      {payment.status === 'pending' ? 'En attente' :
                       payment.status === 'processing' ? 'En cours' :
                       payment.status === 'paid' ? 'Payé' : 'Échoué'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => handleInitiatePayment(payment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Payer
                      </button>
                    )}
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